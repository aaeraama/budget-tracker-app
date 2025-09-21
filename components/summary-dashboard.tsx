"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PoundSterlingIcon, Users, Calendar, Tag } from "lucide-react"

// Define the Summary type to match what page.tsx provides
interface Summary {
  total: number
  utkarshSpent: number
  tanyaSpent: number
  utkarshNet: number
  tanyaNet: number
  categoryTotals: { [key: string]: number }
  monthlyTotals: { [key: string]: number }
}

interface SummaryDashboardProps {
  summary: Summary
  detailed?: boolean
}

// Helper function to format currency
const formatCurrency = (amount: number) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(0);
  }
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount)
}

export function SummaryDashboard({ summary, detailed = false }: SummaryDashboardProps) {
  // Add a loading/safety check
  if (!summary) {
    return <div>Loading summary...</div>
  }

  // Prepare category data for pie chart
  const categoryData = Object.entries(summary.categoryTotals || {})
    .filter(([, amount]) => amount > 0)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
      percentage: summary.total > 0 ? ((amount / summary.total) * 100).toFixed(1) : "0.0",
    }))
    .sort((a, b) => b.value - a.value)

  // Prepare monthly data for horizontal bar chart
  const monthlyData = Object.entries(summary.monthlyTotals || {})
    .filter(([, amount]) => amount > 0)
    .map(([month, amount]) => ({
      month: month.slice(0, 3), // Abbreviate month names
      amount,
    }))

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#84cc16"]

  return (
    <div className="w-full space-y-4">
      {/* Summary Cards */}
      {!detailed ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="shadow-lg border-border/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <PoundSterlingIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl font-bold">{formatCurrency(summary.total)}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-border/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
              <CardTitle className="text-sm font-medium">Utkarsh Spent</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl font-bold">{formatCurrency(summary.utkarshSpent)}</div>
              <p className="text-xs text-muted-foreground">Total spending</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-border/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
              <CardTitle className="text-sm font-medium">Tanya Spent</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl font-bold">{formatCurrency(summary.tanyaSpent)}</div>
              <p className="text-xs text-muted-foreground">Total spending</p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Charts */}
      {detailed && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Category Breakdown */}
            {categoryData.length > 0 && (
              <Card className="shadow-lg border-border/50 backdrop-blur-sm">
                <CardHeader className="pb-0">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Tag className="h-5 w-5" />
                    Spending by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 pt-4">
                    <div className="w-full">
                      <div className="flex rounded-lg overflow-hidden h-6 bg-muted">
                        {categoryData.map((item, index) => {
                          const percentage = summary.total > 0 ? (item.value / summary.total) * 100 : 0
                          return (
                            <div
                              key={item.name}
                              className="h-full transition-all duration-300 hover:opacity-80"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                              title={`${item.name}: ${formatCurrency(item.value)} (${item.percentage}%)`}
                            />
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {categoryData.map((item, index) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm font-medium truncate">{item.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatCurrency(item.value)} ({item.percentage}%)
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Monthly Spending */}
            {monthlyData.length > 0 && (
              <Card className="shadow-lg border-border/50 backdrop-blur-sm">
                <CardHeader className="pb-0">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5" />
                    Monthly Spending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 pt-4">
                    {monthlyData.map((item) => {
                      const maxAmount = Math.max(...monthlyData.map((d) => d.amount))
                      const percentage = maxAmount > 0 ? (item.amount / maxAmount) * 100 : 0

                      return (
                        <div key={item.month} className="space-y-1">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium">{item.month}</span>
                            <span className="text-muted-foreground">{formatCurrency(item.amount)}</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {/* Detailed Breakdown */}
      {detailed && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <Card className="shadow-lg border-border/50 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Utkarsh's Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Paid:</span>
                  <span className="font-mono text-sm sm:text-base">{formatCurrency(summary.utkarshSpent)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Fair Share (50%):</span>
                  <span className="font-mono text-sm sm:text-base">{formatCurrency(summary.total / 2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium">Net Balance:</span>
                  <span
                    className={`font-mono font-bold text-sm sm:text-base ${
                      summary.utkarshNet >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(summary.utkarshNet)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-border/50 backdrop-blur-sm">
               <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tanya's Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Paid:</span>
                  <span className="font-mono text-sm sm:text-base">{formatCurrency(summary.tanyaSpent)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Fair Share (50%):</span>
                  <span className="font-mono text-sm sm:text-base">{formatCurrency(summary.total / 2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium">Net Balance:</span>
                  <span
                    className={`font-mono font-bold text-sm sm:text-base ${
                      summary.tanyaNet >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatCurrency(summary.tanyaNet)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}