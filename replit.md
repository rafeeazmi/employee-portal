# Employee Portal - Internal Services

## Overview
An internal employee portal application providing two main services:
1. **Meeting Room Availability** - Check room availability and book meeting rooms
2. **Employee Status** - View employee directory and check who is on duty, on leave, remote, or out of office

## Tech Stack
- **Frontend**: React with TypeScript, Tailwind CSS, Shadcn UI components
- **Backend**: Express.js with TypeScript
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Styling**: Tailwind CSS with dark/light theme support

## Project Structure
```
client/src/
├── components/           # Reusable UI components
│   ├── app-sidebar.tsx   # Main navigation sidebar
│   ├── booking-modal.tsx # Room booking form modal
│   ├── employee-card.tsx # Employee info card
│   ├── employee-detail-modal.tsx
│   ├── loading-skeleton.tsx
│   ├── room-card.tsx     # Meeting room card
│   ├── room-status-indicator.tsx
│   ├── stats-card.tsx    # Dashboard statistics card
│   ├── status-badge.tsx  # Employee status badge
│   └── theme-toggle.tsx  # Dark/light mode toggle
├── pages/
│   ├── dashboard.tsx     # Main dashboard with overview
│   ├── rooms.tsx         # Meeting rooms listing & booking
│   └── employees.tsx     # Employee directory
├── lib/
│   ├── theme.tsx         # Theme context provider
│   └── queryClient.ts    # TanStack Query client
└── App.tsx               # Main app with routing

server/
├── routes.ts             # API endpoints
├── storage.ts            # In-memory data storage
└── index.ts              # Express server setup

shared/
└── schema.ts             # Data types and Zod schemas
```

## API Endpoints
- `GET /api/rooms` - Get all meeting rooms with availability status
- `GET /api/rooms/:id` - Get single room details
- `POST /api/bookings` - Create a room booking
- `GET /api/bookings` - Get all bookings
- `GET /api/employees` - Get all employees with status
- `GET /api/employees/:id` - Get single employee details

## Features
- Dashboard with stats overview (available rooms, on-duty employees, etc.)
- Meeting room search and filtering by status/capacity
- Room booking with conflict detection
- Employee directory with status filtering by department and status type
- Employee detail modal with contact information
- Dark/light theme toggle
- Responsive design with collapsible sidebar

## Running the Application
The application runs on port 5000 with `npm run dev`. The Express server serves both the API and the React frontend via Vite.

## Recent Changes
- December 2024: Initial implementation with meeting room booking and employee directory features
- Added booking conflict detection to prevent double-bookings
- Implemented dark/light theme support
