"""DB table models."""
from datetime import datetime
from sqlalchemy import String, DateTime, Float, Text, Integer, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


class UserTable(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    persona: Mapped[str] = mapped_column(String(20))
    annual_income: Mapped[float] = mapped_column(Float)
    province: Mapped[str] = mapped_column(String(10), default="BC")
    age: Mapped[int] = mapped_column(Integer, default=25)
    financial_goals: Mapped[str] = mapped_column(Text, default="")
    existing_savings: Mapped[float] = mapped_column(Float, default=0)
    monthly_rent: Mapped[float] = mapped_column(Float, default=0)
    monthly_expenses: Mapped[float] = mapped_column(Float, default=0)
    tfsa_room: Mapped[float] = mapped_column(Float, default=7000)
    rrsp_room: Mapped[float] = mapped_column(Float, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    inflows = relationship("CashInflowTable", back_populates="user")
    decisions = relationship("CommittedDecisionTable", back_populates="user")


class CashInflowTable(Base):
    __tablename__ = "cash_inflows"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"))
    amount: Mapped[float] = mapped_column(Float)
    source: Mapped[str] = mapped_column(String(50), default="")
    notes: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("UserTable", back_populates="inflows")


class CommittedDecisionTable(Base):
    __tablename__ = "committed_decisions"

    id: Mapped[str] = mapped_column(String(36), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"))
    inflow_id: Mapped[str] = mapped_column(String(36), ForeignKey("cash_inflows.id"))
    card_id: Mapped[str] = mapped_column(String(36))
    account_type: Mapped[str] = mapped_column(String(20))
    amount: Mapped[float] = mapped_column(Float)
    annual_return_pct: Mapped[float] = mapped_column(Float)
    committed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("UserTable", back_populates="decisions")
