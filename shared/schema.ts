import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const colorStopSchema = z.object({
  color: z.string(),
  position: z.number().min(0).max(100)
});

export type ColorStop = z.infer<typeof colorStopSchema>;

export const gradientSchema = z.object({
  id: z.string().optional(),
  angle: z.number().min(0).max(360),
  colorStops: z.array(colorStopSchema).min(2),
  useAngle: z.boolean().default(false),
  name: z.string().optional()
});

export type Gradient = z.infer<typeof gradientSchema>;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const gradients = pgTable("gradients", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  name: text("name"),
  angle: integer("angle").notNull(),
  colorStops: jsonb("color_stops").notNull(),
  useAngle: boolean("use_angle").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGradientSchema = createInsertSchema(gradients).pick({
  name: true,
  angle: true,
  colorStops: true,
  useAngle: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGradient = z.infer<typeof insertGradientSchema>;
export type GradientDB = typeof gradients.$inferSelect;
