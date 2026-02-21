"""Optional: seed sample data for testing."""
import asyncio
from db.database import AsyncSessionLocal, init_db
from db import crud
from engine.models import UserProfileCreate, Persona, CashInflowCreate, CommitDecisionCreate, AccountType


async def seed():
    await init_db()
    async with AsyncSessionLocal() as db:
        user = await crud.create_user(
            db,
            UserProfileCreate(
                name="John",
                persona=Persona.EMPLOYED,
                annual_income=72000,
                province="BC",
                age=28,
                financial_goals="Save for a house and retire early",
                existing_savings=5000,
                monthly_rent=2000,
                monthly_expenses=500,
                tfsa_room=7000,
                rrsp_room=15000,
            ),
        )
        print(f"Created user: {user.id}")

        inflow = await crud.create_inflow(
            db,
            user.id,
            CashInflowCreate(
                amount=5000,
                source="salary",
                notes="Monthly paycheck, want to invest most of it",
            ),
        )
        print(f"Created inflow: {inflow.id}")

        # Optional: commit a decision
        # decision = await crud.create_decision(
        #     db, user.id,
        #     CommitDecisionCreate(
        #         inflow_id=inflow.id,
        #         card_id="test-card",
        #         amount=3000,
        #         account_type=AccountType.TFSA,
        #         annual_return_pct=6.5,
        #     ),
        # )
        # print(f"Created decision: {decision.id}")

    print("Seed complete. Run POST /api/users/{user_id}/inflows/{inflow_id}/recommend to get recommendations.")


if __name__ == "__main__":
    asyncio.run(seed())
