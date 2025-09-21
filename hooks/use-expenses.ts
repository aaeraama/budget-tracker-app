"use client";

import { useState, useEffect } from "react";
import type { Expense, FilterOptions, Summary } from "@/lib/types";
import { calculateSplit, calculateExpenseTotals } from "@/lib/calculations";
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, QuerySnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useExpenses() {
  // ... (the top part of your hook is correct)

  // Add expense to Firestore
  const addExpense = async (expenseData: Omit<Expense, "id" | "utkarshPays" | "tanyaPays" | "createdAt">) => {
    const { utkarshPays, tanyaPays } = calculateSplit(
      expenseData.amount,
      expenseData.splitType,
      // CORRECTED: Provide a default value of 0 if income is undefined
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

  // ... (the rest of your hook is correct)
}