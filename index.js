// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  gradients;
  currentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.gradients = /* @__PURE__ */ new Map();
    this.currentId = 1;
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async saveGradient(gradient) {
    if (!gradient.id) {
      throw new Error("Gradient must have an ID");
    }
    this.gradients.set(gradient.id, gradient);
    return gradient;
  }
  async getGradient(id) {
    return this.gradients.get(id);
  }
  async getAllGradients() {
    return Array.from(this.gradients.values());
  }
  async deleteGradient(id) {
    return this.gradients.delete(id);
  }
  async deleteAllGradients() {
    this.gradients.clear();
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var colorStopSchema = z.object({
  color: z.string(),
  position: z.number().min(0).max(100)
});
var gradientSchema = z.object({
  id: z.string().optional(),
  angle: z.number().min(0).max(360),
  colorStops: z.array(colorStopSchema).min(2),
  useAngle: z.boolean().default(false),
  name: z.string().optional()
});
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var gradients = pgTable("gradients", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name"),
  angle: integer("angle").notNull(),
  colorStops: jsonb("color_stops").notNull(),
  useAngle: boolean("use_angle").default(false)
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertGradientSchema = createInsertSchema(gradients).pick({
  name: true,
  angle: true,
  colorStops: true,
  useAngle: true
});

// server/routes.ts
import { nanoid } from "nanoid";
async function registerRoutes(app2) {
  app2.get("/api/gradients", async (req, res) => {
    try {
      const gradients2 = await storage.getAllGradients();
      res.json(gradients2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch gradients" });
    }
  });
  app2.post("/api/gradients", async (req, res) => {
    try {
      const gradientData = req.body;
      const result = gradientSchema.safeParse(gradientData);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid gradient data", errors: result.error.errors });
      }
      const gradient = {
        ...result.data,
        id: result.data.id || nanoid()
      };
      const savedGradient = await storage.saveGradient(gradient);
      res.status(201).json(savedGradient);
    } catch (error) {
      res.status(500).json({ message: "Failed to save gradient" });
    }
  });
  app2.delete("/api/gradients/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteGradient(id);
      if (deleted) {
        res.status(200).json({ message: "Gradient deleted successfully" });
      } else {
        res.status(404).json({ message: "Gradient not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete gradient" });
    }
  });
  app2.delete("/api/gradients", async (req, res) => {
    try {
      await storage.deleteAllGradients();
      res.status(200).json({ message: "All gradients deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete gradients" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid as nanoid2 } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid2()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
