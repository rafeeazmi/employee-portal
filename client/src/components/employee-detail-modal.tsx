import { Mail, Phone, User, Calendar, Building, UserCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "./status-badge";
import type { Employee } from "@shared/schema";

interface EmployeeDetailModalProps {
  employee: Employee | null;
  open: boolean;
  onClose: () => void;
}

export function EmployeeDetailModal({ employee, open, onClose }: EmployeeDetailModalProps) {
  if (!employee) return null;

  const initials = employee.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-employee-detail">
        <DialogHeader>
          <DialogTitle className="sr-only">Employee Details</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center text-center py-4">
          <Avatar className="h-20 w-20 mb-4">
            <AvatarImage src={employee.avatarUrl || undefined} alt={employee.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold" data-testid="text-employee-detail-name">
            {employee.name}
          </h2>
          <p className="text-muted-foreground">{employee.position}</p>
          <div className="mt-3">
            <StatusBadge status={employee.status} />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
              <Building className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Department</p>
              <p className="text-sm font-medium">{employee.department}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <a
                href={`mailto:${employee.email}`}
                className="text-sm font-medium text-primary hover:underline"
                data-testid="link-employee-email"
              >
                {employee.email}
              </a>
            </div>
          </div>

          {employee.phone && (
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                <Phone className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <a
                  href={`tel:${employee.phone}`}
                  className="text-sm font-medium text-primary hover:underline"
                  data-testid="link-employee-phone"
                >
                  {employee.phone}
                </a>
              </div>
            </div>
          )}

          {employee.status === "on_leave" && (
            <>
              {employee.leaveStart && employee.leaveEnd && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-100 dark:bg-amber-900/30">
                    <Calendar className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Leave Period</p>
                    <p className="text-sm font-medium">
                      {employee.leaveStart} to {employee.leaveEnd}
                    </p>
                  </div>
                </div>
              )}

              {employee.alternateContact && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-muted">
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Alternate Contact</p>
                    <p className="text-sm font-medium">{employee.alternateContact}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
