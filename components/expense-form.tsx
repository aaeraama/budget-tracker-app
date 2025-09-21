"use client"

import type React from "react"
import { getCurrentMonth } from "@/lib/utils"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { MONTHS, CATEGORIES, PAID_BY_OPTIONS, SPLIT_TYPE_OPTIONS } from "@/lib/constants"
import type { Expense } from "@/lib/types"

interface ExpenseFormProps {
  // CORRECTED: Added Promise<void> to handle the async function from the hook
  onSubmit: (expense: Omit<Expense, "id" | "utkarshPays" | "tanyaPays" | "createdAt">) => Promise<void> | void
}

export function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getInitialState = () => ({
    month: getCurrentMonth(),
    category: "Miscellaneous",
    description: "",
    amount: 0,
    paidBy: "Both" as "Utkarsh" | "Tanya" | "Both",
    splitType: "50/50",
    utkarshIncome: 0,
    tanyaIncome: 0,
    // Add a default for the date field
    date: new Date().toISOString().split("T")[0],
  })

  const [formData, setFormData] = useState(getInitialState())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.description || formData.amount <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setFormData(getInitialState()) // Reset form
      toast({
        title: "Expense Added",
        description: "Your expense has been successfully recorded.",
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
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Month Selection */}
          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Select
              value={formData.month}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, month: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter expense description..."
            className="min-h-20"
            value={formData.description}
            onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (£)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.amount || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: Number.parseFloat(e.target.value) || 0 }))}
            />
          </div>

          {/* Paid By */}
          <div className="space-y-2">
            <Label htmlFor="paidBy">Paid By</Label>
            <Select
              value={formData.paidBy}
              onValueChange={(value: "Utkarsh" | "Tanya" | "Both") => setFormData((prev) => ({ ...prev, paidBy: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Who paid?" />
              </SelectTrigger>
              <SelectContent>
                {PAID_BY_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Split Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Split Type */}
          <div className="space-y-2">
            <Label htmlFor="splitType">Split Type</Label>
            <Select
              value={formData.splitType}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, splitType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="How to split?" />
              </SelectTrigger>
              <SelectContent>
                {SPLIT_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Empty div to maintain grid structure */}
          <div></div>
        </div>

        {/* Income Fields - Only show when split type is Income% */}
        {formData.splitType === "Income%" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-card rounded-lg border">
            <div className="space-y-2">
              <Label htmlFor="utkarshIncome">Utkarsh Income (£)</Label>
              <Input
                id="utkarshIncome"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.utkarshIncome || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, utkarshIncome: Number.parseFloat(e.target.value) || 0 }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tanyaIncome">Tanya Income (£)</Label>
              <Input
                id="tanyaIncome"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.tanyaIncome || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tanyaIncome: Number.parseFloat(e.target.value) || 0 }))
                }
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setFormData(getInitialState())}
            disabled={isSubmitting}
          >
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adding..." : "Add Expense"}
          </Button>
        </div>
      </form>
    </div>
  )
}