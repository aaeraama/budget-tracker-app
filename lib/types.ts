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
  // ... your other categories
  | "Miscellaneous";

export type PaidBy = "Utkarsh" | "Tanya" | "Both";

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: PaidBy;
  date: string;
  category: string;
  month: string;
  splitType: string;
  utkarshPays: number;
  tanyaPays: number;
  createdAt: Date;
  utkarshIncome?: number;
  tanyaIncome?: number;
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
  monthlyTotals: Record<string, number>; // CORRECTED: Changed from Record<Month, number>
}

export interface FilterOptions {
  month?: Month | "all" | string;
  category?: string | "all";
}