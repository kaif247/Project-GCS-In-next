# Admin Backend API

This backend is built with NestJS to support the admin page features:
- User management (CRUD, suspend/block)
- Reports (CRUD, assign owner)
- Flags (CRUD, toggle)
- Announcements (CRUD)
- Alerts (CRUD)
- Policies (CRUD)
- Incidents (CRUD)
- Audit log (record actions)
- Payments (read-only)
- Usage series (read-only)
- Authentication (admin login/logout)

## Getting Started

1. Install dependencies:
   npm install

2. Start the server:
   npm run start

3. API endpoints:
   - See each module for routes (e.g., /users, /reports, /flags, etc.)

## Project Structure

- src/
  - modules for each feature
- .github/
  - copilot-instructions.md

## Database

- Default: SQLite (can be changed to PostgreSQL)

## Customization

- Add or modify modules as needed for your admin features.

---

For full integration, connect your frontend admin page to these endpoints.
