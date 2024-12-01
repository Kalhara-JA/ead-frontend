import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface Filters {
  searchTerm: string;
  filterDate: string;
  statusFilter: string;
}

interface OrderFilterProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

function OrderFilter({ filters, setFilters }: OrderFilterProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <Input
        placeholder="Search Orders..."
        value={filters.searchTerm}
        onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
        className="w-96"
      />
      <Input
        type="date"
        value={filters.filterDate}
        onChange={(e) => setFilters({ ...filters, filterDate: e.target.value })}
        className="w-35"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            {filters.statusFilter === "All" ? "Status" : filters.statusFilter}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {["All", "PENDING", "ORDERED", "RECIVED", "CANCELED"].map((status) => (
            <DropdownMenuItem key={status} onClick={() => setFilters({ ...filters, statusFilter: status })}>
              {status}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default OrderFilter;
