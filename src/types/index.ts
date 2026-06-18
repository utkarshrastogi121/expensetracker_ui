// ─── Auth ────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserDTO;
}

// ─── User ────────────────────────────────────────────────────────────────────

export interface UserDTO {
  id: number;
  name: string;
  email: string;
}

export interface User {
  id?: number;
  name?: string;
  email?: string;
  password?: string;
}

// ─── Category ────────────────────────────────────────────────────────────────

export interface Category {
  id?: number;
  name?: string;
}

// ─── Expense ─────────────────────────────────────────────────────────────────

export interface Expense {
  id?: number;
  title: string;
  amount: number;
  date?: string;
}

export interface ExpenseDTO {
  id: number;
  title: string;
  amount: number;
  date: string;
  userId: number;
  categoryId: number;
  categoryName: string;
}

export interface BudgetResponseDTO {
  expense: ExpenseDTO;
  budgetExceeded: boolean;
  alertMessage: string;
}

//  Pagination

export interface Pageable {
  page: number;
  size: number;
  sort?: string[];
}

export interface PageExpenseDTO {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  content: ExpenseDTO[];
  number: number;
  numberOfElements: number;
  empty: boolean;
}

// Budget

export interface Budget {
  id?: number;
  amount: number;
  month: number;
  year: number;
  category?: Category;
}

export interface BudgetDTO {
  id: number;
  amount: number;
  month: number;
  year: number;
  categoryId: number;
  categoryName: string;
}

// Analytics 

export interface AnalyticsSummaryDTO {
  totalExpense: number;
  totalTransactions: number;
  currentMonthExpense: number;
}

export interface MonthlyExpenseDTO {
  month: string;
  amount: number;
}

export interface CategoryExpenseDTO {
  category: string;
  amount: number;
}
