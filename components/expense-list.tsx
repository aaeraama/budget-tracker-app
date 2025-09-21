"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

// Define the Expense type to match what page.tsx provides
interface Expense {
  id: string
  description: string
  amount: number
  paidBy: "Utkarsh" | "Tanya"
  date: string
  category: string
}

// Update props to match the new Expense type and async onDelete function
interface ExpenseListProps {
  expenses: Expense[]
  onDelete: (id: string) => Promise<void> | void
}

// Helper function to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount)
}

// Helper function to format date string
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function ExpenseList({ expenses, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <Card className="shadow-lg border-border/50 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-muted-foreground text-center">
            <p className="text-lg font-medium mb-2">No expenses found</p>
            <p className="text-sm">Add your first expense or adjust your filters.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-border/50 backdrop-blur-sm">
      <CardContent className="p-0">
        <div className="hidden md:block rounded-md border overflow-x-auto">
          {/* Desktop Table View */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Paid By</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map(expense => (
                <TableRow key={expense.id}>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(expense.date)}</TableCell>
                  <TableCell className="font-medium max-w-[250px] truncate">{expense.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{expense.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge>{expense.paidBy}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Expense?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the expense:
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

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-3 p-4">
          {expenses.map(expense => (
            <Card key={expense.id} className="p-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <h3 className="font-medium text-sm leading-tight">{expense.description}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{expense.category}</Badge>
                    <Badge>{expense.paidBy}</Badge>
                  </div>
                   <p className="text-xs text-muted-foreground">{formatDate(expense.date)}</p>
                </div>
                <div className="text-right">
                   <p className="font-medium">{formatCurrency(expense.amount)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}