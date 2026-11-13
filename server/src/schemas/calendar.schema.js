import { z } from 'zod';

export const cultivationCalendarSchema = z.object({
  farmId: z.string().uuid().optional().nullable(),
  crop: z.string().min(1, 'Crop name is required').max(100),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date must be in YYYY-MM-DD format'),
  state: z.string().max(100).optional().nullable(),
  district: z.string().max(100).optional().nullable(),
  farmingType: z.string().max(100).optional().nullable(),
  language: z.enum(['en', 'kn', 'hi', 'te', 'ta', 'ur', 'ml']).default('en'),
});

export const calendarActivitySchema = z.object({
  stage: z.string(),
  dayFromStart: z.number().int().nonnegative(),
  dayToStart: z.number().int().positive(),
  description: z.string(),
  importance: z.enum(['high', 'medium', 'low']).default('medium'),
  completed: z.boolean().default(false),
});

export const cultivationCalendarResponseSchema = z.object({
  cropName: z.string(),
  estimatedDurationDays: z.number().positive(),
  activities: z.array(calendarActivitySchema).min(1),
  importantWarnings: z.array(z.string()).default([]),
  dataLimitations: z.array(z.string()).default([]),
});

export const updateCalendarSchema = z.object({
  activities: z.array(calendarActivitySchema),
});

