"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExpenseForm } from "@/components/expense-form";
import ExpenseList from "@/components/expense-list";
import { SummaryDashboard } from "@/components/summary-dashboard";
import { ExpenseFilters } from "@/components/expense-filters";
import { PWAInstall } from "@/components/pwa-install";
import { ThemeToggle } from "@/components/theme-toggle";
import { Home, Plus, List, BarChart3, Wallet } from "lucide-react";
import { db } from "@/lib/firebase.js";
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, QuerySnapshot } from "firebase/firestore";

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: "Utkarsh" | "Tanya";
  date: string;
  category: string;
}

const formatCurrency = (amount: number) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(0);
  }
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
};

export default function BudgetApp() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState({
    total: 0,
    utkarshSpent: 0,
    tanyaSpent: 0,
    utkarshNet: 0,
    tanyaNet: 0,
    categoryTotals: {},
    monthlyTotals: {},
  });
  const [filters, setFilters] = useState({
    month: "all",
    year: "all",
  });

  useEffect(() => {
    const q = query(collection(db, "expenses"));
    const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
      const expensesData: Expense[] = [];
      querySnapshot.forEach(docSnap => {
        const data = docSnap.data();
        expensesData.push({
          id: docSnap.id,
          description: data.description,
          amount: parseFloat(data.amount) || 0,
          paidBy: data.paidBy,
          date: data.date,
          category: data.category,
        });
      });
      setExpenses(expensesData);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const total = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const utkarshSpent = expenses
      .filter(exp => exp.paidBy === "Utkarsh")
      .reduce((acc, exp) => acc + exp.amount, 0);
    const tanyaSpent = expenses
      .filter(exp => exp.paidBy === "Tanya")
      .reduce((acc, exp) => acc + exp.amount, 0);

    const half = total / 2;
    const utkarshNet = utkarshSpent - half;
    const tanyaNet = tanyaSpent - half;

    const categoryTotals = expenses.reduce((acc, expense) => {
      const { category, amount } = expense;
      if (category) {
        acc[category] = (acc[category] || 0) + amount;
      }
      return acc;
    }, {} as { [key: string]: number });

    const monthlyTotals = expenses.reduce((acc, expense) => {
      const month = new Date(expense.date).toLocaleString("default", { month: "long" });
      if (month) {
        acc[month] = (acc[month] || 0) + expense.amount;
      }
      return acc;
    }, {} as { [key: string]: number });

    setSummary({ total, utkarshSpent, tanyaSpent, utkarshNet, tanyaNet, categoryTotals, monthlyTotals });
  }, [expenses]);

  const addExpense = async (newExpense: Omit<Expense, "id">) => {
    try {
      const expenseWithNumberAmount = {
        ...newExpense,
        amount: parseFloat(String(newExpense.amount)) || 0,
      };
      await addDoc(collection(db, "expenses"), expenseWithNumberAmount);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await deleteDoc(doc(db, "expenses", id));
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const filteredExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const monthMatch = filters.month === "all" || expenseDate.getMonth() + 1 === parseInt(filters.month);
    const yearMatch = filters.year === "all" || expenseDate.getFullYear() === parseInt(filters.year);
    return monthMatch && yearMatch;
  });

  const SettlementText = () => {
    if (summary.utkarshNet > 0) {
      return (
        <p className="text-left text-sm text-green-600 dark:text-green-400 pink:text-green-700 mb-4 font-medium">
          <span className="font-semibold">Tanya owes Utkarsh {formatCurrency(summary.utkarshNet)}</span>
        </p>
      );
    } else if (summary.tanyaNet > 0) {
      return (
        <p className="text-left text-sm text-red-600 dark:text-red-400 pink:text-red-700 mb-4 font-medium">
          <span className="font-semibold">Utkarsh owes Tanya {formatCurrency(summary.tanyaNet)}</span>
        </p>
      );
    } else {
      return (
        <p className="text-left text-sm text-green-600 dark:text-green-400 pink:text-green-700 mb-4 font-medium">
          <span className="font-semibold">All settled up!</span>
        </p>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-full px-4 py-4 mx-auto">
        <header className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
              <Wallet className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary text-balance tracking-tight">
              Budget Tracker
            </h1>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base lg:text-lg text-pretty mb-4 leading-relaxed">
            made with love, hoping that we get rich, save up, and have fun :)
          </p>
          <SettlementText />
        </header>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-16 p-1.5 bg-muted/50 backdrop-blur-sm rounded-xl mb-6 shadow-lg border border-border/50">
            <TabsTrigger
              value="dashboard"
              className="flex items-center justify-center px-3 py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-border/50 transition-all duration-200 hover:bg-background/50"
              aria-label="Dashboard"
            >
              <Home className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger
              value="add-expense"
              className="flex items-center justify-center px-3 py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-border/50 transition-all duration-200 hover:bg-background/50"
              aria-label="Add Expense"
            >
              <Plus className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger
              value="expenses"
              className="flex items-center justify-center px-3 py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-border/50 transition-all duration-200 hover:bg-background/50"
              aria-label="View Expenses"
            >
              <List className="h-5 w-5" />
            </TabsTrigger>
            <TabsTrigger
              value="summary"
              className="flex items-center justify-center px-3 py-3 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-border/50 transition-all duration-200 hover:bg-background/50"
              aria-label="Summary"
            >
              <BarChart3 className="h-5 w-5" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="h-[calc(100vh-200px)] overflow-hidden">
            <SummaryDashboard summary={summary} />
          </TabsContent>

          <TabsContent value="add-expense" className="w-full">
            <Card className="shadow-lg border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold">Add New Expense</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpenseForm onSubmit={addExpense} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="w-full space-y-4">
            <Card className="shadow-lg border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl font-semibold">Filter Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpenseFilters filters={filters} onFiltersChange={setFilters} />
              </CardContent>
            </Card>
            <ExpenseList expenses={filteredExpenses} onDelete={deleteExpense} />
          </TabsContent>

          <TabsContent value="summary" className="w-full">
            <SummaryDashboard summary={summary} detailed />
          </TabsContent>
        </Tabs>
      </div>

      <PWAInstall />
    </div>
  );
}
