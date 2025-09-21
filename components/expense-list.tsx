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
import type { Expense } from "@/lib/types"

interface ExpenseListProps {
  expenses: Expense[]
  onDelete: (id: string) => void
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  const [showCalculations, setShowCalculations] = useState(false)

  const formatCurrency = (amount: number) => {
    // ... your function
  }

  // CORRECTED: Added the missing formatDate function back
  const formatDate = (date: Date) => {
    if (!date || !(date instanceof Date)) return "Invalid Date";
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  const getCategoryColor = (category: string) => {
    // ... your function
  }

  if (expenses.length === 0) {
    // ... your no expenses card
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
        {/* Mobile View needs the formatDate function too */}
        <div className="block md:hidden space-y-4">
          {expenses.map((expense) => (
            <Card key={expense.id} className="p-4 shadow-lg border-border/50 backdrop-blur-sm">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getCategoryColor(expense.category)}`}>{expense.category}</Badge>
                      <Badge variant="outline" className="text-xs">
                        {expense.month}
                      </Badge>
                    </div>
                    <h3 className="font-medium text-sm leading-tight">{expense.description}</h3>
                    <p className="text-xs text-muted-foreground">{formatDate(expense.createdAt)}</p>
                  </div>
                  {/* ... rest of mobile card */}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="hidden md:block rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Month</TableHead>
                {/* ... rest of table headers */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(expense.createdAt)}</TableCell>
                  {/* ... rest of table cells */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}