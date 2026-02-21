"""Pure deterministic financial math. Zero AI/LLM dependencies."""
import math
from datetime import datetime

from engine.models import AccountType, CommittedDecision, PortfolioItem

PROVINCIAL_TAX_RATES = {
    "BC": 0.312,
    "AB": 0.305,
    "ON": 0.293,
    "QC": 0.410,
    "SK": 0.305,
    "MB": 0.338,
    "NB": 0.295,
    "NS": 0.370,
    "PE": 0.342,
    "NL": 0.347,
}


def compound_growth(
    principal: float,
    monthly_add: float,
    annual_rate_pct: float,
    years: int,
) -> list[dict]:
    """
    Monthly compounding. Returns yearly snapshots.
    Each snapshot: {year, balance, contributed, growth}
    """
    monthly_rate = (annual_rate_pct / 100) / 12
    balance = principal
    total_contributed = principal
    snapshots = []

    for year in range(1, years + 1):
        for _ in range(12):
            balance = balance * (1 + monthly_rate) + monthly_add
            total_contributed += monthly_add
        growth = balance - total_contributed
        snapshots.append({
            "year": year,
            "balance": round(balance, 2),
            "contributed": round(total_contributed, 2),
            "growth": round(growth, 2),
        })
    return snapshots


def apply_tax_drag(
    gross_return: float,
    account_type: AccountType,
    province: str,
) -> float:
    """
    TFSA: 0% tax drag (tax-free)
    RRSP: 0% drag during accumulation (tax-deferred)
    HISA/GIC: Full marginal rate on interest income
    ETF (non-registered): 50% capital gains inclusion rate
    CASH: 0% return anyway
    """
    if account_type == AccountType.CASH:
        return 0.0
    if account_type in (AccountType.TFSA, AccountType.RRSP):
        return gross_return
    if account_type in (AccountType.HISA, AccountType.GIC):
        marginal = PROVINCIAL_TAX_RATES.get(province, 0.30)
        return gross_return * (1 - marginal)
    if account_type == AccountType.ETF:
        marginal = PROVINCIAL_TAX_RATES.get(province, 0.30)
        return gross_return * (1 - 0.5 * marginal)
    return gross_return


def project_option(
    amount: float,
    account_type: AccountType,
    annual_rate: float,
    province: str,
) -> dict:
    """
    Given a lump sum, project its value at 1yr, 5yr, 10yr.
    Apply tax drag based on account type.
    Returns: {projection_1yr, projection_5yr, projection_10yr}
    """
    effective_rate = apply_tax_drag(annual_rate, account_type, province) / 100
    if account_type == AccountType.CASH:
        effective_rate = 0.0

    def fv(years: int) -> float:
        return amount * ((1 + effective_rate / 12) ** (12 * years))

    return {
        "projection_1yr": round(fv(1), 2),
        "projection_5yr": round(fv(5), 2),
        "projection_10yr": round(fv(10), 2),
    }


def calculate_portfolio_value(
    decisions: list[CommittedDecision],
    province: str,
    as_of: datetime | None = None,
) -> list[PortfolioItem]:
    """
    Given all committed decisions, calculate current portfolio value.
    Apply compound growth from each decision's committed_at date to now.
    Group by account_type.
    """
    as_of = as_of or datetime.utcnow()
    by_account: dict[AccountType, list[tuple[float, datetime, float]]] = {}

    for d in decisions:
        if d.account_type not in by_account:
            by_account[d.account_type] = []
        by_account[d.account_type].append(
            (d.amount, d.committed_at, d.annual_return_pct)
        )

    result = []
    for account_type, entries in by_account.items():
        total_invested = sum(e[0] for e in entries)
        current_value = 0.0
        for amount, committed_at, rate in entries:
            months_held = max(
                0,
                (as_of.year - committed_at.year) * 12
                + (as_of.month - committed_at.month),
            )
            monthly_rate = (rate / 100) / 12
            current_value += amount * ((1 + monthly_rate) ** months_held)
        growth = current_value - total_invested
        growth_pct = (growth / total_invested * 100) if total_invested > 0 else 0
        result.append(
            PortfolioItem(
                account_type=account_type,
                total_invested=round(total_invested, 2),
                current_value=round(current_value, 2),
                growth=round(growth, 2),
                growth_pct=round(growth_pct, 2),
            )
        )
    return result
