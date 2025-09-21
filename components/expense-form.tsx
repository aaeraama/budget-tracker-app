"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

// This is a simplified Expense type that matches what page.tsx expects
interface ExpenseFormData {
  description: string
  amount: number
  paidBy: "Utkarsh" | "Tanya"
  date: string
  category: string
}

// The onSubmit prop now expects an async function with the correct data shape
interface ExpenseFormProps {
  onSubmit: (expense: Omit<ExpenseFormData, "id">) => Promise<void>
}

// A list of categories for the dropdown
const CATEGORIES = [
  "Groceries",
  "Dining Out",
  "Transport",
  "Shopping",
  "Entertainment",
  "Utilities",
  "Rent/Mortgage",
  "Health",
  "Other",
]

export function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // A simplified initial state that matches the new data model
  const getInitialState = () => ({
    description: "",
    amount: 0,
    paidBy: "Utkarsh" as "Utkarsh" | "Tanya",
    date: new Date().toISOString().split("T")[0], // Defaults to today's date
    category: "Other",
  })

  const [formData, setFormData] = useState(getInitialState())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.description || formData.amount <= 0) {
      toast({
        title: "Missing Information",
        description: "Please provide a description and an amount.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setFormData(getInitialState()) // Reset form to initial state
      toast({
        title: "Success!",
        description: "Expense has been added.",
      })
    } catch (error) {
      console.error("Form submission error:", error)
      toast({
        title: "Error",
        description: "Failed to add expense. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="e.g., Coffee, Train tickets"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (£)</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.amount || ""}
            onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="paidBy">Paid By</Label>
          <Select
            value={formData.paidBy}
            onValueChange={(value: "Utkarsh" | "Tanya") => setFormData({ ...formData, paidBy: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Utkarsh">Utkarsh</SelectItem>
              <SelectItem value="Tanya">Tanya</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={value => setFormData({ ...formData, category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Expense"}
        </Button>
      </div>
    </form>
  )
}