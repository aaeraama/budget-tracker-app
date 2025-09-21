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

export type PaidBy = "Utkarsh" | "Tanya" | "Both";

// CORRECTED: Added the missing fields to the Expense interface
export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: PaidBy;
  date: string;
  category: string;
  month: string;         // Added this field
  splitType: string;     // Added this field
  utkarshPays: number;   // Added this field
  tanyaPays: number;     // Added this field
  createdAt: Date;       // Added this field
  utkarshIncome?: number; // Added this optional field
  tanyaIncome?: number;  // Added this optional field
}

export interface Summary {
  utkarshTotalOwed: number;
  tanyaTotalOwed: number;
  utkarshTotalPaid: number;
  tanyaTotalPaid: number;
  utkarshNet: number;
  tanyaNet: number;
  totalSpent: number;
  categoryTotals: Record<string, number>;
  monthlyTotals: Record<Month, number>;
}

export interface FilterOptions {
  month?: Month | "all" | string; // Widened to string to match code
  category?: string | "all";
}