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
import { RoomCard } from "@/components/room-card";
import { BookingModal } from "@/components/booking-modal";
import { RoomCardSkeleton } from "@/components/loading-skeleton";
import type { RoomWithStatus } from "@shared/schema";

export default function Rooms() {
  const [selectedRoom, setSelectedRoom] = useState<RoomWithStatus | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [capacityFilter, setCapacityFilter] = useState<string>("all");

  const { data: rooms, isLoading } = useQuery<RoomWithStatus[]>({
    queryKey: ["/api/rooms"],
  });

  const filteredRooms = rooms?.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "available" && room.isAvailable) ||
      (statusFilter === "occupied" && !room.isAvailable);

    const matchesCapacity =
      capacityFilter === "all" ||
      (capacityFilter === "small" && room.capacity <= 4) ||
      (capacityFilter === "medium" && room.capacity > 4 && room.capacity <= 8) ||
      (capacityFilter === "large" && room.capacity > 8);

    return matchesSearch && matchesStatus && matchesCapacity;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" data-testid="text-page-title">Meeting Rooms</h1>
        <p className="text-muted-foreground mt-1">
          Browse and book available meeting rooms
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-rooms"
          />
        </div>
        <div className="flex gap-3 flex-wrap">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]" data-testid="select-status-filter">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
            </SelectContent>
          </Select>
          <Select value={capacityFilter} onValueChange={setCapacityFilter}>
            <SelectTrigger className="w-[140px]" data-testid="select-capacity-filter">
              <Users className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Capacity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              <SelectItem value="small">Small (1-4)</SelectItem>
              <SelectItem value="medium">Medium (5-8)</SelectItem>
              <SelectItem value="large">Large (9+)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <RoomCardSkeleton />
          <RoomCardSkeleton />
          <RoomCardSkeleton />
          <RoomCardSkeleton />
          <RoomCardSkeleton />
          <RoomCardSkeleton />
        </div>
      ) : filteredRooms && filteredRooms.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onBookClick={setSelectedRoom}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No rooms found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filter criteria
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("all");
              setCapacityFilter("all");
            }}
            data-testid="button-clear-filters"
          >
            Clear Filters
          </Button>
        </div>
      )}

      <BookingModal
        room={selectedRoom}
        open={!!selectedRoom}
        onClose={() => setSelectedRoom(null)}
      />
    </div>
  );
}
