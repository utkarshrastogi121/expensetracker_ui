# Smart Expense Tracker — Frontend

A modern, responsive SaaS-style frontend for the Smart Expense Tracker API, built strictly from the provided OpenAPI specification.

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router DOM v6
- Axios (with interceptors)
- React Hook Form + Zod
- Recharts
- Redux (plain, for sidebar UI state)
- react-hot-toast (toast notifications)
- lucide-react (icons)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file and point it at your backend:

```bash
cp .env.example .env
```

```
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Run the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 4. Build for production

```bash
npm run build
npm run preview
```

## Features

### Authentication
- Login and signup pages backed by `/api/auth/login` and `/api/auth/signup`
- JWT stored in `localStorage`, attached to every request via an Axios request interceptor
- Auto-login on page refresh (session restored from `localStorage` on app load)
- Global 401 handling: expired/invalid tokens clear the session and redirect to `/login`
- `ProtectedRoute` component guards all authenticated pages

### Dashboard
- Total expense, current-month expense, and total transaction stat cards (`/api/analytics/summary`)
- Recent expenses table (latest 5, sorted by date)
- Quick navigation cards to Expenses, Budgets, Analytics, Profile

### Expenses
- Paginated table (`/api/expenses`) with Prev/Next controls
- Create, edit, and delete expenses (modal forms, validated with Zod)
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

### UI/UX
- Responsive layout: fixed sidebar on desktop, slide-over drawer on mobile (state managed in Redux)
- Loading, empty, and error states throughout
- Toast notifications for all create/update/delete actions and API errors
- Reusable `Button`, `Input`, `FormField`, and `Modal` components

## Folder Structure

```
src/
├── api/                    # Axios instance + one service file per API resource
│   ├── axios.ts            # Axios instance with auth + 401 interceptors
│   ├── authService.ts
│   ├── userService.ts
│   ├── expenseService.ts
│   ├── categoryService.ts
│   ├── budgetService.ts
│   └── analyticsService.ts
├── components/
│   ├── ui/                 # Generic, reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── FormField.tsx
│   │   ├── Modal.tsx
│   │   ├── Badge.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Spinner.tsx
│   │   ├── StatCard.tsx
│   │   └── Pagination.tsx
│   ├── layout/
│   │   ├── AppLayout.tsx   # Page shell: sidebar + topbar + outlet
│   │   └── Sidebar.tsx
│   ├── ProtectedRoute.tsx
│   ├── ExpenseFormModal.tsx
│   └── BudgetFormModal.tsx
├── context/
│   └── AuthContext.tsx     # Auth state, login/logout, session restore
├── hooks/
│   └── useAppRedux.ts      # Typed Redux hooks
├── pages/
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── DashboardPage.tsx
│   ├── ExpensesPage.tsx
│   ├── BudgetsPage.tsx
│   ├── AnalyticsPage.tsx
│   ├── ProfilePage.tsx
│   └── NotFoundPage.tsx
├── store/
│   ├── index.ts            # Redux store
│   └── uiSlice.ts          # Sidebar open/close reducer
├── types/
│   └── index.ts            # All TypeScript interfaces, derived from the OpenAPI spec
├── utils/
│   └── format.ts           # Currency/date formatting, error message helper
├── App.tsx                 # Routes
├── main.tsx                # Entry point
└── index.css               # Tailwind v4 theme + global styles
```

## Notes on the API contract

All requests, responses, and TypeScript types in this project are generated directly from the supplied OpenAPI spec:

- `Expense` create/update calls send `categoryId` as a query parameter alongside the `Expense` body, matching `POST /api/expenses` and `PUT /api/expenses/{id}`.
- `Budget` create calls send `categoryId` as a query parameter alongside the `Budget` body, matching `POST /api/budget`.
- Pagination uses Spring's `Pageable` query params (`page`, `size`, `sort`).
- `BudgetResponseDTO.budgetExceeded` / `alertMessage` are surfaced as toast warnings after creating or editing an expense.
