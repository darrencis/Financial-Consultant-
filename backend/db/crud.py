"""Database operations."""
import uuid
from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from engine.models import (
    UserProfile,
    UserProfileCreate,
    Persona,
    CashInflow,
    CashInflowCreate,
    CommittedDecision,
    CommitDecisionCreate,
    AccountType,
)
from db.tables import UserTable, CashInflowTable, CommittedDecisionTable


def _generate_id() -> str:
    return str(uuid.uuid4())


async def create_user(db: AsyncSession, data: UserProfileCreate) -> UserProfile:
    """Create a new user profile."""
    now = datetime.utcnow()
    row = UserTable(
        id=_generate_id(),
        name=data.name,
        persona=data.persona.value,
        annual_income=data.annual_income,
        province=data.province,
        age=data.age,
        financial_goals=data.financial_goals,
        existing_savings=data.existing_savings,
        monthly_rent=data.monthly_rent,
        monthly_expenses=data.monthly_expenses,
        tfsa_room=data.tfsa_room,
        rrsp_room=data.rrsp_room,
        created_at=now,
    )
    db.add(row)
    await db.flush()
    return UserProfile(
        id=row.id,
        created_at=row.created_at,
        **data.model_dump(),
    )


async def get_user(db: AsyncSession, user_id: str) -> UserProfile | None:
    """Get user by ID."""
    result = await db.execute(select(UserTable).where(UserTable.id == user_id))
    row = result.scalar_one_or_none()
    if not row:
        return None
    return UserProfile(
        id=row.id,
        name=row.name,
        persona=Persona(row.persona),
        annual_income=row.annual_income,
        province=row.province,
        age=row.age,
        financial_goals=row.financial_goals,
        existing_savings=row.existing_savings,
        monthly_rent=row.monthly_rent,
        monthly_expenses=row.monthly_expenses,
        tfsa_room=row.tfsa_room,
        rrsp_room=row.rrsp_room,
        created_at=row.created_at,
    )


async def create_inflow(
    db: AsyncSession,
    user_id: str,
    data: CashInflowCreate,
) -> CashInflow:
    """Record a new cash inflow."""
    row = CashInflowTable(
        id=_generate_id(),
        user_id=user_id,
        amount=data.amount,
        source=data.source,
        notes=data.notes,
    )
    db.add(row)
    await db.flush()
    return CashInflow(
        id=row.id,
        user_id=row.user_id,
        amount=row.amount,
        source=row.source,
        notes=row.notes,
        created_at=row.created_at,
    )


async def get_inflow(
    db: AsyncSession,
    inflow_id: str,
    user_id: str | None = None,
) -> CashInflow | None:
    """Get inflow by ID, optionally scoped to user."""
    q = select(CashInflowTable).where(CashInflowTable.id == inflow_id)
    if user_id:
        q = q.where(CashInflowTable.user_id == user_id)
    result = await db.execute(q)
    row = result.scalar_one_or_none()
    if not row:
        return None
    return CashInflow(
        id=row.id,
        user_id=row.user_id,
        amount=row.amount,
        source=row.source,
        notes=row.notes,
        created_at=row.created_at,
    )


async def get_user_inflows(
    db: AsyncSession,
    user_id: str,
) -> list[CashInflow]:
    """Get all inflows for a user."""
    result = await db.execute(
        select(CashInflowTable)
        .where(CashInflowTable.user_id == user_id)
        .order_by(CashInflowTable.created_at.desc())
    )
    rows = result.scalars().all()
    return [
        CashInflow(
            id=r.id,
            user_id=r.user_id,
            amount=r.amount,
            source=r.source,
            notes=r.notes,
            created_at=r.created_at,
        )
        for r in rows
    ]


async def create_decision(
    db: AsyncSession,
    user_id: str,
    data: CommitDecisionCreate,
) -> CommittedDecision:
    """Store a committed decision."""
    row = CommittedDecisionTable(
        id=_generate_id(),
        user_id=user_id,
        inflow_id=data.inflow_id,
        card_id=data.card_id,
        account_type=data.account_type.value,
        amount=data.amount,
        annual_return_pct=data.annual_return_pct,
    )
    db.add(row)
    await db.flush()
    return CommittedDecision(
        id=row.id,
        user_id=row.user_id,
        inflow_id=row.inflow_id,
        card_id=row.card_id,
        account_type=data.account_type,
        amount=row.amount,
        annual_return_pct=row.annual_return_pct,
        committed_at=row.committed_at,
    )


async def get_user_decisions(
    db: AsyncSession,
    user_id: str,
) -> list[CommittedDecision]:
    """Get all committed decisions for a user."""
    result = await db.execute(
        select(CommittedDecisionTable)
        .where(CommittedDecisionTable.user_id == user_id)
        .order_by(CommittedDecisionTable.committed_at.desc())
    )
    rows = result.scalars().all()
    return [
        CommittedDecision(
            id=r.id,
            user_id=r.user_id,
            inflow_id=r.inflow_id,
            card_id=r.card_id,
            account_type=AccountType(r.account_type),
            amount=r.amount,
            annual_return_pct=r.annual_return_pct,
            committed_at=r.committed_at,
        )
        for r in rows
    ]
