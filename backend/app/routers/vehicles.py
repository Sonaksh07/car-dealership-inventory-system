from typing import List, Optional
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.schemas.vehicle import (
    VehicleCreate,
    VehicleUpdate,
    VehicleResponse,
    RestockRequest,
)
from app.services.vehicle_service import VehicleService
from app.routers.auth import get_current_user, get_current_admin_user

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])


@router.post("", response_model=VehicleResponse, status_code=status.HTTP_201_CREATED)
def add_vehicle(
    vehicle: VehicleCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    """Add a new vehicle to inventory (Admin only)."""
    return VehicleService.create_vehicle(db, vehicle)


@router.get("", response_model=List[VehicleResponse])
def get_all_vehicles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """View all available vehicles (Authenticated users)."""
    return VehicleService.get_all_vehicles(db)


@router.get("/search", response_model=List[VehicleResponse])
def search_vehicles(
    make: Optional[str] = Query(None, description="Vehicle make (e.g. Toyota)"),
    model: Optional[str] = Query(None, description="Vehicle model (e.g. Camry)"),
    category: Optional[str] = Query(None, description="Vehicle category (e.g. Sedan, SUV)"),
    min_price: Optional[float] = Query(None, ge=0, description="Minimum price filter"),
    max_price: Optional[float] = Query(None, ge=0, description="Maximum price filter"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Search for vehicles by make, model, category, or price range (Authenticated users)."""
    return VehicleService.search_vehicles(
        db,
        make=make,
        model=model,
        category=category,
        min_price=min_price,
        max_price=max_price,
    )


@router.get("/{id}", response_model=VehicleResponse)
def get_vehicle_details(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get single vehicle details by ID."""
    return VehicleService.get_vehicle_by_id(db, id)


@router.put("/{id}", response_model=VehicleResponse)
def update_vehicle(
    id: int,
    data: VehicleUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    """Update vehicle details (Admin only)."""
    return VehicleService.update_vehicle(db, id, data)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vehicle(
    id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    """Delete a vehicle from inventory (Admin only)."""
    VehicleService.delete_vehicle(db, id)
    return None


@router.post("/{id}/purchase", response_model=VehicleResponse)
def purchase_vehicle(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Purchase a vehicle unit, decreasing quantity by 1 (Authenticated users)."""
    return VehicleService.purchase_vehicle(db, id)


@router.post("/{id}/restock", response_model=VehicleResponse)
def restock_vehicle(
    id: int,
    restock: RestockRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin_user),
):
    """Restock a vehicle, increasing quantity (Admin only)."""
    return VehicleService.restock_vehicle(db, id, restock.quantity)
