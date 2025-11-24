import type { Express } from "express";
import { createServer, type Server } from "http";
import { getStorage } from "./storage";
import { insertTimeEntrySchema, insertConfirmedWeekSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const storage = getStorage();

  // Time entries endpoints
  app.get("/api/time-entries/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const entries = await storage.getTimeEntriesByDate(date);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch time entries" });
    }
  });

  app.get("/api/time-entries-week/:weekStart", async (req, res) => {
    try {
      const { weekStart } = req.params;
      const entries = await storage.getTimeEntriesForWeek(weekStart);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch weekly entries" });
    }
  });

  app.post("/api/time-entries", async (req, res) => {
    try {
      const validated = insertTimeEntrySchema.parse(req.body);
      const entry = await storage.createTimeEntry(validated);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create time entry" });
      }
    }
  });

  app.patch("/api/time-entries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertTimeEntrySchema.partial().parse(req.body);
      const entry = await storage.updateTimeEntry(id, updates);
      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to update time entry" });
      }
    }
  });

  app.delete("/api/time-entries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteTimeEntry(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete time entry" });
    }
  });

  // Confirmed weeks endpoints
  app.get("/api/confirmed-weeks", async (req, res) => {
    try {
      const weeks = await storage.getAllConfirmedWeeks();
      res.json(weeks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch confirmed weeks" });
    }
  });

  app.post("/api/confirmed-weeks", async (req, res) => {
    try {
      const validated = insertConfirmedWeekSchema.parse(req.body);
      const week = await storage.confirmWeek(validated.weekStart);
      res.status(201).json(week);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Failed to confirm week" });
      }
    }
  });

  app.delete("/api/confirmed-weeks/:weekStart", async (req, res) => {
    try {
      const { weekStart } = req.params;
      await storage.unconfirmWeek(weekStart);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to unconfirm week" });
    }
  });

  // Hourly rate endpoints
  app.get("/api/hourly-rate", async (req, res) => {
    try {
      const rate = await storage.getHourlyRate();
      res.json(rate || { rate: "35" });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hourly rate" });
    }
  });

  app.post("/api/hourly-rate", async (req, res) => {
    try {
      const { rate } = req.body;
      if (!rate) {
        res.status(400).json({ error: "Rate is required" });
        return;
      }
      const updated = await storage.setHourlyRate(String(rate));
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update hourly rate" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
