import { type TimeEntry, type InsertTimeEntry, type ConfirmedWeek, type InsertConfirmedWeek, type HourlyRate, type InsertHourlyRate, timeEntries, confirmedWeeks, hourlyRates } from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, and, gte, lt } from "drizzle-orm";

export interface IStorage {
  // Time entries
  getTimeEntry(id: string): Promise<TimeEntry | undefined>;
  getTimeEntriesByDate(date: string): Promise<TimeEntry[]>;
  getTimeEntriesForWeek(weekStart: string): Promise<TimeEntry[]>;
  createTimeEntry(entry: InsertTimeEntry): Promise<TimeEntry>;
  updateTimeEntry(id: string, entry: Partial<InsertTimeEntry>): Promise<TimeEntry | undefined>;
  deleteTimeEntry(id: string): Promise<void>;
  
  // Confirmed weeks
  getConfirmedWeek(weekStart: string): Promise<ConfirmedWeek | undefined>;
  getAllConfirmedWeeks(): Promise<ConfirmedWeek[]>;
  confirmWeek(weekStart: string): Promise<ConfirmedWeek>;
  unconfirmWeek(weekStart: string): Promise<void>;
  
  // Hourly rate
  getHourlyRate(): Promise<HourlyRate | null>;
  setHourlyRate(rate: string): Promise<HourlyRate>;
}

export class DatabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;

  constructor(databaseUrl: string) {
    this.db = drizzle({ connection: { connectionString: databaseUrl } });
  }

  // Time entries
  async getTimeEntry(id: string): Promise<TimeEntry | undefined> {
    const result = await this.db.select().from(timeEntries).where(eq(timeEntries.id, id));
    return result[0];
  }

  async getTimeEntriesByDate(date: string): Promise<TimeEntry[]> {
    return this.db.select().from(timeEntries).where(eq(timeEntries.date, date));
  }

  async getTimeEntriesForWeek(weekStart: string): Promise<TimeEntry[]> {
    const startDate = new Date(weekStart);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7);
    const endDateStr = endDate.toISOString().split('T')[0];
    
    return this.db.select().from(timeEntries)
      .where(
        and(
          gte(timeEntries.date, weekStart),
          lt(timeEntries.date, endDateStr)
        )
      );
  }

  async createTimeEntry(entry: InsertTimeEntry): Promise<TimeEntry> {
    const result = await this.db.insert(timeEntries).values(entry).returning();
    return result[0];
  }

  async updateTimeEntry(id: string, entry: Partial<InsertTimeEntry>): Promise<TimeEntry | undefined> {
    const result = await this.db.update(timeEntries).set(entry).where(eq(timeEntries.id, id)).returning();
    return result[0];
  }

  async deleteTimeEntry(id: string): Promise<void> {
    await this.db.delete(timeEntries).where(eq(timeEntries.id, id));
  }

  // Confirmed weeks
  async getConfirmedWeek(weekStart: string): Promise<ConfirmedWeek | undefined> {
    const result = await this.db.select().from(confirmedWeeks).where(eq(confirmedWeeks.weekStart, weekStart));
    return result[0];
  }

  async getAllConfirmedWeeks(): Promise<ConfirmedWeek[]> {
    return this.db.select().from(confirmedWeeks);
  }

  async confirmWeek(weekStart: string): Promise<ConfirmedWeek> {
    const result = await this.db.insert(confirmedWeeks).values({ weekStart }).returning();
    return result[0];
  }

  async unconfirmWeek(weekStart: string): Promise<void> {
    await this.db.delete(confirmedWeeks).where(eq(confirmedWeeks.weekStart, weekStart));
  }

  // Hourly rate
  async getHourlyRate(): Promise<HourlyRate | null> {
    const result = await this.db.select().from(hourlyRates).limit(1);
    return result[0] || null;
  }

  async setHourlyRate(rate: string): Promise<HourlyRate> {
    const existing = await this.getHourlyRate();
    if (existing) {
      const result = await this.db.update(hourlyRates).set({ rate }).where(eq(hourlyRates.id, existing.id)).returning();
      return result[0];
    }
    const result = await this.db.insert(hourlyRates).values({ rate }).returning();
    return result[0];
  }
}

let storage: IStorage;

export function initializeStorage(databaseUrl: string): IStorage {
  storage = new DatabaseStorage(databaseUrl);
  return storage;
}

export function getStorage(): IStorage {
  if (!storage) {
    throw new Error("Storage not initialized. Call initializeStorage first.");
  }
  return storage;
}
