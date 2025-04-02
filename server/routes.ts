import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { gradientSchema, Gradient } from "@shared/schema";
import { nanoid } from "nanoid";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for gradients
  app.get('/api/gradients', async (req, res) => {
    try {
      const gradients = await storage.getAllGradients();
      res.json(gradients);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch gradients' });
    }
  });

  app.post('/api/gradients', async (req, res) => {
    try {
      const gradientData = req.body;
      
      // Validate the request body
      const result = gradientSchema.safeParse(gradientData);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid gradient data', errors: result.error.errors });
      }
      
      // Add an ID if not provided
      const gradient: Gradient = {
        ...result.data,
        id: result.data.id || nanoid()
      };
      
      const savedGradient = await storage.saveGradient(gradient);
      res.status(201).json(savedGradient);
    } catch (error) {
      res.status(500).json({ message: 'Failed to save gradient' });
    }
  });

  app.delete('/api/gradients/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteGradient(id);
      
      if (deleted) {
        res.status(200).json({ message: 'Gradient deleted successfully' });
      } else {
        res.status(404).json({ message: 'Gradient not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete gradient' });
    }
  });

  app.delete('/api/gradients', async (req, res) => {
    try {
      await storage.deleteAllGradients();
      res.status(200).json({ message: 'All gradients deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete gradients' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
