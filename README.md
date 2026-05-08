# HN Reader — MERN Assignment

A mini full-stack web application that scrapes the top 10 stories from [Hacker News](https://news.ycombinator.com), stores them in MongoDB, and exposes a JWT-authenticated REST API consumed by a React frontend with bookmark support.

Built with **MongoDB · Express · React · Node.js** (MERN) + Tailwind CSS.

---

## ✨ Features

- **Scraper** — fetches top 10 stories (title, url, points, author, postedAt) from HN; runs on server start and via `POST /api/scrape`. Re-runs upsert by HN id (no duplicates).
- **JWT Auth** — register, login, password hashing with bcrypt, protected routes.
- **Stories API** — list (sorted by points desc, paginated), single story, toggle bookmark.
- **React frontend** — stories list, story detail, login/register pages, protected bookmarks page, bookmark toggle visible across all views.
- **Auth state** managed with **React Context API**, persisted in `localStorage`, axios interceptor attaches the token automatically.
- **Pagination** (bonus): `GET /api/stories?page=1&limit=10`.

---

## 🗂️ Project Structure

```
indeed-assignment/
├── backend/
│   └── src/
│       ├── config/db.js
│       ├── controllers/   (auth, story, scraper)
│       ├── middleware/    (auth, errorHandler)
│       ├── models/        (User, Story)
│       ├── routes/        (auth, story, user, scraper)
│       ├── services/scraper.js
│       ├── utils/generateToken.js
│       ├── app.js
│       └── server.js
└── frontend/
    └── src/
        ├── api/axios.js
        ├── components/    (Navbar, StoryCard, BookmarkButton, Pagination, ProtectedRoute)
        ├── context/AuthContext.jsx
        ├── pages/         (Home, StoryDetail, Login, Register, Bookmarks)
        ├── App.jsx
        ├── main.jsx
        └── index.css
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm**
- A **MongoDB Atlas** cluster (or any MongoDB instance) — grab the connection string

### 1. Clone

```bash
git clone <your-repo-url>
cd indeed-assignment
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env       # On Windows: copy .env.example .env
```

Edit `backend/.env`:

| Variable          | Description                                              | Example                                 |
| ----------------- | -------------------------------------------------------- | --------------------------------------- |
| `PORT`            | Backend port                                             | `5000`                                  |
| `MONGO_URI`       | MongoDB connection string                                | `mongodb+srv://user:pass@cluster/hn`    |
| `JWT_SECRET`      | Long random string used to sign JWTs                     | `change_me_to_a_long_random_string`     |
| `JWT_EXPIRES_IN`  | Token lifetime                                           | `7d`                                    |
| `CLIENT_ORIGIN`   | Allowed frontend origin (for CORS)                       | `http://localhost:5173`                 |

Install and run:

```bash
npm install
npm run dev          # nodemon, restarts on change
# or: npm start
```

You should see:

```
MongoDB connected: <cluster-host>
Server running on port 5000
Initial scrape complete — 10 stories saved
```

### 3. Frontend setup

In a second terminal:

```bash
cd frontend
cp .env.example .env       # On Windows: copy .env.example .env
```

Edit `frontend/.env` if needed:

| Variable             | Description                | Default                         |
| -------------------- | -------------------------- | ------------------------------- |
| `VITE_API_BASE_URL`  | Backend API base URL       | `http://localhost:5000/api`     |

Install and run:

```bash
npm install
npm run dev
```

Open **http://localhost:5173**.

---

## 🔌 API Reference

Base URL: `http://localhost:5000/api`

### Auth

| Method | Endpoint            | Auth | Body                          | Response                     |
| ------ | ------------------- | ---- | ----------------------------- | ---------------------------- |
| POST   | `/auth/register`    | ❌   | `{ name, email, password }`   | `{ user, token }`            |
| POST   | `/auth/login`       | ❌   | `{ email, password }`         | `{ user, token }`            |

### Stories

| Method | Endpoint                       | Auth | Description                                          |
| ------ | ------------------------------ | ---- | ---------------------------------------------------- |
| GET    | `/stories?page=1&limit=10`     | ❌   | List stories sorted by points desc + pagination meta |
| GET    | `/stories/:id`                 | ❌   | Single story                                         |
| POST   | `/stories/:id/bookmark`        | ✅   | Toggle bookmark; returns `{ bookmarked }`            |

### Users

| Method | Endpoint                       | Auth | Description                       |
| ------ | ------------------------------ | ---- | --------------------------------- |
| GET    | `/users/me/bookmarks`          | ✅   | Current user's bookmarked stories |

### Scraper

| Method | Endpoint     | Auth | Description                                |
| ------ | ------------ | ---- | ------------------------------------------ |
| POST   | `/scrape`    | ❌   | Manually trigger a scrape (runs on boot)   |

> Authenticated requests must send `Authorization: Bearer <token>`.

---

## 🧪 Quick API Tests

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'

# List stories
curl "http://localhost:5000/api/stories?page=1&limit=10"

# Trigger scrape
curl -X POST http://localhost:5000/api/scrape

# Toggle bookmark (replace TOKEN and STORY_ID)
curl -X POST http://localhost:5000/api/stories/<STORY_ID>/bookmark \
  -H "Authorization: Bearer <TOKEN>"
```

---

## 🛠️ Scripts

**Backend** (`backend/package.json`)

| Script          | What it does                  |
| --------------- | ----------------------------- |
| `npm start`     | Runs the server with Node     |
| `npm run dev`   | Runs the server with nodemon  |

**Frontend** (`frontend/package.json`)

| Script              | What it does                    |
| ------------------- | ------------------------------- |
| `npm run dev`       | Starts Vite dev server (5173)   |
| `npm run build`     | Production build to `dist/`     |
| `npm run preview`   | Serves the production build     |

---

## 📦 Tech Stack

- **Backend:** Node.js, Express, Mongoose, jsonwebtoken, bcryptjs, axios + cheerio (scraper), dotenv, cors
- **Frontend:** React 18, Vite, React Router v6, Axios, Context API, Tailwind CSS

---

## 📝 Notes

- All secrets live in `.env` files; `.env.example` files are committed as templates.
- `postedAt` is stored as the relative string from HN (e.g., "3 hours ago") — easy to display, matches HN UX.
- Scraper upserts by HN id, so re-running it updates points instead of duplicating rows.
- Token is stored in `localStorage` and attached automatically by an axios request interceptor; a 401 response wipes it (auto-logout on expiry).
- The backend exposes a `GET /api/health` endpoint for sanity checks.

---

## 📜 License

MIT — built as a take-home assignment for an Indeed Full Stack Developer (MERN) role.
