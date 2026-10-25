import pytest


def test_register_user_success(client):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "buyer@example.com",
            "password": "Password123!",
            "full_name": "Test Buyer",
            "is_admin": False,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "buyer@example.com"
    assert data["full_name"] == "Test Buyer"
    assert "id" in data
    assert "password" not in data
    assert "hashed_password" not in data


def test_register_duplicate_email(client):
    user_payload = {
        "email": "duplicate@example.com",
        "password": "Password123!",
        "full_name": "First User",
    }
    res1 = client.post("/api/auth/register", json=user_payload)
    assert res1.status_code == 201

    res2 = client.post("/api/auth/register", json=user_payload)
    assert res2.status_code == 400
    assert "already registered" in res2.json()["detail"].lower()


def test_register_invalid_email(client):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "invalid-email-format",
            "password": "Password123!",
            "full_name": "Invalid Email",
        },
    )
    assert response.status_code == 422


def test_login_success(client):
    # Register first
    client.post(
        "/api/auth/register",
        json={
            "email": "loginuser@example.com",
            "password": "SecretPassword123",
            "full_name": "Login User",
        },
    )

    # Login
    response = client.post(
        "/api/auth/login",
        json={"email": "loginuser@example.com", "password": "SecretPassword123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "loginuser@example.com"


def test_login_invalid_password(client):
    client.post(
        "/api/auth/register",
        json={
            "email": "wrongpwd@example.com",
            "password": "CorrectPassword123",
            "full_name": "Wrong Pwd User",
        },
    )

    response = client.post(
        "/api/auth/login",
        json={"email": "wrongpwd@example.com", "password": "WrongPassword999"},
    )
    assert response.status_code == 401
    assert "invalid credentials" in response.json()["detail"].lower()


def test_login_nonexistent_user(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "nonexistent@example.com", "password": "AnyPassword123"},
    )
    assert response.status_code == 401
