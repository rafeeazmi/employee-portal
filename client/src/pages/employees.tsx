import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmployeeCard } from "@/components/employee-card";
import { EmployeeDetailModal } from "@/components/employee-detail-modal";
import { EmployeeCardSkeleton } from "@/components/loading-skeleton";
import type { Employee, EmployeeStatus } from "@shared/schema";

const departments = [
  "All Departments",
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Design",
];

const statusOptions: { value: string; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "on_duty", label: "On Duty" },
  { value: "on_leave", label: "On Leave" },
  { value: "remote", label: "Remote" },
  { value: "out_of_office", label: "Out of Office" },
];

export default function Employees() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("All Departments");

  const { data: employees, isLoading } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  const filteredEmployees = employees?.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || employee.status === statusFilter;

    const matchesDepartment =
      departmentFilter === "All Departments" ||
      employee.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const statusCounts = employees?.reduce(
    (acc, emp) => {
      acc[emp.status] = (acc[emp.status] || 0) + 1;
      return acc;
    },
    {} as Record<EmployeeStatus, number>
  ) || {};

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" data-testid="text-page-title">Employee Directory</h1>
        <p className="text-muted-foreground mt-1">
          View employee status and contact information
        </p>
      </div>

      <div className="flex flex-wrap gap-3 py-2">
        {statusOptions.map((option) => {
          const count = option.value === "all"
            ? employees?.length || 0
            : statusCounts[option.value as EmployeeStatus] || 0;
          const isActive = statusFilter === option.value;
          return (
            <Button
              key={option.value}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(option.value)}
              data-testid={`button-filter-${option.value}`}
            >
              {option.label}
              <span className="ml-2 bg-background/20 text-xs px-1.5 py-0.5 rounded">
                {count}
              </span>
            </Button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-employees"
          />
        </div>
        <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-department-filter">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <EmployeeCardSkeleton />
          <EmployeeCardSkeleton />
          <EmployeeCardSkeleton />
          <EmployeeCardSkeleton />
          <EmployeeCardSkeleton />
          <EmployeeCardSkeleton />
        </div>
      ) : filteredEmployees && filteredEmployees.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onViewDetails={setSelectedEmployee}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No employees found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filter criteria
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setDepartmentFilter("All Departments");
            }}
            data-testid="button-clear-filters"
          >
            Clear Filters
          </Button>
        </div>
      )}

      <EmployeeDetailModal
        employee={selectedEmployee}
        open={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </div>
  );
}
