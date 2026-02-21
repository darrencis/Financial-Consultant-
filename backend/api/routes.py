"""FastAPI endpoints."""
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from db.database import get_db, init_db
from db import crud
from engine.models import (
    UserProfileCreate,
    UserProfile,
    CashInflowCreate,
    CashInflow,
    CommitDecisionCreate,
    CommittedDecision,
    RecommendationCard,
    RecommendationsResponse,
    DashboardResponse,
    LiveRates,
    AccountType,
    PortfolioItem,
)
from engine.rates import fetch_live_rates
from engine.agents import run_recommendation_agent, RecommendationDeps
from engine.calculator import (
    project_option,
    calculate_portfolio_value,
)

router = APIRouter()


@router.get("/health")
async def health(db: AsyncSession = Depends(get_db)):
    """Health check."""
    rates_live = False
    try:
        rates = await fetch_live_rates()
        rates_live = not rates.is_fallback
    except Exception:
        pass
    return {"status": "ok", "db": "connected", "rates_live": rates_live}


@router.get("/rates", response_model=LiveRates)
async def get_rates():
    """Current Canadian market rates. Cached 1 hour."""
    return await fetch_live_rates()


@router.post("/users", response_model=UserProfile)
async def create_user(
    data: UserProfileCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new user profile."""
    return await crud.create_user(db, data)


@router.get("/users/{user_id}", response_model=UserProfile)
async def get_user(
    user_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get user profile by ID."""
    user = await crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/users/{user_id}/inflows", response_model=CashInflow)
async def create_inflow(
    user_id: str,
    data: CashInflowCreate,
    db: AsyncSession = Depends(get_db),
):
    """Record a new cash inflow. Does NOT generate recommendations yet."""
    user = await crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return await crud.create_inflow(db, user_id, data)


@router.post("/users/{user_id}/inflows/{inflow_id}/recommend", response_model=RecommendationsResponse)
async def recommend(
    user_id: str,
    inflow_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Generate AI recommendation cards for a specific inflow."""
    user = await crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    inflow = await crud.get_inflow(db, inflow_id, user_id)
    if not inflow:
        raise HTTPException(status_code=404, detail="Inflow not found")

    rates = await fetch_live_rates()
    decisions = await crud.get_user_decisions(db, user_id)
    portfolio_items = calculate_portfolio_value(decisions, user.province)
    portfolio_summary = ", ".join(
        f"{p.account_type.value}: ${p.current_value:,.0f}"
        for p in portfolio_items
    ) if portfolio_items else "No investments yet"

    deps = RecommendationDeps(
        profile=user,
        inflow_amount=inflow.amount,
        inflow_notes=inflow.notes,
        rates=rates,
        portfolio_summary=portfolio_summary,
    )

    try:
        ai_output = await run_recommendation_agent(deps)
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Recommendation failed: {str(e)}")

    rate_map = {
        "tfsa": rates.etf_vgro_ytd,
        "rrsp": rates.etf_vgro_ytd,
        "hisa": rates.hisa_rate,
        "gic": rates.gic_1yr_rate,
        "etf": rates.etf_vgro_ytd,
        "cash": 0.0,
    }

    cards = []
    for i, rec in enumerate(ai_output.recommendations):
        acct = AccountType(rec.account_type.lower())
        rate = rate_map.get(rec.account_type.lower(), rates.hisa_rate)
        proj = project_option(
            inflow.amount * (rec.suggested_allocation_pct / 100),
            acct,
            rate,
            user.province,
        )
        cards.append(
            RecommendationCard(
                card_id=f"{inflow_id}-card-{i}",
                title=rec.title,
                account_type=acct,
                suggested_amount=inflow.amount * (rec.suggested_allocation_pct / 100),
                annual_return_pct=rate,
                headline=rec.headline,
                pros=rec.pros,
                cons=rec.cons,
                projection_1yr=proj["projection_1yr"],
                projection_5yr=proj["projection_5yr"],
                projection_10yr=proj["projection_10yr"],
                risk_score=rec.risk_score,
                is_recommended=rec.is_recommended,
                rationale=rec.rationale,
            )
        )

    return RecommendationsResponse(
        inflow_id=inflow_id,
        cards=cards,
        summary=ai_output.summary,
        generated_at=datetime.utcnow(),
    )


@router.post("/users/{user_id}/commit", response_model=CommittedDecision)
async def commit(
    user_id: str,
    data: CommitDecisionCreate,
    db: AsyncSession = Depends(get_db),
):
    """Commit to a recommendation. User picks a card."""
    user = await crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    inflow = await crud.get_inflow(db, data.inflow_id, user_id)
    if not inflow:
        raise HTTPException(status_code=404, detail="Inflow not found")
    return await crud.create_decision(db, user_id, data)


@router.get("/users/{user_id}/dashboard", response_model=DashboardResponse)
async def dashboard(
    user_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Full dashboard view."""
    user = await crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    decisions = await crud.get_user_decisions(db, user_id)
    portfolio = calculate_portfolio_value(decisions, user.province)

    total_net_worth = sum(p.current_value for p in portfolio) + user.existing_savings
    total_invested = sum(p.total_invested for p in portfolio) + user.existing_savings
    total_growth = sum(p.growth for p in portfolio)
    monthly_income = user.annual_income / 12
    monthly_expenses = user.monthly_rent + user.monthly_expenses
    monthly_free_cash = monthly_income - monthly_expenses

    recent = decisions[:10]

    return DashboardResponse(
        user=user,
        portfolio=portfolio,
        total_net_worth=round(total_net_worth, 2),
        total_invested=round(total_invested, 2),
        total_growth=round(total_growth, 2),
        monthly_income=round(monthly_income, 2),
        monthly_expenses=round(monthly_expenses, 2),
        monthly_free_cash=round(monthly_free_cash, 2),
        recent_decisions=recent,
    )
