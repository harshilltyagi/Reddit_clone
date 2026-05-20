 Reddit Clone

A full-stack Reddit-inspired community platform built with React, Node.js, and PostgreSQL.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Node.js + Express (ESM) |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT + bcrypt |
| Routing | React Router DOM v6 |

---

## ✨ Features

### 1. User Authentication
- Secure **Sign Up** and **Login** with email and password
- Passwords hashed with **bcrypt**
- **JWT-based** session management (7-day expiry)
- Protected routes for authenticated users only

### 2. Communities (Subreddits)
- Create communities with name, slug, and description
- Auto-generated slug from community name
- Unique community pages at `/r/community-name`
- Join / Leave communities
- Dynamic sidebar showing real communities from database

### 3. Posts
- Create posts in **3 formats** — Text, Image, Link
- Image posts support URL-based image with live preview
- View all posts on home feed and within specific communities
- Full post detail page with breadcrumb navigation

### 4. Voting System
- Upvote and Downvote posts
- Real-time vote count update
- Toggle vote (click same vote to remove)
- Switch between upvote and downvote seamlessly

### 5. Comments
- Add comments on any post
- Comments displayed in reverse chronological order
- Comment as logged-in user
- Real-time comment count on posts

### 6. Sorting
- Sort posts by **Hot**, **New**, **Top**, **Rising**
- Filter posts by community
- Pagination support on all feeds

---

## 📁 Project Structure

```
Reddit_clone/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Navbar, PostCard, Sidebar, Modals
│   │   ├── pages/           # LoginPage, SignupPage, HomePage, etc.
│   │   ├── context/         # AuthContext (global auth state)
│   │   └── lib/             # api.js, config.js
│   └── package.json
│
└── server/                  # Express backend
    ├── controllers/         # authController, postController, etc.
    ├── routes/              # authRoutes, postRoutes, communityRoutes
    ├── middleware/          # auth middleware (JWT verify)
    ├── utils/               # prismaClient.js
    ├── prisma/
    │   └── schema.prisma    # Database schema
    └── package.json
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- PostgreSQL database
- npm

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/reddit-clone.git
cd reddit-clone
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create `.env` file in `/server`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/reddit_clone"
JWT_SECRET="your_super_secret_key"
```

Run database migrations:
```bash
npx prisma migrate dev
npx prisma generate
```

Start backend server:
```bash
npm run dev
```
> Server runs on `http://localhost:3000`

### 3. Setup Frontend
```bash
cd client
npm install
npm run dev
```
> Frontend runs on `http://localhost:5173`

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |

### Communities
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/communities` | List all communities |
| GET | `/api/communities/:slug` | Get community by slug |
| POST | `/api/communities` | Create community 🔒 |
| POST | `/api/communities/:slug/join` | Join community 🔒 |
| DELETE | `/api/communities/:slug/leave` | Leave community 🔒 |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | List posts (supports `?sort=latest\|popular&communitySlug=`) |
| GET | `/api/posts/:id` | Get post detail |
| POST | `/api/posts` | Create post 🔒 |

### Votes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/posts/:id/vote` | Upvote / Downvote post 🔒 |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts/:id/comments` | Get comments for post |
| POST | `/api/posts/:id/comments` | Add comment 🔒 |
| DELETE | `/api/posts/comments/:id` | Delete comment 🔒 |

> 🔒 Requires `Authorization: Bearer <token>` header

---

## 🗄️ Database Schema

```
User ──< Post ──< Comment
 │         │
 │         └──< Vote
 │
 └──< CommunityMember >── Community ──< Post
```

---

## 🌐 Pages

| Route | Page |
|-------|------|
| `/` | Home Feed |
| `/login` | Login |
| `/signup` | Sign Up |
| `/r/:slug` | Community Page |
| `/r/:slug/comments/:id` | Post Detail |
| `/create-community` | Create Community |

---

## 👤 Author

Built by **Harshill** — Full Stack Developer

---

## 📄 License

MIT License — free to use and modify.

