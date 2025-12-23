import { Badge } from "@/components/ui/badge";

interface RoomStatusIndicatorProps {
  isAvailable: boolean;
  nextAvailable?: string;
}

export function RoomStatusIndicator({ isAvailable, nextAvailable }: RoomStatusIndicatorProps) {
  if (isAvailable) {
    return (
      <Badge
        variant="secondary"
        className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
        data-testid="badge-room-available"
      >
        Available
      </Badge>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Badge
        variant="secondary"
        className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
        data-testid="badge-room-occupied"
      >
        Occupied
      </Badge>
      {nextAvailable && (
        <span className="text-xs text-muted-foreground" data-testid="text-next-available">
          Available at {nextAvailable}
        </span>
      )}
    </div>
  );
}
