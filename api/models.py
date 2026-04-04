from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
import datetime
from .database import Base

class Borrower(Base):
    __tablename__ = "borrowers"

    id = Column(String, primary_key=True, index=True) # e.g., LEN-091220
    name = Column(String, index=True)
    phone = Column(String)
    mono_code = Column(String, nullable=True)  # Open Banking Auth token
    risk_score = Column(Integer, nullable=True)
    risk_category = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    transactions = relationship("Transaction", back_populates="borrower")
    loans = relationship("Loan", back_populates="borrower")

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(String, primary_key=True, index=True)
    borrower_id = Column(String, ForeignKey("borrowers.id"))
    amount = Column(Float)
    category = Column(String) # Betting, Rent, Salary, etc
    narrative = Column(String)
    timestamp = Column(DateTime)
    is_income = Column(Boolean)
    balance_after = Column(Float)

    borrower = relationship("Borrower", back_populates="transactions")

class Loan(Base):
    __tablename__ = "loans"

    id = Column(String, primary_key=True, index=True)
    borrower_id = Column(String, ForeignKey("borrowers.id"))
    principal_amount = Column(Float)
    issued_on = Column(DateTime, default=datetime.datetime.utcnow)
    next_due_date = Column(DateTime, nullable=True)
    status = Column(String, default="Active") # Active, Repaid, Delinquent

    borrower = relationship("Borrower", back_populates="loans")

class RiskAlert(Base):
    __tablename__ = "risk_alerts"

    id = Column(Integer, primary_key=True, index=True)
    borrower_id = Column(String, ForeignKey("borrowers.id"))
    alert_type = Column(String) # e.g., 'Betting Influx' or 'Survival Drop'
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    resolved = Column(Boolean, default=False)
