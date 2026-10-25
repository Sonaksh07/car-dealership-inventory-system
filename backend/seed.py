from app.core.database import SessionLocal, Base, engine
from app.models.vehicle import Vehicle
from app.models.user import User
from app.core.security import hash_password

SAMPLE_VEHICLES = [
    {
        "make": "Porsche",
        "model": "911 GT3",
        "category": "Sports",
        "price": 182900.0,
        "quantity": 2,
        "year": 2024,
        "vin": "WP0AC2A94RS198201",
        "description": "Naturally aspirated 4.0-liter flat-six engine delivering 502 horsepower. Pure motorsport pedigree.",
        "image_url": "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80",
    },
    {
        "make": "Tesla",
        "model": "Model S Plaid",
        "category": "Electric",
        "price": 89990.0,
        "quantity": 4,
        "year": 2024,
        "vin": "5YJSA1E28PF992812",
        "description": "Tri-motor all-wheel drive platform with 1,020 hp. 0-60 mph in 1.99 seconds.",
        "image_url": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
    },
    {
        "make": "BMW",
        "model": "M4 Competition",
        "category": "Coupe",
        "price": 79100.0,
        "quantity": 3,
        "year": 2024,
        "vin": "WBA43AZ09RC512390",
        "description": "TwinPower Turbo inline 6-cylinder engine producing 503 horsepower with M xDrive.",
        "image_url": "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80",
    },
    {
        "make": "Mercedes-Benz",
        "model": "G 63 AMG",
        "category": "SUV",
        "price": 179000.0,
        "quantity": 1,
        "year": 2023,
        "vin": "W1N9M7HJ2PF884102",
        "description": "Handcrafted AMG 4.0L V8 biturbo engine with 577 hp. Iconic luxury and rugged off-road capability.",
        "image_url": "https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=800&q=80",
    },
    {
        "make": "Audi",
        "model": "RS6 Avant",
        "category": "Wagon",
        "price": 125800.0,
        "quantity": 0,  # Zero stock to test out-of-stock UI state
        "year": 2024,
        "vin": "WAUZZZF27RN003921",
        "description": "Twin-turbo V8 super-wagon delivering 621 hp. Exceptional utility combined with track-ready performance. Currently awaiting delivery.",
        "image_url": "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80",
    },
    {
        "make": "Ford",
        "model": "F-150 Lightning",
        "category": "Truck",
        "price": 62995.0,
        "quantity": 5,
        "year": 2024,
        "vin": "1FTVW1EV6PW392104",
        "description": "All-electric full-size pickup with 580 horsepower, Mega Power Frunk, and Pro Power Onboard.",
        "image_url": "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80",
    },
]


def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Create default demo admin
        admin = db.query(User).filter(User.email == "admin@dealership.com").first()
        if not admin:
            admin = User(
                email="admin@dealership.com",
                hashed_password=hash_password("Admin@Apex2026!"),
                full_name="Dealership Admin",
                is_admin=True,
            )
            db.add(admin)

        # Create demo buyer
        buyer = db.query(User).filter(User.email == "buyer@dealership.com").first()
        if not buyer:
            buyer = User(
                email="buyer@dealership.com",
                hashed_password=hash_password("Buyer@Apex2026!"),
                full_name="Alex Johnson",
                is_admin=False,
            )
            db.add(buyer)

        db.commit()

        # Seed vehicles
        count = db.query(Vehicle).count()
        if count == 0:
            for item in SAMPLE_VEHICLES:
                v = Vehicle(**item)
                db.add(v)
            db.commit()
            print(f"[SUCCESS] Seeded {len(SAMPLE_VEHICLES)} demo vehicles.")
        else:
            print(f"[INFO] Database already contains {count} vehicles. Skipping duplicate vehicle seeding.")

        print("[SUCCESS] Database seeding completed successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
