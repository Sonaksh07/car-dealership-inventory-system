from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleUpdate


class VehicleService:
    @staticmethod
    def create_vehicle(db: Session, data: VehicleCreate) -> Vehicle:
        vehicle = Vehicle(**data.model_dump())
        db.add(vehicle)
        db.commit()
        db.refresh(vehicle)
        return vehicle

    @staticmethod
    def get_all_vehicles(db: Session) -> List[Vehicle]:
        return db.query(Vehicle).order_by(Vehicle.id.desc()).all()

    @staticmethod
    def get_vehicle_by_id(db: Session, vehicle_id: int) -> Vehicle:
        vehicle = db.query(Vehicle).filter(Vehicle.id == vehicle_id).first()
        if not vehicle:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Vehicle with ID {vehicle_id} not found",
            )
        return vehicle

    @staticmethod
    def search_vehicles(
        db: Session,
        make: Optional[str] = None,
        model: Optional[str] = None,
        category: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
    ) -> List[Vehicle]:
        if min_price is not None and max_price is not None and min_price > max_price:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Minimum price cannot be greater than maximum price",
            )

        query = db.query(Vehicle)

        if make:
            query = query.filter(Vehicle.make.ilike(f"%{make.strip()}%"))
        if model:
            query = query.filter(Vehicle.model.ilike(f"%{model.strip()}%"))
        if category:
            query = query.filter(Vehicle.category.ilike(f"%{category.strip()}%"))
        if min_price is not None:
            query = query.filter(Vehicle.price >= min_price)
        if max_price is not None:
            query = query.filter(Vehicle.price <= max_price)

        return query.order_by(Vehicle.id.desc()).all()

    @staticmethod
    def update_vehicle(db: Session, vehicle_id: int, data: VehicleUpdate) -> Vehicle:
        vehicle = VehicleService.get_vehicle_by_id(db, vehicle_id)
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(vehicle, key, value)
        db.commit()
        db.refresh(vehicle)
        return vehicle

    @staticmethod
    def delete_vehicle(db: Session, vehicle_id: int) -> None:
        vehicle = VehicleService.get_vehicle_by_id(db, vehicle_id)
        db.delete(vehicle)
        db.commit()

    @staticmethod
    def purchase_vehicle(db: Session, vehicle_id: int) -> Vehicle:
        vehicle = VehicleService.get_vehicle_by_id(db, vehicle_id)
        if vehicle.quantity <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Vehicle is out of stock",
            )
        vehicle.quantity -= 1
        db.commit()
        db.refresh(vehicle)
        return vehicle

    @staticmethod
    def restock_vehicle(db: Session, vehicle_id: int, quantity: int) -> Vehicle:
        if quantity <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Restock quantity must be greater than zero",
            )
        vehicle = VehicleService.get_vehicle_by_id(db, vehicle_id)
        vehicle.quantity += quantity
        db.commit()
        db.refresh(vehicle)
        return vehicle
