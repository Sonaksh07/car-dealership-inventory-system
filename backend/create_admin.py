import argparse
import sys
from app.core.database import SessionLocal, Base, engine
from app.models.user import User
from app.core.security import hash_password


def create_admin(email: str, password: str, full_name: str = "Dealership Administrator"):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            if existing.is_admin:
                print(f"[INFO] User {email} already exists and is an administrator.")
                return
            existing.is_admin = True
            db.commit()
            print(f"[SUCCESS] Upgraded existing user {email} to administrator.")
            return

        admin_user = User(
            email=email,
            hashed_password=hash_password(password),
            full_name=full_name,
            is_admin=True,
        )
        db.add(admin_user)
        db.commit()
        print(f"[SUCCESS] Successfully created administrator account: {email}")
    finally:
        db.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Create or promote an administrator account for Apex Motors.")
    parser.add_argument("--email", default="admin@dealership.com", help="Admin email address")
    parser.add_argument("--password", default="Admin@Apex2026!", help="Admin password")
    parser.add_argument("--name", default="Apex Dealership Administrator", help="Admin display name")

    args = parser.parse_args()
    create_admin(args.email, args.password, args.name)
