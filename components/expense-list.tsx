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
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Travel: "bg-blue-100 text-blue-800",
      "Outdoor Food": "bg-green-100 text-green-800",
      Fun: "bg-purple-100 text-purple-800",
      Gift: "bg-pink-100 text-pink-800",
      Essentials: "bg-gray-100 text-gray-800",
      Personal: "bg-indigo-100 text-indigo-800",
      Housing: "bg-orange-100 text-orange-800",
      Utilities: "bg-yellow-100 text-yellow-800",
      Groceries: "bg-emerald-100 text-emerald-800",
      Transportation: "bg-cyan-100 text-cyan-800",
      "Phone/Internet": "bg-teal-100 text-teal-800",
      Household: "bg-lime-100 text-lime-800",
      Insurance: "bg-red-100 text-red-800",
      "Children/Pets": "bg-rose-100 text-rose-800",
      Leisure: "bg-violet-100 text-violet-800",
      Holidays: "bg-fuchsia-100 text-fuchsia-800",
      "Debt Repayments": "bg-slate-100 text-slate-800",
      Miscellaneous: "bg-neutral-100 text-neutral-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this expense? This action cannot be undone.
                          <div className="mt-2 p-2 bg-muted rounded text-sm">
                            <strong>{expense.description}</strong> - {formatCurrency(expense.amount)}
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(expense.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
                    <p className="font-medium">{formatCurrency(expense.amount)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Paid by:</span>
                    <p>
                      <Badge variant={expense.paidBy === "Both" ? "secondary" : "default"} className="text-xs">
                        {expense.paidBy}
                      </Badge>
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Split:</span>
                    <p>
                      <Badge variant="outline" className="text-xs">
                        {expense.splitType}
                      </Badge>
                    </p>
                  </div>
                  {showCalculations && (
                    <div>
                      <span className="text-muted-foreground">Split Details:</span>
                      <p className="text-xs">
                        U: {formatCurrency(expense.utkarshPays)}
                        <br />
                        T: {formatCurrency(expense.tanyaPays)}
                      </p>
                    </div>
                  )}
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
                      <TableCell className="text-right text-sm">{formatCurrency(expense.utkarshPays)}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(expense.tanyaPays)}</TableCell>
                    </>
                  )}
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this expense? This action cannot be undone.
                            <div className="mt-2 p-2 bg-muted rounded text-sm">
                              <strong>{expense.description}</strong> - {formatCurrency(expense.amount)}
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(expense.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
