import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  status: text("status", { enum: ['idea', 'in_progress', 'completed', 'paused'] }).notNull().default('idea'),
  type: text("type", { enum: ['web_scraper', 'bot', 'workflow', 'script', 'other'] }).notNull().default('other'),
  technologies: text("technologies").array().default([]),
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true });

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
