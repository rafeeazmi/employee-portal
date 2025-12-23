import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (kept for reference)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Meeting Rooms
export const meetingRooms = pgTable("meeting_rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  capacity: integer("capacity").notNull(),
  amenities: text("amenities").array().notNull(),
  imageUrl: text("image_url"),
});

export const insertMeetingRoomSchema = createInsertSchema(meetingRooms).omit({
  id: true,
});

export type InsertMeetingRoom = z.infer<typeof insertMeetingRoomSchema>;
export type MeetingRoom = typeof meetingRooms.$inferSelect;

// Room Bookings
export const roomBookings = pgTable("room_bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomId: varchar("room_id").notNull(),
  title: text("title").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  attendeeCount: integer("attendee_count").notNull(),
  bookedBy: text("booked_by").notNull(),
});

export const insertRoomBookingSchema = createInsertSchema(roomBookings).omit({
  id: true,
});

export type InsertRoomBooking = z.infer<typeof insertRoomBookingSchema>;
export type RoomBooking = typeof roomBookings.$inferSelect;

// Employees
export type EmployeeStatus = "on_duty" | "on_leave" | "remote" | "out_of_office";

export const employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  department: text("department").notNull(),
  position: text("position").notNull(),
  status: text("status").notNull().$type<EmployeeStatus>(),
  avatarUrl: text("avatar_url"),
  leaveStart: text("leave_start"),
  leaveEnd: text("leave_end"),
  alternateContact: text("alternate_contact"),
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
});

export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;

// Room with availability status
export interface RoomWithStatus extends MeetingRoom {
  isAvailable: boolean;
  currentBooking?: RoomBooking;
  nextAvailable?: string;
}
