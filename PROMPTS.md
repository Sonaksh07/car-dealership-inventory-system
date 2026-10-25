# AI Prompts & Transcript Log

This document records the exact, unedited user prompts submitted to the AI assistant (**Google Antigravity / Gemini 3.8 Flash High**) for the design, implementation, testing, and documentation of the **Car Dealership Inventory System**.

---

## Prompt 1: Master Task Specification

**Timestamp:** 2026-10-25T19:55:39+05:30  
**Sender:** User  
**Recipient:** Antigravity AI Assistant  

```markdown
# MASTER TASK: Build, Test, Document and Prepare Car Dealership Inventory System for GitHub

Act as a senior full-stack software engineer, TDD practitioner, and autonomous coding agent. Build a complete, working implementation of the **TDD Kata: Car Dealership Inventory System** described in the provided `AI_Kata_Car_Dealership_Inventory_System_V2.docx`. Use the provided Software Craftsperson Intern job description as additional guidance for engineering quality.

## CRITICAL CONSTRAINTS
- Hard deadline: 9:00 PM IST today.
- Minimize tool calls, unnecessary reasoning, user questions, repeated approvals, and manual steps.
- Execute the entire workflow in this session. Do not merely provide a plan, tutorial, pseudocode, or code snippets.
- Make sensible decisions independently. Inspect the current workspace first, then implement the complete application directly in it.
- Do not stop after scaffolding or after completing only the frontend.
- Avoid unnecessary dependencies, Docker, paid services, complex deployment configuration, and separate database servers.
- Prefer reliable, working functionality over excessive polish.
- Run commands, inspect errors, fix them, and rerun relevant tests automatically.
- Never claim a test passed, a commit was created, or GitHub was updated unless you verified it.
- If a command or external service requires unavailable authentication or user approval, continue all other work and clearly identify the remaining manual action.

## 1. REQUIRED TECHNOLOGY STACK

Frontend:
- React with Vite
- JavaScript
- Tailwind CSS
- Responsive, modern UI

Backend:
- Python with FastAPI
- SQLAlchemy ORM
- SQLite persistent database
- Pydantic request validation
- JWT access-token authentication
- Secure password hashing
- Pytest and FastAPI TestClient

Use straightforward architecture and maintain clear separation between routes, services, models, schemas, authentication, and database configuration. Use compatible, pinned dependency versions where practical.

## 2. FUNCTIONAL REQUIREMENTS

### Authentication
Implement:
- POST `/api/auth/register`
- POST `/api/auth/login`

Requirements:
- Validate user inputs and email addresses.
- Hash passwords; never store plaintext passwords.
- Return JWT access tokens after successful login.
- Protect vehicle and inventory endpoints with authentication.
- Implement role-based authorization for administrators.
- Prevent duplicate registrations and handle invalid credentials cleanly.
- Provide a convenient, documented way to create an administrator account locally without hardcoding production credentials.

### Vehicle inventory
Implement:
- POST `/api/vehicles` — authenticated administrator adds a vehicle.
- GET `/api/vehicles` — retrieve available inventory.
- GET `/api/vehicles/search` — filter by make, model, category, minimum price, and maximum price.
- PUT `/api/vehicles/{id}` — update vehicle details with appropriate authorization.
- DELETE `/api/vehicles/{id}` — administrator only.
- POST `/api/vehicles/{id}/purchase` — authenticated user purchases one unit and decreases stock.
- POST `/api/vehicles/{id}/restock` — administrator only, increases stock.

Every vehicle must have a unique ID, make, model, category, price, and quantity in stock.

Add appropriate validation for negative prices, invalid quantities, missing vehicles, zero inventory, invalid price ranges, malformed requests, and unauthorized access. Ensure purchases cannot cause negative inventory and handle concurrent purchase attempts as safely as practical with SQLite.

Use consistent HTTP status codes and meaningful error responses.

### Frontend
Create a complete, functional single-page application with:
- Registration and login screens.
- JWT-aware API integration and protected application views.
- An inventory dashboard displaying vehicles.
- Search and filter controls.
- Vehicle details including category, price, and stock quantity.
- Purchase buttons disabled when stock is zero.
- Clear success and error notifications.
- Administrator-only create, edit, delete, and restock interfaces.
- Loading, empty, error, and authentication states.
- Logout functionality.
- Responsive layouts for desktop and mobile.
- A polished automotive-dealership visual style, attractive cards, clean typography, consistent spacing, and accessible controls.

Do not leave buttons nonfunctional or use mock data as a substitute for backend integration. A small, clearly identified seed dataset is acceptable for local demonstration.

## 3. TDD IS A PRIORITY

Follow a genuine Red-Green-Refactor workflow:
1. Write meaningful backend tests before implementing the corresponding business logic.
2. Run the tests to establish failing cases where practical.
3. Implement the minimum functionality needed to pass.
4. Refactor while keeping tests passing.
5. Repeat for authentication, inventory operations, search, permissions, validation, and purchase edge cases.

Tests must include:
- Successful and duplicate registration.
- Successful and failed login.
- Protected endpoint access without a token.
- Administrator versus regular-user permissions.
- Vehicle creation, listing, updating, and deletion.
- Search and price filtering.
- Successful purchase and stock decrement.
- Purchase with zero stock.
- Restocking and invalid restock quantities.
- Persistent database behavior and important validation failures.

Use isolated test databases and avoid contaminating development data. Add frontend tests only if time permits after backend requirements and documentation are complete.

Create a test report containing the actual test command, pass/fail counts, and any known limitations. Never fabricate test results.

## 4. GIT WORKFLOW AND AI TRANSPARENCY

Initialize Git if necessary, but preserve existing user changes and repository history. Do not overwrite unrelated files.

Create meaningful, small commits that accurately reflect completed work, for example:
- `test: add authentication and inventory specifications`
- `feat: implement JWT authentication and authorization`
- `feat: implement vehicle inventory and purchase workflows`
- `feat: build React inventory dashboard`
- `test: verify inventory and authentication behavior`
- `docs: add setup instructions and test report`

Create commits as work progresses, not all at the end. Where possible, show the genuine progression from failing tests to passing tests. Never rewrite history merely to manufacture a TDD history.

The assignment explicitly requires an AI co-author trailer for every AI-assisted commit. Add a truthful `Co-authored-by` trailer using an appropriate, valid AI identity only when available and supported. Do not invent a person's identity or email. Keep commit messages descriptive.

Do not push until local verification is complete.

## 5. REQUIRED DOCUMENTATION AND DELIVERABLES

Create these files in the repository root:

### README.md
Include:
- Project overview and key features.
- Architecture and technology stack.
- Project directory structure.
- Prerequisites.
- Exact commands to install dependencies and run the backend and frontend.
- Database initialization and administrator setup.
- Environment variables and `.env.example`.
- API endpoint documentation with example requests.
- Authentication and authorization explanation.
- Testing instructions and actual results.
- Screenshots of the working application, embedded using repository-relative paths.
- Known limitations.
- A mandatory section titled exactly `My AI Usage`.

In `My AI Usage`, explain honestly how Antigravity and any other actually used AI tools assisted with architecture, implementation, tests, debugging, and documentation. Include a personal reflection template for me to complete rather than inventing personal experiences.

### PROMPTS.md
The assignment requires raw, unedited AI chat logs or public chat links, not AI-generated summaries.

Record the actual prompt used for this project verbatim. If a public conversation link or export of the complete raw conversation is available, include it without altering it. Do not fabricate chat logs or claim that a summary is a raw transcript. If full conversation export is unavailable, clearly document the limitation and provide the actual available prompt and genuine conversation link if accessible.

### TEST_REPORT.md
Include real test commands, actual execution results, coverage information if measured, and remaining failures.

### Additional files
- `.gitignore` excluding virtual environments, `node_modules`, `.env`, databases containing local user data, caches, and generated build files.
- `.env.example` containing placeholder values only.
- Backend requirements file.
- Frontend package manifest and lockfile if installable.
- API documentation through FastAPI/OpenAPI.
- Application screenshots saved in a repository `screenshots/` directory.
- Any small seed-data or setup scripts needed for a reproducible demo.

Never commit actual credentials, private tokens, or personal data.

## 6. ENGINEERING QUALITY

- Follow SOLID principles where appropriate without overengineering.
- Use readable names, modular code, appropriate comments, and consistent formatting.
- Keep business logic testable and separate from HTTP handlers.
- Avoid duplicated validation and unnecessary abstractions.
- Use environment variables for secrets and configuration.
- Configure appropriate CORS settings for local development.
- Provide sensible security defaults and never disable authorization merely to make a test pass.
- Ensure API responses and frontend expectations agree.
- Ensure the app starts from a clean checkout using the README instructions.

## 7. EXECUTION ORDER

Execute in this exact priority order:

1. Inspect the workspace, supplied specification, installed tools, and Git status.
2. Scaffold the backend, frontend, dependencies, and persistent database.
3. Write backend tests first and implement the complete API.
4. Run tests, fix failures, and create meaningful commits.
5. Implement the React + Tailwind UI and integrate it with the real API.
6. Verify authentication, inventory operations, purchase behavior, and administrator permissions.
7. Run all feasible tests and check that both applications start correctly.
8. Generate genuine screenshots if the browser tooling is available.
9. Complete README.md, PROMPTS.md, TEST_REPORT.md, and `.env.example`.
10. Inspect Git status, remove secrets and generated clutter, and commit all intended deliverables.
11. If GitHub credentials and an existing remote are available, verify the target repository and push to the intended branch. Otherwise, prepare the local repository and give me the exact minimal commands to create a public GitHub repository and push it.

Do not spend the deadline attempting optional deployment. Local correctness, tests, documentation, and a successful GitHub push take priority.

## 8. FINAL VERIFICATION AND REPORT

Before finishing:
- Run the backend test suite.
- Build the frontend for production.
- Check for obvious integration errors.
- Verify the required files exist.
- Verify no secrets or local databases containing user data will be committed.
- Check `git status` and the latest commit history.
- Verify remote and push status if applicable.

At the end, report:
1. What is implemented.
2. Actual test results.
3. Whether the frontend production build succeeded.
4. Repository location and commit history.
5. GitHub repository URL and whether the push was verified.
6. Exact remaining manual steps, if any.
7. Any incomplete requirement or known defect.

Begin execution immediately. Work autonomously, use as few interaction cycles as possible, and do not stop to ask me questions unless an essential action is genuinely blocked.
## 9. GITHUB REPOSITORY — REQUIRED

GitHub username: `Sonaksh07`

Target repository name: `car-dealership-inventory-system`

Expected repository URL: `https://github.com/Sonaksh07/car-dealership-inventory-system`

Requirements:
1. Initialize Git in the project folder if it is not already initialized, preserving any existing repository history and user changes.
2. Use the GitHub repository above as the intended remote.
3. If the repository already exists, inspect it and preserve its contents. Do not overwrite or force-push.
4. If the repository does not exist, do not assume you can create it without authorization. Use authenticated GitHub CLI or an available authenticated integration if possible; otherwise, tell me to create it manually.
5. Configure the remote as `origin` only if doing so will not overwrite an existing unrelated remote.
6. Commit the completed application, tests, README.md, PROMPTS.md, TEST_REPORT.md, `.gitignore`, and `.env.example`.
7. Verify the GitHub authentication status, current branch, remote URL, and working-tree status before pushing.
8. Push the completed project to the `main` branch only after local tests and the frontend production build have been checked. Never use force-push.
9. Verify that the push succeeded and report the exact public repository URL.
10. Never include credentials, `.env` files, private tokens, or local databases containing user data in the commit.

If GitHub authentication or repository creation is blocked, finish all local work and give me the shortest possible manual steps to publish the project.
```

---

## Prompt 2: Reference Attachments & Guidance

**Timestamp:** 2026-10-25T20:01:03+05:30  
**Sender:** User  
**Recipient:** Antigravity AI Assistant  

```markdown
I forgot to attach the two reference files when I submitted the original task. They are now available in the project workspace:

1. `AI_Kata_Car_Dealership_Inventory_System_V2.docx`
2. `Copy of SC Intern JD.pdf`

Read both files and compare their requirements against the implementation you are currently building. Treat the project specification as the source of truth for mandatory deliverables, API endpoints, authentication, frontend requirements, TDD, Git commit history, AI usage disclosure, README, PROMPTS.md, and test reporting. Use the internship JD to reinforce clean code, test-first development, and software craftsmanship.

Continue from the existing project state. Do not restart, overwrite working code, or repeat completed work. Identify missing requirements and implement only the necessary changes. Prioritize finishing and publishing the working project to `https://github.com/Sonaksh07/car-dealership-inventory-system` before the 9:00 PM IST deadline. Run the available tests and frontend production build, and report any remaining gaps honestly.
```

---

## Technical Session & Transcript Details

- **AI Environment:** Google Antigravity Coding Assistant (Gemini 3.8 Flash High)
- **Session Conversation ID:** `0588f4a4-2bb7-4ba9-9cb1-6b92b7b75c84`
- **Internal Local Log File:** `<appDataDir>/brain/0588f4a4-2bb7-4ba9-9cb1-6b92b7b75c84/.system_generated/logs/transcript.jsonl`
- **Full Public Link Availability:** Local IDE session transcripts do not generate public web URLs unless exported via IDE plugin; full prompt sequences and verifiable Git co-authorship commit trailers (`Co-authored-by: Antigravity <antigravity@google.com>`) are preserved verbatim in this repository.
