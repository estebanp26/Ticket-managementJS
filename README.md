# Ticket Management System

A Single Page Application for managing support tickets, built with Vanilla JavaScript and a role-based access system. Users can log in as **admin**, **technician**, or **client**, each with their own dashboard and permissions.

---

## Description

This SPA allows users to create, view, update, and delete support tickets depending on their role. Authentication is handled through a dedicated JSON server, while ticket data lives in a separate one. The app features client-side routing, session management with auto-logout on inactivity, and role-based access control enforced at the router level.

---

## Technologies Used

| Technology | Purpose |
|---|---|
| Vanilla JavaScript (ES Modules) | Core application logic |
| Vite | Dev server and bundler |
| Axios | HTTP client for API requests |
| JSON Server | Mock REST API (auth + data) |
| SCSS | Styling |
| concurrently | Runs multiple npm scripts in parallel |

---

## Installation

> Requires Node.js >= 18.0.0

```bash
# 1. Clone the repository
git clone <repo-url>
cd Ticket-managementJS

# 2. Install dependencies
npm install

# 3. Create the environment file (already included)
# .env should contain:
# VITE_AUTH_URL=http://localhost:3001
# VITE_TICKET_URL=http://localhost:3002
```

---

## How to Run

### Option A — Run everything at once (recommended)

```bash
npm run dev
```

This uses `concurrently` to start all three processes simultaneously:
- Auth server on `http://localhost:3001`
- Data server on `http://localhost:3002`
- Vite dev server on `http://localhost:5173`

### Option B — Run each service manually

```bash
# Terminal 1 — Auth API (users)
npm run server:auth

# Terminal 2 — Data API (tickets)
npm run server:data

# Terminal 3 — Frontend
npm run frontend
```

### Available test users

| Username | Password | Role |
|---|---|---|
| `admin1` | `password123` | Admin |
| `tech1` | `password123` | Technician |
| `client1` | `password123` | Client |

---

## Project Structure

```
Ticket-managementJS/
├── index.html
├── package.json
├── .env
├── auth-db.json          # JSON Server — users database
├── data-db.json          # JSON Server — tickets database
└── assets/
    ├── scss/
    │   └── style.scss
    ├── css/
    │   └── styles.css
    └── js/
        ├── app.js            # Entry point, navigation handler
        ├── router.js         # Client-side router with role middleware
        ├── components/
        │   ├── navbar.js
        │   ├── ticketCard.js
        │   └── ticketForm.js
        ├── pages/
        │   ├── welcome.js
        │   ├── login.js
        │   ├── register.js
        │   ├── admin.js
        │   ├── technical.js
        │   ├── client.js
        │   └── accessDenied.js
        ├── services/
        │   ├── httpClient.js     # Axios instances (auth + data)
        │   ├── authService.js
        │   ├── ticketService.js
        │   └── userService.js
        ├── utils/
        │   ├── session.js        # Session persistence + inactivity timer
        │   ├── storage.js        # localStorage wrappers
        │   ├── validators.js
        │   └── helpers.js
        └── views/
            ├── welcome.html
            └── login.html
```

---

## Role Behavior

### Admin
- Sees **all tickets** in the system.
- Can **create**, **edit**, and **delete** any ticket.
- Can assign a technician to a ticket.
- Business rule: cannot change a ticket's status unless a technician is already assigned.

### Technician (Tech)
- Sees only tickets **assigned to them**.
- Can create new tickets — they are automatically assigned as the responsible technician.
- Can only **edit the status** of a ticket (cannot modify other fields).

### Client
- Sees only tickets **they created**.
- Can create tickets — these start with `status: "open"` and no technician assigned (pending admin assignment).
- Can edit the **name, type, and description** of their own tickets, but not the status.

### Access Control
The router acts as a middleware layer: every route has a `roles` array. If the current session's role is not in that list, the user is redirected to `/denied`. Unauthenticated users trying to access protected routes are redirected to `/login`.

---

## Technical Decisions

**Two separate JSON Server instances**
Auth and ticket data are intentionally split into two servers (`port 3001` and `port 3002`). This simulates a real microservices architecture where authentication and business data are decoupled.

**Client-side routing with History API**
The app uses `window.history.pushState` instead of hash-based routing (`#/route`). This gives cleaner URLs and mirrors how a real SPA framework would behave.

**Session stored in localStorage**
User session (id, username, role) is persisted in `localStorage` so it survives page refreshes. A 5-minute inactivity timer automatically logs the user out if they stop interacting with the app.

**Role middleware in the router**
Rather than checking roles inside each page component, the router itself handles authorization. This centralizes access control and keeps page components focused only on rendering logic.

**`httpClient.js` as a single source for API calls**
Two pre-configured Axios instances (`authAPI` and `dataAPI`) are exported from one file. All services consume from here, so if a base URL changes, only one file needs updating.
