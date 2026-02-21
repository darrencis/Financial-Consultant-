"""Smoke test: create user, test calculator, verify math."""
import asyncio
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from engine.calculator import (
    compound_growth,
    apply_tax_drag,
    project_option,
    calculate_portfolio_value,
)
from engine.models import AccountType, CommittedDecision
from datetime import datetime, timedelta, timezone


def test_compound_growth():
    """Test compound_growth with known inputs."""
    result = compound_growth(principal=1000, monthly_add=100, annual_rate_pct=6, years=2)
    assert len(result) == 2
    assert result[0]["year"] == 1
    assert result[0]["balance"] > 2200
    assert result[0]["contributed"] == 1000 + 1200
    print("compound_growth: OK", result[0])


def test_apply_tax_drag():
    """Test tax drag by account type."""
    # TFSA: no drag
    assert apply_tax_drag(6.0, AccountType.TFSA, "BC") == 6.0
    # CASH: 0
    assert apply_tax_drag(6.0, AccountType.CASH, "BC") == 0.0
    # HISA: reduced by marginal rate
    hisa = apply_tax_drag(4.0, AccountType.HISA, "BC")
    assert hisa < 4.0
    print("apply_tax_drag: OK", hisa)


def test_project_option():
    """Test project_option returns 1yr, 5yr, 10yr."""
    proj = project_option(5000, AccountType.TFSA, 6.5, "BC")
    assert "projection_1yr" in proj
    assert "projection_5yr" in proj
    assert "projection_10yr" in proj
    assert proj["projection_1yr"] > 5000
    assert proj["projection_10yr"] > proj["projection_5yr"]
    print("project_option: OK", proj)


def test_calculate_portfolio_value():
    """Test portfolio value with mock decisions."""
    now = datetime.now(timezone.utc)
    past = now - timedelta(days=365)
    decisions = [
        CommittedDecision(
            id="d1",
            user_id="u1",
            inflow_id="i1",
            card_id="c1",
            account_type=AccountType.TFSA,
            amount=3000,
            annual_return_pct=6.5,
            committed_at=past,
        ),
    ]
    portfolio = calculate_portfolio_value(decisions, "BC", as_of=now)
    assert len(portfolio) == 1
    assert portfolio[0].account_type == AccountType.TFSA
    assert portfolio[0].total_invested == 3000
    assert portfolio[0].current_value > 3000
    assert portfolio[0].growth > 0
    print("calculate_portfolio_value: OK", portfolio[0])


def main():
    test_compound_growth()
    test_apply_tax_drag()
    test_project_option()
    test_calculate_portfolio_value()
    print("\nAll smoke tests passed.")


if __name__ == "__main__":
    main()
