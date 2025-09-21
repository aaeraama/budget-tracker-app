"use client";

import { useState, useEffect } from "react";
import type { Expense, FilterOptions, Summary } from "@/lib/types";
import { calculateSplit, calculateExpenseTotals } from "@/lib/calculations";

import { collection, onSnapshot, addDoc, deleteDoc, doc, query, QuerySnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({ month: "all", category: "all" });

  // Real-time Firestore listener
  useEffect(() => {
    const expensesQuery = query(collection(db, "expenses"));
    const unsubscribe = onSnapshot(expensesQuery, (querySnapshot: QuerySnapshot) => {
      const liveExpenses: Expense[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        liveExpenses.push({
          id: docSnap.id,
          description: data.description,
          amount: parseFloat(data.amount) || 0,
          paidBy: data.paidBy,
          date: data.date,
          category: data.category,
          splitType: data.splitType,
          utkarshIncome: data.utkarshIncome,
          tanyaIncome: data.tanyaIncome,
          // CORRECTED: Added the missing lines to read the split values
          utkarshPays: data.utkarshPays || 0,
          tanyaPays: data.tanyaPays || 0,
        });
      });
      setExpenses(liveExpenses);
    });

    return () => unsubscribe();
  }, []);

  // Add expense to Firestore
  const addExpense = async (expenseData: Omit<Expense, "id" | "utkarshPays" | "tanyaPays" | "createdAt">) => {
    const { utkarshPays, tanyaPays } = calculateSplit(
      expenseData.amount,
      expenseData.splitType,
      expenseData.utkarshIncome,
      expenseData.tanyaIncome,
    );

    try {
      await addDoc(collection(db, "expenses"), {
        ...expenseData,
        amount: parseFloat(String(expenseData.amount)) || 0,
        utkarshPays,
        tanyaPays,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  // Delete expense from Firestore
  const deleteExpense = async (id: string) => {
    try {
      await deleteDoc(doc(db, "expenses", id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  // Filter expenses according to filters locally
  const filteredExpenses = expenses.filter((expense) => {
    if (filters.month && filters.month !== "all") {
      const expenseMonth = new Date(expense.date).getMonth() + 1;
      if (expenseMonth !== Number(filters.month)) return false;
    }
    if (filters.category && filters.category !== "all" && expense.category !== filters.category)
      return false;
    return true;
  });

  // Calculate summary on filtered expenses
  const summary: Summary = {
    ...calculateExpenseTotals(filteredExpenses),
    utkarshNet: 0,
    tanyaNet: 0,
    totalSpent: filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    categoryTotals: filteredExpenses.reduce<Record<string, number>>((totals, expense) => {
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
      return totals;
    }, {}),
    monthlyTotals: filteredExpenses.reduce<Record<string, number>>((totals, expense) => {
      const month = new Date(expense.date).toLocaleString("default", { month: "long" });
      totals[month] = (totals[month] || 0) + expense.amount;
      return totals;
    }, {}),
  };

  summary.utkarshNet = summary.utkarshTotalPaid - summary.utkarshTotalOwed;
  summary.tanyaNet = summary.tanyaTotalPaid - summary.tanyaTotalOwed;

  return {
    expenses: filteredExpenses,
    allExpenses: expenses,
    summary,
    filters,
    setFilters,
    addExpense,
    deleteExpense,
  };
}