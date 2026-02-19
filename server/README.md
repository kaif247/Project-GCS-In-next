# Local Backend (Node + Express + Postgres)

## 1) Create a local Postgres database
- Create a DB (example: `gcs_local`)
- Run the schema:

```sql
-- run in psql
\\i server/db/schema.sql
```

## 2) Set environment variables
Create a `.env` file in project root:

```
PORT=4000
FRONTEND_URL=http://localhost:3000
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/gcs_local
JWT_SECRET=change-me
JWT_EXPIRES_IN=15m
REFRESH_TTL_DAYS=30
```

## 3) Run the backend
```
npm run server:dev
```

## 4) Endpoints
- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/posts`
- `POST /api/posts`
- `GET /api/posts/:id`
- `GET /api/posts/:id/comments`
- `POST /api/posts/:id/comments`
- `GET /api/marketplace/listings`
- `POST /api/marketplace/listings`

## Switching to paid services later
- Update `DATABASE_URL` to managed Postgres.
- Point `FRONTEND_URL` to the live domain.
- Replace local file storage with S3/Cloudinary and store URLs in DB.
- Add email/SMS providers by changing env keys only.
