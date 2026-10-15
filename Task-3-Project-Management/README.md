# ProjectFlow - Project Management System

> **CodeAlpha Full Stack Development Internship - Task 3**

A professional, full-featured project management web application built with React, TypeScript, and Tailwind CSS. ProjectFlow enables teams to create projects, manage tasks, track progress with Kanban boards, and collaborate effectively.

![ProjectFlow](https://img.shields.io/badge/Project-ProjectFlow-indigo)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4-cyan)

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-starting)
- [Environment Configuration](#environment-configuration)
- [Usage Guide](#usage-guide)
- [API Design](#api-design)
- [Security Notes](#security-notes)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)

## ✨ Features

### Authentication & Authorization
- User registration with validation
- Secure login with JWT-based sessions
- Protected routes with automatic redirect
- Persistent authentication via localStorage
- Password visibility toggle
- Form validation with clear error messages

### Dashboard
- Real-time statistics calculated from actual data
- Total/active projects count
- Task completion metrics
- Overdue task tracking
- Recent activity feed
- Upcoming deadlines overview
- Visual progress indicators

### Project Management
- Create, edit, and delete projects
- Set project status (Planning, Active, On Hold, Completed)
- Set priority levels (Low, Medium, High, Urgent)
- Configure start and due dates
- Search and filter projects
- Project progress visualization
- Member management with roles

### Task Management
- Full CRUD operations for tasks
- Assign tasks to project members
- Set priority and status levels
- Due date tracking with overdue indicators
- Search, filter, and sort tasks
- Quick status updates
- Task completion tracking

### Kanban Board
- Visual drag-and-drop task management
- Four columns: Todo, In Progress, In Review, Completed
- Real-time status updates
- Project filtering
- Keyboard-accessible status changes
- Visual priority indicators

### Team Management
- View all project members
- Role-based access (Owner, Admin, Member)
- Add members by email
- Remove members with confirmation
- Member avatars with initials
- Cross-project member overview

### User Experience
- Responsive design (desktop, tablet, mobile)
- Loading indicators and skeleton states
- Empty states with helpful CTAs
- Confirmation dialogs for destructive actions
- Toast notifications for feedback
- Error boundaries for graceful error handling
- Smooth transitions and animations
- Accessible navigation and keyboard support

## 🛠 Technology Stack

| Category | Technology |
|----------|-----------|
| Frontend Framework | React 18 |
| Language | TypeScript 5 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 6 |
| Drag & Drop | @dnd-kit |
| Icons | Lucide React |
| Animations | Framer Motion |
| Charts | Recharts |
| Date Handling | date-fns |
| Data Persistence | localStorage (simulated backend) |

## 🏗 Architecture

### Frontend Architecture

```
src/
├── App.tsx                 # Main app with routing
├── main.tsx               # Entry point
├── index.css              # Global styles + Tailwind
├── types/
│   └── index.ts           # TypeScript interfaces
├── context/
│   └── AuthContext.tsx     # Authentication state
├── services/
│   └── api.ts             # Data service layer
├── components/
│   ├── Layout.tsx          # App layout with sidebar
│   ├── Toast.tsx           # Notification system
│   └── ErrorBoundary.tsx   # Error handling
└── pages/
    ├── Login.tsx           # Login page
    ├── Register.tsx        # Registration page
    ├── Dashboard.tsx       # Overview dashboard
    ├── Projects.tsx        # Project list + CRUD
    ├── ProjectDetails.tsx  # Project detail + tasks
    ├── Tasks.tsx           # All tasks view
    ├── Kanban.tsx          # Kanban board
    └── Team.tsx            # Team members view
```

### Data Flow

1. **Services Layer** (`services/api.ts`): Simulates backend API with localStorage persistence
2. **Context Layer** (`context/AuthContext.tsx`): Manages authentication state globally
3. **Component Layer**: React components consume services and context
4. **Persistence**: All data stored in browser localStorage

### Backend Design (Reference)

The application is designed with a backend-ready architecture. The service layer mirrors REST API patterns:

```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Authenticate user
GET    /api/auth/me           - Get current user
GET    /api/projects          - List user's projects
POST   /api/projects          - Create project
GET    /api/projects/:id      - Get project details
PATCH  /api/projects/:id      - Update project
DELETE /api/projects/:id      - Delete project
POST   /api/projects/:id/members    - Add member
DELETE /api/projects/:id/members/:userId - Remove member
GET    /api/projects/:projectId/tasks - List project tasks
POST   /api/projects/:projectId/tasks - Create task
PATCH  /api/tasks/:id         - Update task
DELETE /api/tasks/:id         - Delete task
GET    /api/dashboard/stats   - Dashboard statistics
GET    /api/activities        - Activity feed
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```powershell
# Navigate to the project directory
cd Task-3-Project-Management

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```powershell
npm run build
```

### Type Checking

```powershell
npm run typecheck
```

## 🔧 Environment Configuration

For a full-stack deployment, create a `.env` file based on `.env.example`:

### Backend Environment Variables
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/projectflow
JWT_SECRET=your-secure-jwt-secret-here
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables
```
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ **Important**: Never commit `.env` files with real credentials to version control.

## 📖 Usage Guide

### Demo Account

The application comes pre-seeded with demo data:
- **Email**: `demo@projectflow.com`
- **Password**: `demo123`

### Creating a New Account

1. Click "Create one" on the login page
2. Fill in your name, email, and password
3. You'll be automatically logged in

### Managing Projects

1. Navigate to **Projects** from the sidebar
2. Click **New Project** to create a project
3. Set name, description, status, priority, and dates
4. Click on a project card to view details
5. Add tasks and manage team members

### Using the Kanban Board

1. Navigate to **Kanban Board** from the sidebar
2. Drag task cards between columns to update status
3. Use the project filter to focus on specific projects
4. Use the quick status dropdown for keyboard access

### Managing Tasks

1. Navigate to **Tasks** to see all tasks across projects
2. Use search and filters to find specific tasks
3. Click the checkbox to quickly complete tasks
4. Use edit/delete buttons for modifications

## 🔒 Security Notes

- Passwords are never stored in plain text (hashed with bcrypt in production)
- JWT tokens are used for session management
- Protected routes redirect unauthenticated users
- Input validation on both client and server side
- CORS configured for specific origins
- Rate limiting on authentication endpoints
- No sensitive data exposed in API responses

### Current Implementation Notes

This version uses localStorage for data persistence as a frontend demonstration. In production:
- Replace localStorage with real API calls to the backend
- Use HttpOnly cookies for JWT storage
- Implement CSRF protection
- Add rate limiting middleware
- Use HTTPS in production

## ⚠️ Known Limitations

1. **Data Persistence**: Data is stored in browser localStorage and will be lost if cleared
2. **No Real Backend**: The backend service layer is simulated; no actual server/database
3. **Single Device**: Data doesn't sync across devices or browsers
4. **No Email Notifications**: Member invitations are in-app only
5. **No File Uploads**: Avatar uploads not implemented
6. **Basic Search**: Search is client-side only, no full-text search

## 🔮 Future Improvements

- [ ] Real Node.js/Express backend with MongoDB
- [ ] WebSocket for real-time updates
- [ ] Email notifications for assignments and deadlines
- [ ] File attachments on tasks
- [ ] Gantt chart view for project timelines
- [ ] Time tracking integration
- [ ] Export/import project data
- [ ] Dark mode theme
- [ ] Multi-language support (i18n)
- [ ] Advanced reporting and analytics
- [ ] Mobile app (React Native)
- [ ] CI/CD pipeline with automated testing
- [ ] Docker containerization

## 📄 License

This project is created as part of the CodeAlpha Full Stack Development Internship program.

---

**Built with ❤️ for CodeAlpha Task 3**
