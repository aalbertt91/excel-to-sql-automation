import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.projects.list.path, async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get(api.projects.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const project = await storage.getProject(id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  });

  app.post(api.projects.create.path, async (req, res) => {
    try {
      const projectData = api.projects.create.input.parse(req.body);
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
      throw e;
    }
  });

  app.put(api.projects.update.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    try {
      const projectData = api.projects.update.input.parse(req.body);
      const project = await storage.updateProject(id, projectData);
      if (!project) return res.status(404).json({ message: "Project not found" });
      res.json(project);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ message: e.errors[0].message });
      }
      throw e;
    }
  });

  app.delete(api.projects.delete.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    await storage.deleteProject(id);
    res.status(204).send();
  });

  // Seed data
  const projects = await storage.getProjects();
  if (projects.length === 0) {
    console.log("Seeding database...");
    await storage.createProject({
      name: "Daily Report Bot",
      description: "Automates the generation and emailing of daily KPI reports.",
      status: "completed",
      type: "bot",
      technologies: ["Python", "SMTP", "Pandas"],
      isFavorite: true
    });
    await storage.createProject({
      name: "Competitor Price Scraper",
      description: "Scrapes competitor websites for pricing data every 6 hours.",
      status: "in_progress",
      type: "web_scraper",
      technologies: ["Puppeteer", "Node.js", "PostgreSQL"],
      isFavorite: true
    });
    await storage.createProject({
      name: "Invoice Processing Workflow",
      description: "OCR pipeline to extract data from PDF invoices.",
      status: "idea",
      type: "workflow",
      technologies: ["Tesseract", "Python"],
      isFavorite: false
    });
    console.log("Seeding complete!");
  }

  return httpServer;
}
