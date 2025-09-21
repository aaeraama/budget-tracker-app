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
        {/* Mobile View is not affected and remains correct */}

        <div className="hidden md:block rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {/* CORRECTED: Removed the 'Date' TableHead */}
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
                  {/* CORRECTED: Removed the 'Date' TableCell */}
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
                    {/* ... your delete button dialog */}
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