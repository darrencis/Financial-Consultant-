"""Pydantic AI agents - Risk Coach + Optimizer."""
from dataclasses import dataclass
from typing import Any

from pydantic import BaseModel, Field
from pydantic_ai import Agent

from engine.models import UserProfile, LiveRates, AccountType


class InvestmentRecommendation(BaseModel):
    """Structured output from the AI agent for a single recommendation card."""

    title: str
    account_type: str = Field(description="One of: tfsa, rrsp, hisa, gic, etf, cash")
    suggested_allocation_pct: float = Field(..., ge=0, le=100)
    headline: str
    pros: list[str] = Field(..., min_length=1)
    cons: list[str] = Field(..., min_length=1)
    risk_score: int = Field(..., ge=1, le=10)
    is_recommended: bool
    rationale: str = Field(..., max_length=800)


class RecommendationsAIOutput(BaseModel):
    """Full structured output from the recommendation agent."""

    recommendations: list[InvestmentRecommendation] = Field(..., min_length=2, max_length=5)
    summary: str = Field(..., max_length=800)


class RiskAssessment(BaseModel):
    risk_score: int = Field(..., ge=1, le=10)
    risk_factors: list[str]
    advice: str = Field(..., max_length=500)
    badge: str | None = None


@dataclass
class RecommendationDeps:
    """Context for the recommendation agent."""

    profile: UserProfile
    inflow_amount: float
    inflow_notes: str
    rates: LiveRates
    portfolio_summary: str


@dataclass
class RiskDeps:
    """Context for the risk assessment agent."""

    profile: UserProfile
    portfolio_summary: str


RECOMMENDATION_SYSTEM_PROMPT = """
You are a Canadian personal finance advisor for HiveTwin.
Consider the user's persona (student = conservative, employed = more options)
Consider their goals, existing portfolio, TFSA/RRSP room
Always suggest 2-4 options (never just one)
One option should always be "keep as cash" for liquidity
For students: lean conservative (HISA, GIC). For employed: include ETF options.
Use CANADIAN vehicles: TFSA, RRSP, FHSA. Never suggest US-specific accounts.
Frame as "this option could..." not "you should..." — educational, not advisory
Include clear pros and cons for each option
Mark exactly one option as is_recommended: true
"""


# Cheap OpenAI model: gpt-4o-mini (~$0.15/1M input, ~$0.60/1M output)
OPENAI_MODEL = "openai:gpt-4o-mini"

# Lazy-init: Agent created on first use so server starts without OPENAI_API_KEY
_recommendation_agent: Agent[RecommendationDeps, RecommendationsAIOutput] | None = None
_risk_agent: Agent[RiskDeps, RiskAssessment] | None = None


def _get_recommendation_agent() -> Agent[RecommendationDeps, RecommendationsAIOutput]:
    global _recommendation_agent
    if _recommendation_agent is None:
        _recommendation_agent = Agent(
            OPENAI_MODEL,
            deps_type=RecommendationDeps,
            output_type=RecommendationsAIOutput,
            instructions=RECOMMENDATION_SYSTEM_PROMPT,
        )
    return _recommendation_agent


def _get_risk_agent() -> Agent[RiskDeps, RiskAssessment]:
    global _risk_agent
    if _risk_agent is None:
        _risk_agent = Agent(
            OPENAI_MODEL,
            deps_type=RiskDeps,
            output_type=RiskAssessment,
            instructions="You are a risk assessment coach for Canadian personal finance.",
        )
    return _risk_agent


def _build_recommendation_context(d: RecommendationDeps) -> str:
    return f"""
User profile:
- Name: {d.profile.name}
- Persona: {d.profile.persona.value}
- Annual income: ${d.profile.annual_income:,.0f} CAD
- Province: {d.profile.province}
- Age: {d.profile.age}
- Goals: {d.profile.financial_goals or "Not specified"}
- Existing savings: ${d.profile.existing_savings:,.0f}
- TFSA room: ${d.profile.tfsa_room:,.0f}
- RRSP room: ${d.profile.rrsp_room:,.0f}
- Monthly rent: ${d.profile.monthly_rent:,.0f}
- Monthly expenses: ${d.profile.monthly_expenses:,.0f}

Cash inflow to allocate: ${d.inflow_amount:,.2f} CAD
Notes: {d.inflow_notes or "None"}

Current market rates:
- HISA: {d.rates.hisa_rate}%
- GIC 1yr: {d.rates.gic_1yr_rate}%
- ETF VGRO YTD: {d.rates.etf_vgro_ytd}%
- BoC overnight: {d.rates.boc_overnight}%

Current portfolio: {d.portfolio_summary}

Generate 2-4 investment options. suggested_allocation_pct is what % of the ${d.inflow_amount:,.2f} to put in that option (should sum to ~100 or less if keeping some unallocated).
"""


async def run_recommendation_agent(deps: RecommendationDeps) -> RecommendationsAIOutput:
    """Run the recommendation agent."""
    import os
    if not os.environ.get("OPENAI_API_KEY"):
        raise ValueError(
            "OPENAI_API_KEY is not set. Set it in .env to use the recommendation agent."
        )
    agent = _get_recommendation_agent()
    msg = _build_recommendation_context(deps) + "\n\nGenerate investment recommendations for this cash inflow."
    result = await agent.run(msg, deps=deps)
    return result.output


async def run_risk_agent(deps: RiskDeps) -> RiskAssessment:
    """Run the risk assessment agent."""
    import os
    if not os.environ.get("OPENAI_API_KEY"):
        raise ValueError(
            "OPENAI_API_KEY is not set. Set it in .env to use the risk agent."
        )
    agent = _get_risk_agent()
    result = await agent.run(
        "Assess the user's portfolio risk and provide advice.",
        deps=deps,
    )
    return result.output
