from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict


class VehicleBase(BaseModel):
    make: str = Field(..., min_length=1, max_length=50)
    model: str = Field(..., min_length=1, max_length=50)
    category: str = Field(..., min_length=1, max_length=50)
    price: float = Field(..., gt=0, description="Price must be strictly positive")
    quantity: int = Field(..., ge=0, description="Quantity must be non-negative")
    year: Optional[int] = Field(None, ge=1900, le=2100)
    vin: Optional[str] = Field(None, max_length=50)
    description: Optional[str] = None
    image_url: Optional[str] = None


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    make: Optional[str] = Field(None, min_length=1, max_length=50)
    model: Optional[str] = Field(None, min_length=1, max_length=50)
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    price: Optional[float] = Field(None, gt=0)
    quantity: Optional[int] = Field(None, ge=0)
    year: Optional[int] = Field(None, ge=1900, le=2100)
    vin: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None


class RestockRequest(BaseModel):
    quantity: int = Field(..., gt=0, description="Restock quantity must be greater than zero")


class VehicleResponse(VehicleBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
