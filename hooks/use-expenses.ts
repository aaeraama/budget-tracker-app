"use client";

import { useState, useEffect } from "react";
import type { Expense, FilterOptions, Summary } from "@/lib/types";
import { calculateSplit, calculateExpenseTotals } from "@/lib/calculations";
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, QuerySnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const initialSummary: Summary = {
  totalSpent: 0,
  utkarshTotalPaid: 0,
  tanyaTotalPaid: 0,
  utkarshTotalOwed: 0,
  tanyaTotalOwed: 0,
  utkarshNet: 0,
  tanyaNet: 0,
  categoryTotals: {},
  monthlyTotals: {},
};

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({ month: "all", category: "all" });
  const [summary, setSummary] = useState<Summary>(initialSummary);

  // ... (your useEffect hooks for fetching and calculating are correct)

  const addExpense = async (expenseData: Omit<Expense, "id" | "utkarshPays" | "tanyaPays" | "createdAt">) => {
    // ... (your addExpense function is correct)
  };

  const deleteExpense = async (id: string) => {
    // ... (your deleteExpense function is correct)
  };

  // CORRECTED: The return object was missing the 'allExpenses' property
  // which caused the destructuring to fail in some cases. 
  // We will return the main 'expenses' array for both.
  return {
    expenses: expenses,
    allExpenses: expenses, // Ensure this property is always present
    summary,
    filters,
    setFilters,
    addExpense,
    deleteExpense,
  };
}