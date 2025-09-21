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
  | "December"

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
  | "Miscellaneous"

export type PaidBy = "Utkarsh" | "Tanya" | "Both"

export type SplitType = "50/50" | "Income%" | "Utkarsh" | "Tanya" | "Both"

export interface Expense {
  id: string
  month: Month
  category: Category
  description: string
  amount: number
  paidBy: PaidBy
  splitType: SplitType
  utkarshIncome: number
  tanyaIncome: number
  utkarshPays: number
  tanyaPays: number
  createdAt: Date
}

export interface Summary {
  utkarshTotalOwed: number
  tanyaTotalOwed: number
  utkarshTotalPaid: number
  tanyaTotalPaid: number
  utkarshNet: number
  tanyaNet: number
  totalSpent: number
  categoryTotals: Record<Category, number>
  monthlyTotals: Record<Month, number>
}

export interface FilterOptions {
  month?: Month
  category?: Category
}
