import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { DoorOpen, Users, CalendarCheck, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/stats-card";
import { RoomCard } from "@/components/room-card";
import { EmployeeCard } from "@/components/employee-card";
import { BookingModal } from "@/components/booking-modal";
import { EmployeeDetailModal } from "@/components/employee-detail-modal";
import { StatsCardSkeleton, RoomCardSkeleton, EmployeeCardSkeleton } from "@/components/loading-skeleton";
import type { RoomWithStatus, Employee } from "@shared/schema";

export default function Dashboard() {
  const [selectedRoom, setSelectedRoom] = useState<RoomWithStatus | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const { data: rooms, isLoading: roomsLoading } = useQuery<RoomWithStatus[]>({
    queryKey: ["/api/rooms"],
  });

  const { data: employees, isLoading: employeesLoading } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  const availableRooms = rooms?.filter((r) => r.isAvailable).length || 0;
  const totalRooms = rooms?.length || 0;
  const onDutyEmployees = employees?.filter((e) => e.status === "on_duty").length || 0;
  const onLeaveEmployees = employees?.filter((e) => e.status === "on_leave").length || 0;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-semibold" data-testid="text-page-title">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of today's status.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {roomsLoading || employeesLoading ? (
          <>
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
            <StatsCardSkeleton />
          </>
        ) : (
          <>
            <StatsCard
              title="Available Rooms"
              value={availableRooms}
              description={`of ${totalRooms} total rooms`}
              icon={DoorOpen}
              testId="stats-available-rooms"
            />
            <StatsCard
              title="On Duty"
              value={onDutyEmployees}
              description="employees working"
              icon={Users}
              testId="stats-on-duty"
            />
            <StatsCard
              title="On Leave"
              value={onLeaveEmployees}
              description="employees away"
              icon={CalendarCheck}
              testId="stats-on-leave"
            />
            <StatsCard
              title="Current Time"
              value={new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              description={new Date().toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}
              icon={Clock}
              testId="stats-current-time"
            />
          </>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
            <CardTitle className="text-xl">Meeting Rooms</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/rooms" data-testid="link-view-all-rooms">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roomsLoading ? (
                <>
                  <RoomCardSkeleton />
                  <RoomCardSkeleton />
                </>
              ) : rooms && rooms.length > 0 ? (
                rooms.slice(0, 3).map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onBookClick={setSelectedRoom}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No meeting rooms available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
            <CardTitle className="text-xl">Employee Status</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/employees" data-testid="link-view-all-employees">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employeesLoading ? (
                <>
                  <EmployeeCardSkeleton />
                  <EmployeeCardSkeleton />
                </>
              ) : employees && employees.length > 0 ? (
                employees.slice(0, 3).map((employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    onViewDetails={setSelectedEmployee}
                  />
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No employees found
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <BookingModal
        room={selectedRoom}
        open={!!selectedRoom}
        onClose={() => setSelectedRoom(null)}
      />

      <EmployeeDetailModal
        employee={selectedEmployee}
        open={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </div>
  );
}
