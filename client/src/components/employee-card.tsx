import { Mail, Phone, User, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./status-badge";
import type { Employee } from "@shared/schema";

interface EmployeeCardProps {
  employee: Employee;
  onViewDetails?: (employee: Employee) => void;
}

export function EmployeeCard({ employee, onViewDetails }: EmployeeCardProps) {
  const initials = employee.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="hover-elevate" data-testid={`card-employee-${employee.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={employee.avatarUrl || undefined} alt={employee.name} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold truncate" data-testid={`text-employee-name-${employee.id}`}>
                  {employee.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {employee.position}
                </p>
              </div>
              <StatusBadge status={employee.status} />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{employee.department}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{employee.email}</span>
          </div>
          {employee.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{employee.phone}</span>
            </div>
          )}
          {employee.status === "on_leave" && employee.leaveEnd && (
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 mt-3 pt-3 border-t">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>Returns: {employee.leaveEnd}</span>
            </div>
          )}
        </div>
        {onViewDetails && (
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-4"
            onClick={() => onViewDetails(employee)}
            data-testid={`button-view-employee-${employee.id}`}
          >
            View Details
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
