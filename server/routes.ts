import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRoomBookingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Get all rooms with availability status
  app.get("/api/rooms", async (req, res) => {
    try {
      const rooms = await storage.getRoomsWithStatus();
      res.json(rooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      res.status(500).json({ message: "Failed to fetch rooms" });
    }
  });

  // Get single room
  app.get("/api/rooms/:id", async (req, res) => {
    try {
      const room = await storage.getRoom(req.params.id);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }
      res.json(room);
    } catch (error) {
      console.error("Error fetching room:", error);
      res.status(500).json({ message: "Failed to fetch room" });
    }
  });

  // Get all bookings
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Create a booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const validationResult = insertRoomBookingSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid booking data",
          errors: validationResult.error.errors,
        });
      }

      // Check if room exists
      const room = await storage.getRoom(validationResult.data.roomId);
      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      // Check capacity
      if (validationResult.data.attendeeCount > room.capacity) {
        return res.status(400).json({
          message: `Room capacity is ${room.capacity}, but ${validationResult.data.attendeeCount} attendees requested`,
        });
      }

      // Check for booking conflicts
      const existingBookings = await storage.getBookingsByRoom(validationResult.data.roomId);
      const newStart = validationResult.data.startTime;
      const newEnd = validationResult.data.endTime;

      const hasConflict = existingBookings.some((existing) => {
        // Check if the new booking overlaps with any existing booking
        return (
          (newStart >= existing.startTime && newStart < existing.endTime) ||
          (newEnd > existing.startTime && newEnd <= existing.endTime) ||
          (newStart <= existing.startTime && newEnd >= existing.endTime)
        );
      });

      if (hasConflict) {
        return res.status(409).json({
          message: "This time slot conflicts with an existing booking. Please choose a different time.",
        });
      }

      const booking = await storage.createBooking(validationResult.data);
      res.status(201).json(booking);
    } catch (error) {
      console.error("Error creating booking:", error);
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Get all employees
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getAllEmployees();
      res.json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  // Get single employee
  app.get("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.getEmployee(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      console.error("Error fetching employee:", error);
      res.status(500).json({ message: "Failed to fetch employee" });
    }
  });

  return httpServer;
}
