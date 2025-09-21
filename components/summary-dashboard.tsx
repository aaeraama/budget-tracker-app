"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PoundSterlingIcon, Users, Calendar, Tag } from "lucide-react"
import type { Summary } from "@/lib/types"

interface SummaryDashboardProps {
  summary: Summary
  detailed?: boolean
}

export function SummaryDashboard({ summary, detailed = false }: SummaryDashboardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount)
  }

  // Prepare category data for pie chart
  const categoryData = Object.entries(summary.categoryTotals)
    .filter(([, amount]) => amount > 0)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
      percentage: ((amount / summary.totalSpent) * 100).toFixed(1),
    }))
    .sort((a, b) => b.value - a.value)

  // Prepare monthly data for horizontal bar chart
  const monthlyData = Object.entries(summary.monthlyTotals)
    .filter(([, amount]) => amount > 0)
    .map(([month, amount]) => ({
      month: month.slice(0, 3), // Abbreviate month names
      amount,
    }))

  const COLORS = [
    "#3b82f6", // blue-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#8b5cf6", // violet-500
    "#06b6d4", // cyan-500
    "#f97316", // orange-500
    "#84cc16", // lime-500
  ]

  // Chart configurations
  const categoryChartConfig = {
    value: {
      label: "Amount",
    },
  }

  const monthlyChartConfig = {
    amount: {
      label: "Amount",
      color: "#3b82f6",
    },
  }

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
              <div className="text-lg sm:text-xl font-bold">{formatCurrency(summary.totalSpent)}</div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-border/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
              <CardTitle className="text-sm font-medium">Utkarsh Spent</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl font-bold">{formatCurrency(summary.utkarshTotalPaid)}</div>
              <p className="text-xs text-muted-foreground">Total spending</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-border/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
              <CardTitle className="text-sm font-medium">Tanya Spent</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-xl font-bold">{formatCurrency(summary.tanyaTotalPaid)}</div>
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
                  <div className="space-y-4">
                    {/* Horizontal stacked bar */}
                    <div className="w-full">
                      <div className="flex rounded-lg overflow-hidden h-6 bg-muted">
                        {categoryData.map((item, index) => {
                          const percentage = (item.value / summary.totalSpent) * 100
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

                    {/* Category legend */}
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

            {/* Monthly Spending - Horizontal Bars */}
            {monthlyData.length > 0 && (
              <Card className="shadow-lg border-border/50 backdrop-blur-sm">
                <CardHeader className="pb-0 text-center">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5" />
                    Monthly Spending
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {monthlyData.map((item, index) => {
                      const maxAmount = Math.max(...monthlyData.map((d) => d.amount))
                      const percentage = (item.amount / maxAmount) * 100

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
              <CardHeader className="pb-0">
                <CardTitle className="text-lg">Payment Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Utkarsh Total Paid:</span>
                    <span className="font-mono text-sm sm:text-base">{formatCurrency(summary.utkarshTotalPaid)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Utkarsh Should Pay:</span>
                    <span className="font-mono text-sm sm:text-base">{formatCurrency(summary.utkarshTotalOwed)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Utkarsh Net:</span>
                    <span
                      className={`font-mono font-bold text-sm sm:text-base ${summary.utkarshNet >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {formatCurrency(summary.utkarshNet)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-border/50 backdrop-blur-sm">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg">Payment Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tanya Total Paid:</span>
                    <span className="font-mono text-sm sm:text-base">{formatCurrency(summary.tanyaTotalPaid)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Tanya Should Pay:</span>
                    <span className="font-mono text-sm sm:text-base">{formatCurrency(summary.tanyaTotalOwed)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Tanya Net:</span>
                    <span
                      className={`font-mono font-bold text-sm sm:text-base ${summary.tanyaNet >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {formatCurrency(summary.tanyaNet)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
