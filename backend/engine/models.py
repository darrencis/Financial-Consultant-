"""All Pydantic data contracts for HiveTwin."""
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field


class Persona(str, Enum):
    STUDENT = "student"
    UNEMPLOYED = "unemployed"
    EMPLOYED = "employed"


class AccountType(str, Enum):
    TFSA = "tfsa"
    RRSP = "rrsp"
    HISA = "hisa"
    GIC = "gic"
    ETF = "etf"
    CASH = "cash"


class UserProfileCreate(BaseModel):
    name: str
    persona: Persona
    annual_income: float = Field(..., gt=0)
    province: str = Field("BC", description="Province code for tax brackets")
    age: int = Field(25, ge=18, le=70)
    financial_goals: str = ""
    existing_savings: float = Field(0, ge=0)
    monthly_rent: float = Field(0, ge=0)
    monthly_expenses: float = Field(0, ge=0)
    tfsa_room: float = Field(7000, ge=0)
    rrsp_room: float = Field(0, ge=0)


class UserProfile(UserProfileCreate):
    id: str
    created_at: datetime

    @property
    def monthly_income(self) -> float:
        return self.annual_income / 12


class CashInflowCreate(BaseModel):
    amount: float = Field(..., gt=0, description="Amount received in CAD")
    source: str = ""
    notes: str = ""


class CashInflow(CashInflowCreate):
    id: str
    user_id: str
    created_at: datetime


class RecommendationCard(BaseModel):
    """One investment option card shown to the user."""

    card_id: str
    title: str
    account_type: AccountType
    suggested_amount: float
    annual_return_pct: float
    headline: str
    pros: list[str]
    cons: list[str]
    projection_1yr: float
    projection_5yr: float
    projection_10yr: float
    risk_score: int = Field(..., ge=1, le=10)
    is_recommended: bool = False
    rationale: str


class RecommendationsResponse(BaseModel):
    inflow_id: str
    cards: list[RecommendationCard]
    summary: str
    generated_at: datetime
    disclaimer: str = (
        "Educational simulation. Not financial advice. "
        "Past rates do not guarantee future returns."
    )


class CommitDecisionCreate(BaseModel):
    inflow_id: str
    card_id: str
    amount: float = Field(..., gt=0)
    account_type: AccountType
    annual_return_pct: float = Field(..., ge=0)


class CommittedDecision(CommitDecisionCreate):
    id: str
    user_id: str
    account_type: AccountType
    annual_return_pct: float
    committed_at: datetime


class PortfolioItem(BaseModel):
    account_type: AccountType
    total_invested: float
    current_value: float
    growth: float
    growth_pct: float


class DashboardResponse(BaseModel):
    user: UserProfile
    portfolio: list[PortfolioItem]
    total_net_worth: float
    total_invested: float
    total_growth: float
    monthly_income: float
    monthly_expenses: float
    monthly_free_cash: float
    recent_decisions: list[CommittedDecision]


class LiveRates(BaseModel):
    hisa_rate: float
    gic_1yr_rate: float
    etf_vgro_ytd: float
    boc_overnight: float
    fetched_at: datetime
    is_fallback: bool = False
