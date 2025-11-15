import { eq, desc, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, incomeEntries, InsertIncomeEntry, IncomeEntry, ticketEntries, InsertTicketEntry, TicketEntry } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserLastSignIn(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, id));
}

export async function updateUserPassword(id: number, newPassword: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set({ password: newPassword }).where(eq(users.id, id));
}

// Income Entry helpers
export async function createIncomeEntry(entry: InsertIncomeEntry): Promise<IncomeEntry> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(incomeEntries).values(entry);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(incomeEntries).where(eq(incomeEntries.id, insertedId)).limit(1);
  return inserted[0];
}

export async function getIncomeEntries(userId?: number, startDate?: string, endDate?: string): Promise<IncomeEntry[]> {
  const db = await getDb();
  if (!db) return [];

  let conditions = [];
  if (userId) {
    conditions.push(eq(incomeEntries.userId, userId));
  }
  if (startDate) {
    conditions.push(gte(incomeEntries.date, startDate));
  }
  if (endDate) {
    conditions.push(lte(incomeEntries.date, endDate));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  return await db.select().from(incomeEntries)
    .where(whereClause)
    .orderBy(desc(incomeEntries.date), desc(incomeEntries.time));
}

export async function updateIncomeEntry(id: number, updates: Partial<InsertIncomeEntry>): Promise<IncomeEntry | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(incomeEntries).set(updates).where(eq(incomeEntries.id, id));
  
  const updated = await db.select().from(incomeEntries).where(eq(incomeEntries.id, id)).limit(1);
  return updated[0];
}

export async function deleteIncomeEntry(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(incomeEntries).where(eq(incomeEntries.id, id));
}

// Ticket Entry helpers
export async function createTicketEntry(entry: InsertTicketEntry): Promise<TicketEntry> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(ticketEntries).values(entry);
  const insertedId = Number(result[0].insertId);
  
  const inserted = await db.select().from(ticketEntries).where(eq(ticketEntries.id, insertedId)).limit(1);
  return inserted[0];
}

export async function getTicketEntries(userId?: number, startDate?: string, endDate?: string): Promise<TicketEntry[]> {
  const db = await getDb();
  if (!db) return [];

  let conditions = [];
  if (userId) {
    conditions.push(eq(ticketEntries.userId, userId));
  }
  if (startDate) {
    conditions.push(gte(ticketEntries.issueDate, startDate));
  }
  if (endDate) {
    conditions.push(lte(ticketEntries.issueDate, endDate));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  
  return await db.select().from(ticketEntries)
    .where(whereClause)
    .orderBy(desc(ticketEntries.issueDate));
}

export async function updateTicketEntry(id: number, updates: Partial<InsertTicketEntry>): Promise<TicketEntry | undefined> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(ticketEntries).set(updates).where(eq(ticketEntries.id, id));
  
  const updated = await db.select().from(ticketEntries).where(eq(ticketEntries.id, id)).limit(1);
  return updated[0];
}

export async function deleteTicketEntry(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(ticketEntries).where(eq(ticketEntries.id, id));
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(users).orderBy(users.name);
}
