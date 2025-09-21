import type { Expense, SplitType } from "./types"

export function calculateSplit(
  amount: number,
  splitType: SplitType,
  utkarshIncome: number,
  tanyaIncome: number,
): { utkarshPays: number; tanyaPays: number } {
  switch (splitType) {
    case "50/50":
    case "Both":
      return {
        utkarshPays: amount / 2,
        tanyaPays: amount / 2,
      }

    case "Income%":
      const totalIncome = utkarshIncome + tanyaIncome
      if (totalIncome === 0) {
        return { utkarshPays: amount / 2, tanyaPays: amount / 2 }
      }
      const utkarshRatio = utkarshIncome / totalIncome
      const tanyaRatio = tanyaIncome / totalIncome
      return {
        utkarshPays: amount * utkarshRatio,
        tanyaPays: amount * tanyaRatio,
      }

    case "Utkarsh":
      return {
        utkarshPays: amount,
        tanyaPays: 0,
      }

    case "Tanya":
      return {
        utkarshPays: 0,
        tanyaPays: amount,
      }

    default:
      return { utkarshPays: amount / 2, tanyaPays: amount / 2 }
  }
}

export function calculateExpenseTotals(expenses: Expense[]) {
  return expenses.reduce(
    (totals, expense) => {
      totals.utkarshTotalOwed += expense.utkarshPays
      totals.tanyaTotalOwed += expense.tanyaPays

      if (expense.paidBy === "Utkarsh") {
        totals.utkarshTotalPaid += expense.amount
      } else if (expense.paidBy === "Tanya") {
        totals.tanyaTotalPaid += expense.amount
      } else if (expense.paidBy === "Both") {
        totals.utkarshTotalPaid += expense.amount / 2
        totals.tanyaTotalPaid += expense.amount / 2
      }

      return totals
    },
    {
      utkarshTotalOwed: 0,
      tanyaTotalOwed: 0,
      utkarshTotalPaid: 0,
      tanyaTotalPaid: 0,
    },
  )
}
