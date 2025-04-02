import { z } from "zod";

// Schema for color stops
export const colorStopSchema = z.object({
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, {
    message: "Color must be a valid hex color code (e.g. #FF0000)"
  }),
  position: z.number().min(0).max(1)
});

export type ColorStop = z.infer<typeof colorStopSchema>;

// Schema for gradients
export const gradientSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  angle: z.number().min(0).max(360).default(90),
  useAngle: z.boolean().default(true),
  colorStops: z.array(colorStopSchema).min(2).max(5)
});

export type Gradient = z.infer<typeof gradientSchema>;