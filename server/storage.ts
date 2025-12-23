import {
  type User,
  type InsertUser,
  type MeetingRoom,
  type InsertMeetingRoom,
  type RoomBooking,
  type InsertRoomBooking,
  type Employee,
  type InsertEmployee,
  type RoomWithStatus,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Meeting Rooms
  getAllRooms(): Promise<MeetingRoom[]>;
  getRoom(id: string): Promise<MeetingRoom | undefined>;
  getRoomsWithStatus(): Promise<RoomWithStatus[]>;

  // Bookings
  getAllBookings(): Promise<RoomBooking[]>;
  getBookingsByRoom(roomId: string): Promise<RoomBooking[]>;
  createBooking(booking: InsertRoomBooking): Promise<RoomBooking>;

  // Employees
  getAllEmployees(): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private rooms: Map<string, MeetingRoom>;
  private bookings: Map<string, RoomBooking>;
  private employees: Map<string, Employee>;

  constructor() {
    this.users = new Map();
    this.rooms = new Map();
    this.bookings = new Map();
    this.employees = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed meeting rooms
    const roomsData: MeetingRoom[] = [
      {
        id: "room-1",
        name: "Atlas Conference Room",
        location: "Floor 3, Building A",
        capacity: 12,
        amenities: ["projector", "video_conf", "whiteboard"],
        imageUrl: null,
      },
      {
        id: "room-2",
        name: "Phoenix Meeting Pod",
        location: "Floor 2, Building A",
        capacity: 4,
        amenities: ["video_conf", "wifi"],
        imageUrl: null,
      },
      {
        id: "room-3",
        name: "Summit Boardroom",
        location: "Floor 5, Building B",
        capacity: 20,
        amenities: ["projector", "video_conf", "whiteboard", "wifi"],
        imageUrl: null,
      },
      {
        id: "room-4",
        name: "Spark Huddle Space",
        location: "Floor 1, Building A",
        capacity: 6,
        amenities: ["whiteboard", "wifi"],
        imageUrl: null,
      },
      {
        id: "room-5",
        name: "Innovation Lab",
        location: "Floor 4, Building B",
        capacity: 8,
        amenities: ["projector", "video_conf", "wifi"],
        imageUrl: null,
      },
      {
        id: "room-6",
        name: "Focus Room Alpha",
        location: "Floor 2, Building B",
        capacity: 2,
        amenities: ["wifi"],
        imageUrl: null,
      },
    ];

    roomsData.forEach((room) => this.rooms.set(room.id, room));

    // Seed some bookings - create bookings that span current time for demo purposes
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const currentHour = now.getHours();
    
    // Create a booking that's happening now (current hour to current hour + 1)
    const currentStartHour = currentHour.toString().padStart(2, "0");
    const currentEndHour = (currentHour + 1).toString().padStart(2, "0");
    
    // Create a booking for later today
    const laterStartHour = ((currentHour + 2) % 24).toString().padStart(2, "0");
    const laterEndHour = ((currentHour + 3) % 24).toString().padStart(2, "0");

    const bookingsData: RoomBooking[] = [
      {
        id: "booking-1",
        roomId: "room-1",
        title: "Quarterly Planning",
        startTime: `${today} ${currentStartHour}:00`,
        endTime: `${today} ${currentEndHour}:30`,
        attendeeCount: 8,
        bookedBy: "Sarah Johnson",
      },
      {
        id: "booking-2",
        roomId: "room-3",
        title: "Board Meeting",
        startTime: `${today} ${currentStartHour}:00`,
        endTime: `${today} ${currentEndHour}:00`,
        attendeeCount: 15,
        bookedBy: "Michael Chen",
      },
      {
        id: "booking-3",
        roomId: "room-5",
        title: "Product Demo",
        startTime: `${today} ${laterStartHour}:00`,
        endTime: `${today} ${laterEndHour}:00`,
        attendeeCount: 6,
        bookedBy: "Emily Rodriguez",
      },
    ];

    bookingsData.forEach((booking) => this.bookings.set(booking.id, booking));

    // Seed employees
    const employeesData: Employee[] = [
      {
        id: "emp-1",
        name: "Sarah Johnson",
        email: "sarah.johnson@company.com",
        phone: "+1 (555) 123-4567",
        department: "Engineering",
        position: "Senior Software Engineer",
        status: "on_duty",
        avatarUrl: null,
        leaveStart: null,
        leaveEnd: null,
        alternateContact: null,
      },
      {
        id: "emp-2",
        name: "Michael Chen",
        email: "michael.chen@company.com",
        phone: "+1 (555) 234-5678",
        department: "Engineering",
        position: "Engineering Manager",
        status: "remote",
        avatarUrl: null,
        leaveStart: null,
        leaveEnd: null,
        alternateContact: null,
      },
      {
        id: "emp-3",
        name: "Emily Rodriguez",
        email: "emily.rodriguez@company.com",
        phone: "+1 (555) 345-6789",
        department: "Marketing",
        position: "Marketing Director",
        status: "on_leave",
        avatarUrl: null,
        leaveStart: "2024-12-20",
        leaveEnd: "2024-12-27",
        alternateContact: "David Kim",
      },
      {
        id: "emp-4",
        name: "David Kim",
        email: "david.kim@company.com",
        phone: "+1 (555) 456-7890",
        department: "Marketing",
        position: "Content Strategist",
        status: "on_duty",
        avatarUrl: null,
        leaveStart: null,
        leaveEnd: null,
        alternateContact: null,
      },
      {
        id: "emp-5",
        name: "Jessica Lee",
        email: "jessica.lee@company.com",
        phone: "+1 (555) 567-8901",
        department: "HR",
        position: "HR Manager",
        status: "on_duty",
        avatarUrl: null,
        leaveStart: null,
        leaveEnd: null,
        alternateContact: null,
      },
      {
        id: "emp-6",
        name: "Robert Taylor",
        email: "robert.taylor@company.com",
        phone: "+1 (555) 678-9012",
        department: "Sales",
        position: "Sales Representative",
        status: "out_of_office",
        avatarUrl: null,
        leaveStart: null,
        leaveEnd: null,
        alternateContact: "Anna White",
      },
      {
        id: "emp-7",
        name: "Anna White",
        email: "anna.white@company.com",
        phone: "+1 (555) 789-0123",
        department: "Sales",
        position: "Account Manager",
        status: "on_duty",
        avatarUrl: null,
        leaveStart: null,
        leaveEnd: null,
        alternateContact: null,
      },
      {
        id: "emp-8",
        name: "James Wilson",
        email: "james.wilson@company.com",
        phone: "+1 (555) 890-1234",
        department: "Finance",
        position: "Financial Analyst",
        status: "remote",
        avatarUrl: null,
        leaveStart: null,
        leaveEnd: null,
        alternateContact: null,
      },
      {
        id: "emp-9",
        name: "Michelle Brown",
        email: "michelle.brown@company.com",
        phone: "+1 (555) 901-2345",
        department: "Design",
        position: "UX Designer",
        status: "on_duty",
        avatarUrl: null,
        leaveStart: null,
        leaveEnd: null,
        alternateContact: null,
      },
      {
        id: "emp-10",
        name: "Christopher Martinez",
        email: "chris.martinez@company.com",
        phone: "+1 (555) 012-3456",
        department: "Operations",
        position: "Operations Manager",
        status: "on_leave",
        avatarUrl: null,
        leaveStart: "2024-12-23",
        leaveEnd: "2024-12-30",
        alternateContact: "Jessica Lee",
      },
    ];

    employeesData.forEach((emp) => this.employees.set(emp.id, emp));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Room methods
  async getAllRooms(): Promise<MeetingRoom[]> {
    return Array.from(this.rooms.values());
  }

  async getRoom(id: string): Promise<MeetingRoom | undefined> {
    return this.rooms.get(id);
  }

  async getRoomsWithStatus(): Promise<RoomWithStatus[]> {
    const rooms = await this.getAllRooms();
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeStr = `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;
    const today = now.toISOString().split("T")[0];

    return Promise.all(
      rooms.map(async (room) => {
        const bookings = await this.getBookingsByRoom(room.id);
        const todayBookings = bookings.filter((b) =>
          b.startTime.startsWith(today)
        );

        // Find current booking
        const currentBooking = todayBookings.find((b) => {
          const startTime = b.startTime.split(" ")[1];
          const endTime = b.endTime.split(" ")[1];
          return startTime <= currentTimeStr && endTime > currentTimeStr;
        });

        // Find next available slot
        let nextAvailable: string | undefined;
        if (currentBooking) {
          nextAvailable = currentBooking.endTime.split(" ")[1];
        }

        return {
          ...room,
          isAvailable: !currentBooking,
          currentBooking,
          nextAvailable,
        };
      })
    );
  }

  // Booking methods
  async getAllBookings(): Promise<RoomBooking[]> {
    return Array.from(this.bookings.values());
  }

  async getBookingsByRoom(roomId: string): Promise<RoomBooking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.roomId === roomId
    );
  }

  async createBooking(insertBooking: InsertRoomBooking): Promise<RoomBooking> {
    const id = randomUUID();
    const booking: RoomBooking = { ...insertBooking, id };
    this.bookings.set(id, booking);
    return booking;
  }

  // Employee methods
  async getAllEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    return this.employees.get(id);
  }
}

export const storage = new MemStorage();
