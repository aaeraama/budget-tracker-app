"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the shape of the filters to match page.tsx
interface FilterOptions {
  month: string;
  year: string;
}

interface ExpenseFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
}

// Create arrays for dropdowns
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const YEARS = ["2025", "2024", "2023"]; // Add more years as needed

export function ExpenseFilters({ filters, onFiltersChange }: ExpenseFiltersProps) {
  // A single handler for any filter change
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({ month: "all", year: "all" });
  };

  // Check if any filter is active (not set to "all")
  const hasActiveFilters = filters.month !== "all" || filters.year !== "all";

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Month Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Month:</label>
        <Select value={filters.month} onValueChange={(value) => handleFilterChange("month", value)}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {MONTHS.map((month, index) => (
              <SelectItem key={month} value={String(index + 1)}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year Filter */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Year:</label>
        <Select value={filters.year} onValueChange={(value) => handleFilterChange("year", value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {YEARS.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Button */}
      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={clearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  );
}
