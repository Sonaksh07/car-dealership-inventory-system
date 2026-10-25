import pytest


@pytest.fixture
def auth_tokens(client):
    """Helper fixture to create an admin and a normal user, returning their auth headers."""
    # Register admin
    client.post(
        "/api/auth/register",
        json={
            "email": "admin@dealership.com",
            "password": "AdminPassword123!",
            "full_name": "Admin User",
            "is_admin": True,
        },
    )
    admin_login = client.post(
        "/api/auth/login",
        json={"email": "admin@dealership.com", "password": "AdminPassword123!"},
    )
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Register regular customer
    client.post(
        "/api/auth/register",
        json={
            "email": "customer@dealership.com",
            "password": "CustomerPassword123!",
            "full_name": "Customer User",
            "is_admin": False,
        },
    )
    cust_login = client.post(
        "/api/auth/login",
        json={"email": "customer@dealership.com", "password": "CustomerPassword123!"},
    )
    cust_token = cust_login.json()["access_token"]
    cust_headers = {"Authorization": f"Bearer {cust_token}"}

    return {"admin": admin_headers, "customer": cust_headers}


def test_unauthenticated_vehicle_access(client):
    response = client.get("/api/vehicles")
    assert response.status_code == 401

    response = client.post(
        "/api/vehicles",
        json={"make": "Toyota", "model": "Camry", "category": "Sedan", "price": 25000, "quantity": 5},
    )
    assert response.status_code == 401


def test_admin_add_vehicle_success(client, auth_tokens):
    response = client.post(
        "/api/vehicles",
        headers=auth_tokens["admin"],
        json={
            "make": "Porsche",
            "model": "911 Carrera",
            "category": "Sports",
            "price": 114000.0,
            "quantity": 3,
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["make"] == "Porsche"
    assert data["model"] == "911 Carrera"
    assert data["category"] == "Sports"
    assert data["price"] == 114000.0
    assert data["quantity"] == 3
    assert "id" in data


def test_customer_cannot_add_vehicle(client, auth_tokens):
    response = client.post(
        "/api/vehicles",
        headers=auth_tokens["customer"],
        json={
            "make": "Ford",
            "model": "Mustang",
            "category": "Coupe",
            "price": 35000.0,
            "quantity": 2,
        },
    )
    assert response.status_code == 403


def test_add_vehicle_negative_values_validation(client, auth_tokens):
    # Negative price
    res1 = client.post(
        "/api/vehicles",
        headers=auth_tokens["admin"],
        json={
            "make": "Tesla",
            "model": "Model 3",
            "category": "Electric",
            "price": -1000.0,
            "quantity": 5,
        },
    )
    assert res1.status_code == 422

    # Negative quantity
    res2 = client.post(
        "/api/vehicles",
        headers=auth_tokens["admin"],
        json={
            "make": "Tesla",
            "model": "Model 3",
            "category": "Electric",
            "price": 40000.0,
            "quantity": -2,
        },
    )
    assert res2.status_code == 422


def test_list_and_search_vehicles(client, auth_tokens):
    # Seed 3 vehicles
    client.post(
        "/api/vehicles",
        headers=auth_tokens["admin"],
        json={"make": "BMW", "model": "M3", "category": "Sedan", "price": 75000, "quantity": 4},
    )
    client.post(
        "/api/vehicles",
        headers=auth_tokens["admin"],
        json={"make": "Audi", "model": "Q7", "category": "SUV", "price": 60000, "quantity": 2},
    )
    client.post(
        "/api/vehicles",
        headers=auth_tokens["admin"],
        json={"make": "BMW", "model": "X5", "category": "SUV", "price": 65000, "quantity": 1},
    )

    # List all
    list_res = client.get("/api/vehicles", headers=auth_tokens["customer"])
    assert list_res.status_code == 200
    assert len(list_res.json()) == 3

    # Filter by make
    res_make = client.get("/api/vehicles/search?make=BMW", headers=auth_tokens["customer"])
    assert res_make.status_code == 200
    assert len(res_make.json()) == 2

    # Filter by category
    res_cat = client.get("/api/vehicles/search?category=SUV", headers=auth_tokens["customer"])
    assert res_cat.status_code == 200
    assert len(res_cat.json()) == 2

    # Filter by price range
    res_price = client.get(
        "/api/vehicles/search?min_price=62000&max_price=80000",
        headers=auth_tokens["customer"],
    )
    assert res_price.status_code == 200
    assert len(res_price.json()) == 2  # BMW M3 (75k) & BMW X5 (65k)

    # Invalid price range (min > max)
    res_inv = client.get(
        "/api/vehicles/search?min_price=80000&max_price=50000",
        headers=auth_tokens["customer"],
    )
    assert res_inv.status_code == 400


def test_update_vehicle(client, auth_tokens):
    create_res = client.post(
        "/api/vehicles",
        headers=auth_tokens["admin"],
        json={"make": "Honda", "model": "Civic", "category": "Sedan", "price": 24000, "quantity": 5},
    )
    vehicle_id = create_res.json()["id"]

    # Customer cannot update
    cust_res = client.put(
        f"/api/vehicles/{vehicle_id}",
        headers=auth_tokens["customer"],
        json={"price": 23000},
    )
    assert cust_res.status_code == 403

    # Admin updates price and quantity
    admin_res = client.put(
        f"/api/vehicles/{vehicle_id}",
        headers=auth_tokens["admin"],
        json={"price": 23500, "quantity": 6},
    )
    assert admin_res.status_code == 200
    assert admin_res.json()["price"] == 23500
    assert admin_res.json()["quantity"] == 6


def test_delete_vehicle(client, auth_tokens):
    create_res = client.post(
        "/api/vehicles",
        headers=auth_tokens["admin"],
        json={"make": "Mazda", "model": "CX-5", "category": "SUV", "price": 30000, "quantity": 2},
    )
    vehicle_id = create_res.json()["id"]

    # Customer cannot delete
    cust_res = client.delete(f"/api/vehicles/{vehicle_id}", headers=auth_tokens["customer"])
    assert cust_res.status_code == 403

    # Admin deletes
    del_res = client.delete(f"/api/vehicles/{vehicle_id}", headers=auth_tokens["admin"])
    assert del_res.status_code == 204

    # Verify not found
    get_res = client.get(f"/api/vehicles/search?model=CX-5", headers=auth_tokens["admin"])
    assert len(get_res.json()) == 0


def test_purchase_vehicle_decrement_stock(client, auth_tokens):
    create_res = client.post(
        "/api/vehicles",
        headers=auth_tokens["admin"],
        json={"make": "Ford", "model": "F-150", "category": "Truck", "price": 45000, "quantity": 1},
    )
    vehicle_id = create_res.json()["id"]

    # First purchase succeeds (stock 1 -> 0)
    pur1 = client.post(f"/api/vehicles/{vehicle_id}/purchase", headers=auth_tokens["customer"])
    assert pur1.status_code == 200
    assert pur1.json()["quantity"] == 0

    # Second purchase fails because stock is 0
    pur2 = client.post(f"/api/vehicles/{vehicle_id}/purchase", headers=auth_tokens["customer"])
    assert pur2.status_code == 400
    assert "out of stock" in pur2.json()["detail"].lower()


def test_restock_vehicle(client, auth_tokens):
    create_res = client.post(
        "/api/vehicles",
        headers=auth_tokens["admin"],
        json={"make": "Chevrolet", "model": "Corvette", "category": "Sports", "price": 70000, "quantity": 0},
    )
    vehicle_id = create_res.json()["id"]

    # Non-admin restock forbidden
    cust_res = client.post(
        f"/api/vehicles/{vehicle_id}/restock",
        headers=auth_tokens["customer"],
        json={"quantity": 5},
    )
    assert cust_res.status_code == 403

    # Admin invalid restock quantity <= 0
    inv_res = client.post(
        f"/api/vehicles/{vehicle_id}/restock",
        headers=auth_tokens["admin"],
        json={"quantity": -3},
    )
    assert inv_res.status_code in [400, 422]

    # Admin restock successful
    restock_res = client.post(
        f"/api/vehicles/{vehicle_id}/restock",
        headers=auth_tokens["admin"],
        json={"quantity": 5},
    )
    assert restock_res.status_code == 200
    assert restock_res.json()["quantity"] == 5
