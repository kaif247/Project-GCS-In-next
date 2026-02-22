This project is a Next.js frontend with a Django backend located in `server/`.

**Frontend (Next.js)**
1. Install deps: `npm install`
2. Run dev server: `npm run dev`
3. Open `http://localhost:3000`

Frontend pages live in `src/pages`.

**Backend (Django)**
1. Create/activate your Python env
2. Install backend deps: `pip install -r server/requirements.txt`
3. Run backend: `npm run backend:dev`

This starts Django at `http://localhost:8000`.

**Routing**
Next.js proxies these paths to Django so the frontend can call the backend on the same origin:
- `/backend/*` -> `http://localhost:8000/api/*`
- `/media/*` -> `http://localhost:8000/media/*`

Example:
- `http://localhost:3000/backend/social/posts/` maps to Django `http://localhost:8000/api/social/posts/`.

**WebSockets**
WebSockets are not proxied through Next.js. Use Django directly:
- `ws://localhost:8000/ws/chat/{conversation_id}/`
- `ws://localhost:8000/ws/global-chat/`
