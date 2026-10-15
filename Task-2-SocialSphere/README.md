# SocialSphere — Social Media Platform

A full-stack social media web application built with React, TypeScript, Node.js, Express, and MongoDB.

**CodeAlpha Full Stack Development Internship — Task 2**

---

## 📋 Features

### Authentication
- User registration with validation
- Secure login with JWT tokens
- Password hashing with bcrypt
- Protected routes and middleware
- Automatic session management

### User Profiles
- Profile picture, username, display name, and bio
- Edit profile functionality
- Follower/following counts
- User posts display
- Follow/unfollow users

### Posts
- Create posts with text content and/or images
- **Image uploads** — JPEG, PNG, WebP (max 5MB)
- Image preview before publishing
- Edit and delete own posts (ownership validation)
- Post timestamps and author information
- Paginated post feed

### Social Interactions
- Like/unlike posts (prevents duplicates)
- Add/delete comments with ownership checks
- Follow/unfollow users (prevents self-following)
- Real-time notifications via Socket.IO

### Home Feed
- Posts from followed users
- Loading, empty, and error states
- Pagination support

### Notifications
- Like, comment, and follow notifications
- Read/unread status tracking
- Real-time delivery via Socket.IO
- Mark individual or all as read

### Search
- Search users by username or display name
- Search posts by content text
- Empty results and error handling

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Professional landing page
- Consistent typography and spacing
- Accessible forms and controls
- Smooth animations and transitions
- Image loading states and error handling

---

## 🖼️ Image Uploads

### Supported Formats
- **JPEG** (.jpg, .jpeg)
- **PNG** (.png)
- **WebP** (.webp)

### Size Limit
- Maximum **5MB** per image

### How It Works

#### Demo Mode (Frontend Only)
The frontend includes a built-in demo mode using localStorage. Images are stored as base64 data URLs directly in the browser's localStorage.

- **Limitation**: localStorage has a ~5-10MB limit depending on the browser
- If storage is full, the post is saved without the image
- Images persist only in the current browser
- Not suitable for production use

#### Production Mode (With Cloudinary)
When Cloudinary credentials are configured in the backend:

1. User selects an image in the frontend
2. Image is uploaded to `POST /api/upload` (multipart form data)
3. Backend validates file type and size
4. Backend uploads to Cloudinary with automatic optimization
5. Cloudinary URL is returned and stored with the post
6. Images are served from Cloudinary's CDN

### Configuration

Add these to your `backend/.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Get credentials from [cloudinary.com](https://cloudinary.com) (free tier available).

### Image Features
- **Preview before posting** — See the image before publishing
- **Remove/replace** — Click X to remove, or select a new file
- **Paste from clipboard** — Ctrl+V an image directly into the post composer
- **Upload progress** — Visual progress indicator during upload
- **Error handling** — Clear messages for invalid files, size limits, upload failures
- **Broken image fallback** — Graceful display when images fail to load
- **Lazy loading** — Images load on demand for better performance
- **Responsive display** — Images scale to fit the feed and profile views

---

## 🏗️ Architecture

```
Task-2-SocialSphere/
├── frontend/               # React + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── App.tsx         # Main app with all pages & components
│   │   ├── main.tsx        # Entry point
│   │   ├── index.css       # Tailwind styles
│   │   ├── types/          # TypeScript interfaces
│   │   ├── services/       # API service layer (mockApi for demo)
│   │   └── context/        # React Context providers (AuthContext)
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tsconfig.json
├── backend/                # Node.js + Express + TypeScript + MongoDB
│   ├── src/
│   │   ├── server.ts       # Express server + Socket.IO
│   │   ├── models/         # Mongoose models (User, Post, Notification)
│   │   ├── routes/         # API routes (auth, users, posts, notifications, upload)
│   │   ├── middleware/     # JWT auth, error handling
│   │   └── validators/     # Zod schemas
│   ├── package.json
│   └── tsconfig.json
├── README.md
├── .env.example
└── .gitignore
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcrypt |
| Validation | Zod |
| Real-time | Socket.IO |
| Image Storage | Cloudinary (production) / base64 (demo) |
| File Upload | Multer |
| Icons | Lucide React |

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas connection string)
- (Optional) Cloudinary account for image storage

### Frontend Setup

```bash
cd frontend
npm install
npm run dev        # Development server at http://localhost:5173
npm run build      # Production build
```

### Backend Setup

```bash
cd backend
npm install
npm run dev        # Development server at http://localhost:5000
npm run build      # TypeScript compilation
npm start          # Production server
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_URL=mongodb://localhost:27017/socialsphere

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Cloudinary (optional — without this, images use base64 fallback)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

See `.env.example` for the template.

---

## 📡 API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/search?q=query` | Search users |
| GET | `/api/users/:username` | Get user profile |
| PUT | `/api/users/profile` | Update profile |
| POST | `/api/users/:id/follow` | Follow user |
| POST | `/api/users/:id/unfollow` | Unfollow user |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts/feed` | Get home feed |
| GET | `/api/posts/explore` | Get all posts |
| GET | `/api/posts/search?q=query` | Search posts |
| GET | `/api/posts/user/:userId` | Get user's posts |
| POST | `/api/posts` | Create post |
| PUT | `/api/posts/:id` | Update post |
| DELETE | `/api/posts/:id` | Delete post |
| POST | `/api/posts/:id/like` | Like post |
| POST | `/api/posts/:id/unlike` | Unlike post |
| POST | `/api/posts/:id/comment` | Add comment |
| DELETE | `/api/posts/:id/comment/:commentId` | Delete comment |

### Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload` | Upload image (multipart/form-data, field: `image`) |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | Get user notifications |
| GET | `/api/notifications/unread-count` | Get unread count |
| PUT | `/api/notifications/:id/read` | Mark as read |
| PUT | `/api/notifications/read-all` | Mark all as read |

---

## 🗄️ Database Models

### User
- `username` (String, unique, indexed)
- `displayName` (String)
- `email` (String, unique)
- `password` (String, hashed)
- `bio` (String)
- `avatar` (String)
- `coverImage` (String)
- `followers` (ObjectId[])
- `following` (ObjectId[])

### Post
- `author` (ObjectId → User)
- `content` (String, max 5000)
- `image` (String — Cloudinary URL or data URL)
- `likes` (ObjectId[])
- `comments` (Subdocument[])
- `createdAt`, `updatedAt`

### Notification
- `user` (ObjectId → User)
- `type` (enum: like, comment, follow)
- `from` (ObjectId → User)
- `post` (ObjectId → Post, optional)
- `content` (String)
- `read` (Boolean)

---

## 🧪 Demo Mode

The frontend includes a built-in demo mode with localStorage-based data persistence. This allows testing all features without a running backend:

- **Demo accounts:**
  - `alex@example.com` / `alex@example.com`
  - `sarah@example.com` / `sarah@example.com`
  - `mike@example.com` / `mike@example.com`

- Seed data includes sample posts, users, and interactions.
- Image uploads work in demo mode using base64 data URLs stored in localStorage.
- localStorage has size limits — large images may cause storage errors.

---

## 📝 Known Limitations

1. **Image Storage (Demo Mode)** — Images are stored as base64 in localStorage. This has a ~5-10MB browser limit. For production, configure Cloudinary.
2. **Image Storage (Backend without Cloudinary)** — Falls back to base64 data URLs stored in MongoDB. Not recommended for production.
3. **Real-time** — Socket.IO is configured in the backend. The demo frontend uses localStorage polling.
4. **Database** — Requires MongoDB connection. Use MongoDB Atlas for cloud deployment.
5. **Image Optimization** — Cloudinary automatically optimizes images (resize, quality, format). Without Cloudinary, no optimization occurs.

---

## 📦 Commands Summary

```bash
# Frontend
cd frontend
npm install
npm run dev          # Start dev server
npm run build        # Production build
npm run typecheck    # TypeScript check

# Backend
cd backend
npm install
npm run dev          # Start dev server (tsx watch)
npm run build        # Compile TypeScript
npm start            # Run production build
```

---

## 🔒 Security

- Passwords are hashed with bcrypt (12 rounds)
- JWT tokens expire after 7 days
- File uploads validated for type and size
- Rate limiting on all API endpoints
- CORS configured for specific origins
- No secrets exposed in frontend code
- Cloudinary credentials stored server-side only

---

## 📄 License

Built for CodeAlpha Full Stack Development Internship.

**Author:** Jaynandan Kumar
