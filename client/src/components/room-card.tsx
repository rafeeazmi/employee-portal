import { Users, MapPin, Tv, Wifi, Presentation } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoomStatusIndicator } from "./room-status-indicator";
import type { RoomWithStatus } from "@shared/schema";

interface RoomCardProps {
  room: RoomWithStatus;
  onBookClick: (room: RoomWithStatus) => void;
}

const amenityIcons: Record<string, typeof Tv> = {
  "projector": Presentation,
  "video_conf": Tv,
  "whiteboard": Presentation,
  "wifi": Wifi,
};

export function RoomCard({ room, onBookClick }: RoomCardProps) {
  return (
    <Card className="group" data-testid={`card-room-${room.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold truncate" data-testid={`text-room-name-${room.id}`}>
              {room.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{room.location}</span>
            </div>
          </div>
          <RoomStatusIndicator
            isAvailable={room.isAvailable}
            nextAvailable={room.nextAvailable}
          />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span data-testid={`text-room-capacity-${room.id}`}>{room.capacity} people</span>
          </div>
          <div className="flex items-center gap-2">
            {room.amenities.map((amenity) => {
              const Icon = amenityIcons[amenity] || Tv;
              return (
                <div
                  key={amenity}
                  className="text-muted-foreground"
                  title={amenity.replace("_", " ")}
                >
                  <Icon className="h-4 w-4" />
                </div>
              );
            })}
          </div>
        </div>
        {room.currentBooking && (
          <div className="mt-3 p-3 bg-muted rounded-md">
            <p className="text-sm font-medium">{room.currentBooking.title}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {room.currentBooking.startTime} - {room.currentBooking.endTime}
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={room.isAvailable ? "default" : "secondary"}
          onClick={() => onBookClick(room)}
          data-testid={`button-book-room-${room.id}`}
        >
          {room.isAvailable ? "Book Now" : "Schedule Later"}
        </Button>
      </CardFooter>
    </Card>
  );
}
