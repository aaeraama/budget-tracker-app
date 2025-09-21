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

  // Real-time listener for expenses from Firestore
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

  // Add expense to Firestore
  const addExpense = async (expenseData: Omit<Expense, "id" | "utkarshPays" | "tanyaPays" | "createdAt">) => {
    const { utkarshPays, tanyaPays } = calculateSplit(
      expenseData.amount,
      expenseData.splitType,
      expenseData.utkarshIncome ?? 0,
      expenseData.tanyaIncome ?? 0,
    );

    try {
      await addDoc(collection(db, "expenses"), {
        ...expenseData,
        month: expenseData.month,
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
      ...initialSummary,
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

  // The expenses passed to the page should be the filtered list
  const filteredExpenses = expenses.filter((expense) => {
    if (filters.month && filters.month !== "all" && expense.month !== filters.month) {
      return false;
    }
    if (filters.category && filters.category !== "all" && expense.category !== filters.category) {
      return false;
    }
    return true;
  });

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