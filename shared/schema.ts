import { sql } from "drizzle-orm";
import { pgTable, text, varchar, date as pgDate, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const timeEntries = pgTable("time_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: pgDate("date").notNull(),
  startTime: text("start_time"),
  endTime: text("end_time"),
  skipped: boolean("skipped").default(false),
});

export const insertTimeEntrySchema = createInsertSchema(timeEntries).omit({
  id: true,
});

export type InsertTimeEntry = z.infer<typeof insertTimeEntrySchema>;
export type TimeEntry = typeof timeEntries.$inferSelect;

export const confirmedWeeks = pgTable("confirmed_weeks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  weekStart: pgDate("week_start").notNull().unique(),
});

export const insertConfirmedWeekSchema = createInsertSchema(confirmedWeeks).omit({
  id: true,
});

export type InsertConfirmedWeek = z.infer<typeof insertConfirmedWeekSchema>;
export type ConfirmedWeek = typeof confirmedWeeks.$inferSelect;

export const hourlyRates = pgTable("hourly_rates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  rate: text("rate").notNull().default("35"),
});

export const insertHourlyRateSchema = createInsertSchema(hourlyRates).omit({
  id: true,
});

export type InsertHourlyRate = z.infer<typeof insertHourlyRateSchema>;
export type HourlyRate = typeof hourlyRates.$inferSelect;
