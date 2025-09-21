"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Adjust path if needed
import { ExpenseList } from "./expense-list";

export default function ExpensesContainer() {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "expenses"), (snapshot) => {
      const liveExpenses = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(liveExpenses);
    });

    return () => unsubscribe();
  }, []);

  async function handleDelete(id: string) {
    try {
      await deleteDoc(doc(db, "expenses", id));
      console.log(`Deleted expense with id: ${id}`);
    } catch (error) {
      console.error("Error deleting expense: ", error);
    }
  }

  return <ExpenseList expenses={expenses} onDelete={handleDelete} />;
}
