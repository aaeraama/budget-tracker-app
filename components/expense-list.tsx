"use client"

import { useState } from "react"
import { Trash2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// CORRECTED: This interface now matches the data from your use-expenses hook
interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: "Utkarsh" | "Tanya" | "Both";
  month: string;
  category: string;
  splitType: string;
  utkarshPays: number;
  tanyaPays: number;
  createdAt: Date;
}

interface ExpenseListProps {
  expenses: Expense[]
  onDelete: (id: string) => void
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  const [showCalculations, setShowCalculations] = useState(false)

  const formatCurrency = (amount: number) => {
    if (isNaN(amount)) return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(0);
    return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount)
  }

  const formatDate = (date: Date) => {
    if (!date || !(date instanceof Date)) return "Invalid Date";
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }
  
  const getCategoryColor = (category: string) => {
    // ... (your existing getCategoryColor function)
  }

  if (expenses.length === 0) {
    return (
      <Card className="shadow-lg border-border/50 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-muted-foreground text-center">
            <p className="text-lg font-medium mb-2">No expenses found</p>
            <p className="text-sm">Add your first expense to get started tracking your budget.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-border/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">{expenses.length} expenses</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCalculations(!showCalculations)}
            className="flex items-center gap-2"
          >
            {showCalculations ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showCalculations ? "Hide" : "Show"} Split Details
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Mobile View remains unchanged but will now work with the correct types */}
        
        <div className="hidden md:block rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Month</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Paid By</TableHead>
                <TableHead>Split Type</TableHead>
                {showCalculations && (
                  <>
                    <TableHead className="text-right">Utkarsh Pays</TableHead>
                    <TableHead className="text-right">Tanya Pays</TableHead>
                  </>
                )}
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(expense.createdAt)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {expense.month}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`text-xs ${getCategoryColor(expense.category)}`}>{expense.category}</Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <div className="truncate" title={expense.description}>
                      {expense.description}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>
                    <Badge variant={expense.paidBy === "Both" ? "secondary" : "default"} className="text-xs">
                      {expense.paidBy}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {expense.splitType}
                    </Badge>
                  </TableCell>
                  {showCalculations && (
                    <>
                      <TableCell className="text-right text-sm">{expense.splitType === "50/50" ? formatCurrency(expense.utkarshPays) : "—"}</TableCell>
                      <TableCell className="text-right text-sm">{expense.splitType === "50/50" ? formatCurrency(expense.tanyaPays) : "—"}</TableCell>
                    </>
                  )}
                  <TableCell>
                    {/* ... (your delete button dialog) */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}