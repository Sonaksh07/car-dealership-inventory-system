# Test Execution Report: Car Dealership Inventory System

**Date:** 2026-10-25  
**Platform:** Windows 11 (win32)  
**Python Runtime:** Python 3.14.2  
**Test Framework:** Pytest 9.1.1 + Pytest-Cov 7.1.0 + Starlette/FastAPI TestClient  
**Target Environment:** Isolated in-memory SQLite (`sqlite:///:memory:`) with `StaticPool`  

---

## 1. Executive Summary

- **Total Test Cases Executed:** 15
- **Passed:** 15 (100%)
- **Failed:** 0
- **Errors:** 0
- **Total Execution Time:** 5.77 seconds
- **Overall Code Coverage:** 95% (331 statements, 17 missed)

---

## 2. Test Execution Command

```bash
# Navigate to backend directory and run test suite with coverage
cd backend
python -m pytest --cov=app tests -v
```

---

## 3. Actual Test Suite Output

```text
============================= test session starts =============================
platform win32 -- Python 3.14.2, pytest-9.1.1, pluggy-1.7.0
rootdir: C:\Users\Sonaksh Jain\Documents\car-dealership-inventory-system\backend
plugins: anyio-4.15.1, asyncio-1.4.0, cov-7.1.0
asyncio: mode=Mode.STRICT, debug=False, asyncio_default_fixture_loop_scope=None, asyncio_default_test_loop_scope=function
collected 15 items

tests\test_auth.py::test_register_user_success PASSED                    [  6%]
tests\test_auth.py::test_register_duplicate_email PASSED                 [ 13%]
tests\test_auth.py::test_register_invalid_email PASSED                   [ 20%]
tests\test_auth.py::test_login_success PASSED                            [ 26%]
tests\test_auth.py::test_login_invalid_password PASSED                   [ 33%]
tests\test_auth.py::test_login_nonexistent_user PASSED                   [ 40%]
tests\test_vehicles.py::test_unauthenticated_vehicle_access PASSED       [ 46%]
tests\test_vehicles.py::test_admin_add_vehicle_success PASSED            [ 53%]
tests\test_vehicles.py::test_customer_cannot_add_vehicle PASSED          [ 60%]
tests\test_vehicles.py::test_add_vehicle_negative_values_validation PASSED [ 66%]
tests\test_vehicles.py::test_list_and_search_vehicles PASSED             [ 73%]
tests\test_vehicles.py::test_update_vehicle PASSED                       [ 80%]
tests\test_vehicles.py::test_delete_vehicle PASSED                       [ 86%]
tests\test_vehicles.py::test_purchase_vehicle_decrement_stock PASSED     [ 93%]
tests\test_vehicles.py::test_restock_vehicle PASSED                      [100%]

=============================== tests coverage ================================
_______________ coverage: platform win32, python 3.14.2-final-0 _______________

Name                              Stmts   Miss  Cover
-----------------------------------------------------
app\__init__.py                       0      0   100%
app\core\__init__.py                  0      0   100%
app\core\config.py                   13      0   100%
app\core\database.py                 12      4    67%
app\core\security.py                 34      5    85%
app\main.py                          16      2    88%
app\models\__init__.py                3      0   100%
app\models\user.py                   11      0   100%
app\models\vehicle.py                17      0   100%
app\routers\__init__.py               2      0   100%
app\routers\auth.py                  38      3    92%
app\routers\vehicles.py              34      1    97%
app\schemas\__init__.py               0      0   100%
app\schemas\auth.py                  17      0   100%
app\schemas\vehicle.py               31      0   100%
app\services\__init__.py              3      0   100%
app\services\auth_service.py         29      0   100%
app\services\vehicle_service.py      71      2    97%
-----------------------------------------------------
TOTAL                               331     17    95%
======================== 15 passed, 1 warning in 5.77s ========================
```

---

## 4. Test Categories & Scenarios Verified

### A. Authentication & Authorization
- **`test_register_user_success`**: Validates user creation, PBKDF2-HMAC password hashing, and exclusion of sensitive hash fields in response payloads.
- **`test_register_duplicate_email`**: Enforces unique email constraint (HTTP 400).
- **`test_register_invalid_email`**: Validates email formatting rules via Pydantic/email-validator (HTTP 422).
- **`test_login_success`**: Verifies password verification and issuance of signed JWT tokens (`bearer` type).
- **`test_login_invalid_password`**: Rejects invalid passwords with HTTP 401 Unauthorized.
- **`test_login_nonexistent_user`**: Rejects non-existent users with HTTP 401 Unauthorized.

### B. Endpoint Security & Role-Based Access Control (RBAC)
- **`test_unauthenticated_vehicle_access`**: Ensures unauthenticated requests to protected vehicle endpoints are rejected (HTTP 401).
- **`test_admin_add_vehicle_success`**: Allows authenticated administrators (`is_admin=True`) to add vehicles (HTTP 201).
- **`test_customer_cannot_add_vehicle`**: Restricts vehicle creation from non-admin accounts (HTTP 403 Forbidden).
- **`test_update_vehicle`**: Confirms only administrators can update vehicle specs and prices; customers receive HTTP 403.
- **`test_delete_vehicle`**: Confirms deletion is strictly admin-only (HTTP 204 on success; HTTP 403 for non-admins).

### C. Validation & Edge Cases
- **`test_add_vehicle_negative_values_validation`**: Rejects negative prices and negative initial quantities (HTTP 422).
- **`test_list_and_search_vehicles`**: Tests retrieval of all vehicles and multi-parameter filtering (by make, category, and price range). Rejects invalid price range (`min_price > max_price`) with HTTP 400.

### D. Inventory Transactions & Stock Integrity
- **`test_purchase_vehicle_decrement_stock`**: Atomically decrements quantity on purchase. Once stock hits zero, further purchase attempts are rejected with HTTP 400 Bad Request ("Vehicle is out of stock").
- **`test_restock_vehicle`**: Confirms admin restock functionality, checks quantity increases correctly, rejects non-admin restock (HTTP 403), and rejects zero/negative restock amounts (HTTP 400/422).

---

## 5. Frontend Production Build Verification

The frontend production build was verified using Vite:
```text
> car-dealership-frontend@1.0.0 build
> vite build

vite v5.4.21 building for production...
transforming...
✓ 1493 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   1.33 kB │ gzip:  0.77 kB
dist/assets/index-NmNsiw2f.css   27.15 kB │ gzip:  5.49 kB
dist/assets/index-DL7n8ehj.js   194.15 kB │ gzip: 57.20 kB
✓ built in 5.44s
```

---

## 6. Known Limitations
1. **SQLite Concurrency**: SQLite employs file-level or table-level locking. For ultra-high concurrency distributed deployments, PostgreSQL or MySQL with row-level locks (`SELECT ... FOR UPDATE`) is recommended.
2. **Password Reset Flow**: Password reset via email verification link is not included in the Kata specification scope; password changes are managed directly or through database administrator access.
