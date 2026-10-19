from sqlalchemy import Column, Integer, String, Float, Boolean, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

class Account(Base):
    __tablename__ = "accounts"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    account_type = Column(String, nullable=False)  # checking, savings, credit_card, loan
    balance = Column(Float, default=0.0)
    currency = Column(String, default="USD")
    updated_at = Column(DateTime, default=datetime.utcnow)

    transactions = relationship("Transaction", back_populates="account")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True)
    account_id = Column(String, ForeignKey("accounts.id"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)  # positive for debit/spend, positive for credit depending on type
    tx_type = Column(String, nullable=False)  # "debit" or "credit"
    category = Column(String, nullable=False, index=True)
    confidence = Column(Float, default=1.0)
    needs_review = Column(Boolean, default=False)
    is_recurring = Column(Boolean, default=False)
    is_user_overridden = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    account = relationship("Account", back_populates="transactions")

class CategoryOverride(Base):
    __tablename__ = "category_overrides"

    id = Column(Integer, primary_key=True, autoincrement=True)
    merchant_pattern = Column(String, unique=True, nullable=False, index=True)
    assigned_category = Column(String, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Goal(Base):
    __tablename__ = "goals"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    monthly_contribution = Column(Float, default=0.0)
    deadline = Column(Date, nullable=False)
    category = Column(String, default="General Savings")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class RecurringRule(Base):
    __tablename__ = "recurring_rules"

    id = Column(Integer, primary_key=True, autoincrement=True)
    description_pattern = Column(String, nullable=False)
    expected_amount = Column(Float, nullable=False)
    period_days = Column(Integer, default=30)  # 14 for bi-weekly, 30 for monthly
    category = Column(String, nullable=False)
    is_income = Column(Boolean, default=False)
