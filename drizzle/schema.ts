import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with role field for admin/staff access control.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(),
  username: varchar("username", { length: 100 }).unique(),
  password: varchar("password", { length: 255 }),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Income entries table for tracking staff income and OTP transactions
 */
export const incomeEntries = mysqlTable("income_entries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  userName: varchar("userName", { length: 255 }).notNull(),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD format
  time: varchar("time", { length: 8 }).notNull(), // HH:MM:SS format
  type: mysqlEnum("type", [
    "Income Add",
    "Income Minus",
    "Income Payment",
    "OTP Add",
    "OTP Minus",
    "OTP Payment"
  ]).notNull(),
  amount: int("amount").notNull(),
  description: text("description").notNull(),
  recipient: varchar("recipient", { length: 255 }),
  receivedFrom: varchar("receivedFrom", { length: 255 }), // Who gave the money
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type IncomeEntry = typeof incomeEntries.$inferSelect;
export type InsertIncomeEntry = typeof incomeEntries.$inferInsert;

/**
 * Ticket entries table for flight ticket management
 */
export const ticketEntries = mysqlTable("ticket_entries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  userName: varchar("userName", { length: 255 }).notNull(),
  issueDate: varchar("issueDate", { length: 10 }).notNull(), // YYYY-MM-DD format
  passengerName: varchar("passengerName", { length: 255 }).notNull(),
  pnr: varchar("pnr", { length: 50 }).notNull(),
  tripType: mysqlEnum("tripType", ["1 Way", "Return"]).notNull(),
  flightName: varchar("flightName", { length: 255 }).notNull(),
  from: varchar("from", { length: 255 }).notNull(),
  to: varchar("to", { length: 255 }).notNull(),
  departureDate: varchar("departureDate", { length: 10 }).notNull(),
  arrivalDate: varchar("arrivalDate", { length: 10 }).notNull(),
  returnDate: varchar("returnDate", { length: 10 }),
  fromIssuer: varchar("fromIssuer", { length: 255 }).notNull(),
  source: varchar("source", { length: 255 }), // Agency or source where ticket was purchased
  bdNumber: varchar("bdNumber", { length: 50 }),
  qrNumber: varchar("qrNumber", { length: 50 }),
  ticketCopyUrl: text("ticketCopyUrl"),
  ticketCopyFileName: varchar("ticketCopyFileName", { length: 255 }),
  status: mysqlEnum("status", ["Pending", "Confirmed", "Cancelled"]).default("Pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TicketEntry = typeof ticketEntries.$inferSelect;
export type InsertTicketEntry = typeof ticketEntries.$inferInsert;

/**
 * Sessions table for custom authentication
 */
export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: int("userId").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;
