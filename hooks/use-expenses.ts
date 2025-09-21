"use client"

import { useState, useEffect } from "react"
import type { Expense, FilterOptions, Summary } from "@/lib/types"
import { calculateSplit, calculateExpenseTotals } from "@/lib/calculations"

const STORAGE_KEY = "budget-app-expenses"

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [filters, setFilters] = useState<FilterOptions>({})

  // Load expenses from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setExpenses(
          parsed.map((expense: any) => ({
            ...expense,
            createdAt: new Date(expense.createdAt),
          })),
        )
      } catch (error) {
        console.error("Failed to load expenses:", error)
      }
    }
  }, [])

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
  }, [expenses])

  const addExpense = (expenseData: Omit<Expense, "id" | "utkarshPays" | "tanyaPays" | "createdAt">) => {
    console.log("[v0] Adding expense with data:", expenseData)

    const { utkarshPays, tanyaPays } = calculateSplit(
      expenseData.amount,
      expenseData.splitType,
      expenseData.utkarshIncome,
      expenseData.tanyaIncome,
    )

    console.log("[v0] Calculated split - Utkarsh pays:", utkarshPays, "Tanya pays:", tanyaPays)

    // Generate a simple UUID alternative
    const generateId = () => {
      return Date.now().toString(36) + Math.random().toString(36).substr(2)
    }

    const newExpense: Expense = {
      ...expenseData,
      id: generateId(),
      utkarshPays,
      tanyaPays,
      createdAt: new Date(),
    }

    console.log("[v0] Created new expense:", newExpense)
    setExpenses((prev) => {
      const updated = [...prev, newExpense]
      console.log("[v0] Updated expenses array length:", updated.length)
      return updated
    })
  }

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id))
  }

  const filteredExpenses = expenses.filter((expense) => {
    if (filters.month && expense.month !== filters.month) return false
    if (filters.category && expense.category !== filters.category) return false
    return true
  })

  const summary: Summary = {
    ...calculateExpenseTotals(filteredExpenses),
    utkarshNet: 0,
    tanyaNet: 0,
    totalSpent: filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    categoryTotals: filteredExpenses.reduce(
      (totals, expense) => {
        totals[expense.category] = (totals[expense.category] || 0) + expense.amount
        return totals
      },
      {} as Record<string, number>,
    ),
    monthlyTotals: filteredExpenses.reduce(
      (totals, expense) => {
        totals[expense.month] = (totals[expense.month] || 0) + expense.amount
        return totals
      },
      {} as Record<string, number>,
    ),
  }

  // Calculate net amounts
  summary.utkarshNet = summary.utkarshTotalPaid - summary.utkarshTotalOwed
  summary.tanyaNet = summary.tanyaTotalPaid - summary.tanyaTotalOwed

  return {
    expenses: filteredExpenses,
    allExpenses: expenses,
    summary,
    filters,
    setFilters,
    addExpense,
    deleteExpense,
  }
}
