"use client";

import { useState, useEffect } from "react";
import type { Expense, FilterOptions, Summary } from "@/lib/types";
import { calculateSplit, calculateExpenseTotals } from "@/lib/calculations";
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, QuerySnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({ month: "all", category: "all" });

  useEffect(() => {
    const expensesQuery = query(collection(db, "expenses"));
    const unsubscribe = onSnapshot(expensesQuery, (querySnapshot: QuerySnapshot) => {
      const liveExpenses: Expense[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const createdAt = (data.createdAt as Timestamp)?.toDate() || new Date();
        
        // CORRECTED: Added all required fields to this object
        liveExpenses.push({
          id: docSnap.id,
          description: data.description,
          amount: parseFloat(data.amount) || 0,
          paidBy: data.paidBy,
          date: data.date, // Was missing
          month: data.month,
          category: data.category,
          splitType: data.splitType,
          utkarshPays: data.utkarshPays || 0,
          tanyaPays: data.tanyaPays || 0,
          utkarshIncome: data.utkarshIncome || 0, // Was missing
          tanyaIncome: data.tanyaIncome || 0, // Was missing
          createdAt: createdAt,
        });
      });
      setExpenses(liveExpenses);
    });
    return () => unsubscribe();
  }, []);

  const addExpense = async (expenseData: Omit<Expense, "id" | "utkarshPays" | "tanyaPays" | "createdAt">) => {
    // ... (rest of your hook is correct)
  };
  
  // ... (rest of your hook)

  return {
    // ... (your return object)
  };
}