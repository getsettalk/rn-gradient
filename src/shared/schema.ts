import { z } from 'zod';

// Schema for a color stop in a gradient
export const colorStopSchema = z.object({
  color: z.string(),  // Hex color code
  location: z.number().min(0).max(1),  // Position in the gradient (0 to 1)
  opacity: z.number().min(0).max(1)    // Opacity of the color stop (0 to 1)
});

// Schema for a linear gradient
export const gradientSchema = z.object({
  id: z.string().optional(),  // Unique identifier for the gradient
  name: z.string().optional(), // Optional name for the gradient
  colorStops: z.array(colorStopSchema).min(2),  // At least 2 color stops
  angle: z.number().min(0).max(360).default(90),  // Angle of the gradient in degrees
  useAngle: z.boolean().default(true)  // Whether to use the angle or not
});

// TypeScript types from schemas
export type ColorStop = z.infer<typeof colorStopSchema>;
export type Gradient = z.infer<typeof gradientSchema>;