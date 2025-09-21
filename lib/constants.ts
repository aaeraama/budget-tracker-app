import type { Month, Category, PaidBy, SplitType } from "./types"

export const MONTHS: Month[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export const CATEGORIES: Category[] = [
  "Travel",
  "Outdoor Food",
  "Fun",
  "Gift",
  "Essentials",
  "Personal",
  "Housing",
  "Utilities",
  "Groceries",
  "Transportation",
  "Phone/Internet",
  "Household",
  "Insurance",
  "Children/Pets",
  "Leisure",
  "Holidays",
  "Debt Repayments",
  "Miscellaneous",
]

export const PAID_BY_OPTIONS: PaidBy[] = ["Utkarsh", "Tanya", "Both"]

export const SPLIT_TYPE_OPTIONS: SplitType[] = ["50/50", "Income%", "Utkarsh", "Tanya", "Both"]
