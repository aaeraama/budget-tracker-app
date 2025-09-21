"use client";

import { useState, useEffect } from "react";
import type { Expense, FilterOptions, Summary } from "@/lib/types";
import { calculateSplit, calculateExpenseTotals } from "@/lib/calculations";
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, QuerySnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Define a complete initial state for the summary
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
  const [summary, setSummary] = useState<Summary>(initialSummary); // Use the complete initial state

  // Real-time Firestore listener
  useEffect(() => {
    const expensesQuery = query(collection(db, "expenses"));
    const unsubscribe = onSnapshot(expensesQuery, (querySnapshot: QuerySnapshot) => {
      const liveExpenses: Expense[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const createdAt = (data.createdAt as Timestamp)?.toDate() || new Date();
        liveExpenses.push({
          id: docSnap.id,
          description: data.description,
          amount: parseFloat(data.amount) || 0,
          paidBy: data.paidBy,
          date: data.date,
          month: data.month,
          category: data.category,
          splitType: data.splitType,
          utkarshPays: data.utkarshPays || 0,
          tanyaPays: data.tanyaPays || 0,
          createdAt: createdAt,
          utkarshIncome: data.utkarshIncome,
          tanyaIncome: data.tanyaIncome,
        });
      });
      setExpenses(liveExpenses);
    });
    return () => unsubscribe();
  }, []);

  // Recalculate summary when expenses or filters change
  useEffect(() => {
    const filteredExpenses = expenses.filter((expense) => {
      if (filters.month && filters.month !== "all" && expense.month !== filters.month) {
        return false;
      }
      if (filters.category && filters.category !== "all" && expense.category !== filters.category) {
        return false;
      }
      return true;
    });

    const calculatedTotals = calculateExpenseTotals(filteredExpenses);
    const newSummary: Summary = {
      ...initialSummary, // Start with the base structure
      ...calculatedTotals,
      totalSpent: filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      categoryTotals: filteredExpenses.reduce<Record<string, number>>((totals, expense) => {
        totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
        return totals;
      }, {}),
      monthlyTotals: filteredExpenses.reduce<Record<string, number>>((totals, expense) => {
        if (expense.month) {
          totals[expense.month] = (totals[expense.month] || 0) + expense.amount;
        }
        return totals;
      }, {}),
    };
    
    newSummary.utkarshNet = newSummary.utkarshTotalPaid - newSummary.utkarshTotalOwed;
    newSummary.tanyaNet = newSummary.tanyaTotalPaid - newSummary.tanyaTotalOwed;

    setSummary(newSummary);

  }, [expenses, filters]);

  // Add and Delete functions
  const addExpense = async (expenseData: Omit<Expense, "id" | "utkarshPays" | "tanyaPays" | "createdAt">) => {
    // ... your existing addExpense function
  };
  const deleteExpense = async (id: string) => {
    // ... your existing deleteExpense function
  };

  return {
    expenses,
    summary,
    filters,
    setFilters,
    addExpense,
    deleteExpense,
  };
}