import { z } from 'zod';

export const irrigationAdvisorySchema = z.object({
  farmId: z.string().uuid().optional().nullable(),
  crop: z.string().min(1, 'Crop name is required').max(100),
  growthStage: z.string().min(1, 'Growth stage is required').max(100),
  soilType: z.string().min(1, 'Soil type is required').max(100),
  landArea: z.number().positive().default(1),
  landUnit: z.enum(['acre', 'hectare', 'sqm']).default('acre'),
  irrigationMethod: z.enum(['Drip', 'Sprinkler', 'Flood / Furrow', 'Rainfed / Manual', 'Other']).default('Drip'),
  waterAvailability: z.enum(['Abundant', 'Moderate', 'Scarce', 'Critical']).default('Moderate'),
  lastRainfall: z.string().max(100).optional().nullable(),
  temperature: z.number().optional().nullable(),
  humidity: z.number().min(0).max(100).optional().nullable(),
  language: z.enum(['en', 'kn', 'hi', 'te', 'ta', 'ur', 'ml']).default('en'),
});

export const irrigationResponseSchema = z.object({
  cropName: z.string(),
  growthStage: z.string(),
  waterRequirement: z.string(),
  irrigationRecommendations: z.array(
    z.object({
      timing: z.string(),
      method: z.string(),
      reason: z.string(),
    })
  ).min(1),
  waterConservationMethods: z.array(z.string()).default([]),
  waterStressIndicators: z.array(z.string()).default([]),
  drainageAdvice: z.array(z.string()).default([]),
  dataLimitations: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
});

