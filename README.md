# Smart Expense Tracker — Frontend

A modern, responsive frontend for the Expense Tracker API.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router DOM v6
- Axios
- React Hook Form + Zod
- Recharts
- Redux
- react-hot-toast (toast notifications)
- lucide-react (icons)

## Backend

- Backend Repository: [Expense Tracker API](https://github.com/utkarshrastogi121/expensetracker_backend)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Run the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Features

### Authentication
- Login and signup pages backed by `/api/auth/login` and `/api/auth/signup`
- JWT stored in `localStorage`, attached to every request via an Axios request interceptor
- Auto-login on page refresh (session restored from `localStorage` on app load)
- Global 401 handling: expired/invalid tokens clear the session and redirect to `/login`
- `ProtectedRoute` component guards all authenticated pages

### Dashboard
- Total expense, current-month expense, and total transaction stat cards (`/api/analytics/summary`)
- Quick navigation cards to Expenses, Budgets, Analytics, Profile

### Expenses
- Paginated table (`/api/expenses`)
- Search by title (`/api/expenses/search`)
- Filter by category (`/api/expenses/category/{categoryId}`)
- Filter by date range (`/api/expenses/filter`)
- Budget-exceeded alerts surfaced as toasts when returned by the API

### Budgets
- List all budgets (`/api/budget`) as cards showing category, month/year, and amount
- Create new budgets, scoped to a category

### Analytics
- Category breakdown pie chart (`/api/analytics/category`)
- Monthly expense bar chart (`/api/analytics/monthly`)
- Summary stat cards (`/api/analytics/summary`)

### Profile
- View current user (`/api/users/me`)
- Update name, email, and optionally password (`PUT /api/users/me`)

---

## Author

Built by **Utkarsh Rastogi**

⭐ Star the repository if you found it useful.