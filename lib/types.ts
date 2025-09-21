export type Month =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";

export type Category =
  | "Travel"
  | "Outdoor Food"
  | "Fun"
  | "Gift"
  | "Essentials"
  | "Personal"
  | "Housing"
  | "Utilities"
  | "Groceries"
  | "Transportation"
  | "Phone/Internet"
  | "Household"
  | "Insurance"
  | "Children/Pets"
  | "Leisure"
  | "Holidays"
  | "Debt Repayments"
  | "Miscellaneous";

// Keep PaidBy as union since Firestore respects this
export type PaidBy = "Utkarsh" | "Tanya" | "Both";

// Simplify Expense to accept any string category to fix TS error
export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: PaidBy;
  date: string;  // Firestore ISO date string
  category: string;  // Changed from Category union to string
}

export interface Summary {
  utkarshTotalOwed: number;
  tanyaTotalOwed: number;
  utkarshTotalPaid: number;
  tanyaTotalPaid: number;
  utkarshNet: number;
  tanyaNet: number;
  totalSpent: number;
  categoryTotals: Record<string, number>; // Changed to string keys
  monthlyTotals: Record<Month, number>;
}

export interface FilterOptions {
  month?: Month | "all";
  category?: string | "all";
}
