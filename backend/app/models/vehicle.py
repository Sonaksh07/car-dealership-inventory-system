from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from app.core.database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    make = Column(String(50), nullable=False, index=True)
    model = Column(String(50), nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)  # Sedan, SUV, Sports, Truck, EV, Coupe, etc.
    price = Column(Float, nullable=False, index=True)
    quantity = Column(Integer, nullable=False, default=1)
    year = Column(Integer, nullable=True)
    vin = Column(String(50), nullable=True, unique=True)
    description = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
