import { Badge } from "@/components/ui/badge";
import type { EmployeeStatus } from "@shared/schema";

interface StatusBadgeProps {
  status: EmployeeStatus;
  className?: string;
}

const statusConfig: Record<EmployeeStatus, { label: string; className: string }> = {
  on_duty: {
    label: "On Duty",
    className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  on_leave: {
    label: "On Leave",
    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  remote: {
    label: "Remote",
    className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  out_of_office: {
    label: "Out of Office",
    className: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400",
  },
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="secondary"
      className={`${config.className} ${className}`}
      data-testid={`badge-status-${status}`}
    >
      {config.label}
    </Badge>
  );
}
