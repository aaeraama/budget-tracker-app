"use client";

import React from "react";
import type { Expense } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => Promise<void> | void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete }) => {
  if (!expenses || expenses.length === 0) {
    return <p className="text-center py-4 text-muted-foreground">No expenses found.</p>;
  }

  return (
    <ul className="space-y-4">
      {expenses.map((expense) => (
        <li key={expense.id} className="flex items-center justify-between p-4 border rounded-lg shadow-sm">
          <div>
            <p className="font-medium">{expense.description}</p>
            <p className="text-sm text-muted-foreground">
              {expense.category} - {new Date(expense.date).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-semibold">
              {new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(expense.amount)}
            </span>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDelete(expense.id)}
              aria-label={`Delete expense ${expense.description}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ExpenseList;
