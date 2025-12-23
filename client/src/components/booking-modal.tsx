import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Calendar, Clock, Users, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { RoomWithStatus } from "@shared/schema";

const bookingSchema = z.object({
  title: z.string().min(1, "Meeting title is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  attendeeCount: z.coerce.number().min(1, "At least 1 attendee required"),
  bookedBy: z.string().min(1, "Your name is required"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingModalProps {
  room: RoomWithStatus | null;
  open: boolean;
  onClose: () => void;
}

export function BookingModal({ room, open, onClose }: BookingModalProps) {
  const { toast } = useToast();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      title: "",
      date: new Date().toISOString().split("T")[0],
      startTime: "09:00",
      endTime: "10:00",
      attendeeCount: 2,
      bookedBy: "",
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      if (!room) throw new Error("No room selected");
      return apiRequest("POST", "/api/bookings", {
        roomId: room.id,
        title: data.title,
        startTime: `${data.date} ${data.startTime}`,
        endTime: `${data.date} ${data.endTime}`,
        attendeeCount: data.attendeeCount,
        bookedBy: data.bookedBy,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rooms"] });
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Room Booked",
        description: `${room?.name} has been successfully booked.`,
      });
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book the room. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookingFormData) => {
    bookingMutation.mutate(data);
  };

  if (!room) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-lg" data-testid="dialog-booking">
        <DialogHeader>
          <DialogTitle data-testid="text-booking-title">Book {room.name}</DialogTitle>
          <DialogDescription>
            Fill in the details below to reserve this meeting room.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 py-3 px-4 bg-muted rounded-md mb-4">
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{room.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Max {room.capacity}</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Team Standup"
                      {...field}
                      data-testid="input-booking-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bookedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., John Smith"
                      {...field}
                      data-testid="input-booked-by"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        className="pl-10"
                        {...field}
                        data-testid="input-booking-date"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="time"
                          className="pl-10"
                          {...field}
                          data-testid="input-start-time"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="time"
                          className="pl-10"
                          {...field}
                          data-testid="input-end-time"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="attendeeCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Attendees</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        min={1}
                        max={room.capacity}
                        className="pl-10"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        data-testid="input-attendee-count"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
                data-testid="button-cancel-booking"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={bookingMutation.isPending}
                data-testid="button-confirm-booking"
              >
                {bookingMutation.isPending ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
