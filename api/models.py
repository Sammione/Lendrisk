from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="loan_officer")  # admin, loan_officer, viewer
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    # Relationships
    audit_logs = relationship("AuditLog", back_populates="user")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    action = Column(String, nullable=False)  # login, logout, create_borrower, etc.
    resource = Column(String, nullable=True)  # borrower, loan, alert, etc.
    resource_id = Column(String, nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="audit_logs")


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
