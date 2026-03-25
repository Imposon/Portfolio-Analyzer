from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

# Create SQLite database in the data directory
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "investment_advisor.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

# Create engine with check_same_thread=False for SQLite
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class UserInput(Base):
    """Stores user investment preferences and parameters."""
    __tablename__ = "user_inputs"
    
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    risk_level = Column(String, nullable=False)  # low, medium, high
    time_horizon = Column(Integer, nullable=False)  # years
    goal = Column(String, nullable=False)  # wealth, tax, passive, capital
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship to portfolios
    portfolios = relationship("Portfolio", back_populates="user_input", cascade="all, delete-orphan")


class Portfolio(Base):
    """Stores generated portfolio allocation and AI explanation."""
    __tablename__ = "portfolios"
    
    id = Column(Integer, primary_key=True, index=True)
    user_input_id = Column(Integer, ForeignKey("user_inputs.id"), nullable=False)
    allocation_json = Column(Text, nullable=False)  # JSON string of allocation percentages
    assets_json = Column(Text, nullable=False)  # JSON string of selected assets
    ai_explanation = Column(Text, nullable=True)  # Groq-generated explanation
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship to user input
    user_input = relationship("UserInput", back_populates="portfolios")


def init_db():
    """Initialize the database and create all tables."""
    # Ensure data directory exists
    data_dir = os.path.dirname(DB_PATH)
    os.makedirs(data_dir, exist_ok=True)
    Base.metadata.create_all(bind=engine)


def get_db():
    """Get database session dependency for FastAPI."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
