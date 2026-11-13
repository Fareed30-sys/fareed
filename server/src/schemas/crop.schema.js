import { z } from 'zod';

export const cropRecommendationSchema = z.object({
  farmId: z.string().uuid().optional().nullable(),
  state: z.string().min(1, 'State is required').max(100),
  district: z.string().min(1, 'District is required').max(100),
  soilType: z.string().min(1, 'Soil type is required').max(100),
  season: z.enum(['Kharif', 'Rabi', 'Zaid', 'Whole Year', 'Other']),
  landArea: z.number().positive('Land area must be greater than 0'),
  landUnit: z.enum(['acre', 'hectare', 'sqm']).default('acre'),
  irrigationAvailable: z.boolean(),
  soilPH: z.number().min(0).max(14).optional().nullable(),
  nitrogen: z.number().nonnegative().optional().nullable(),
  phosphorus: z.number().nonnegative().optional().nullable(),
  potassium: z.number().nonnegative().optional().nullable(),
  organicCarbon: z.number().nonnegative().optional().nullable(),
  temperature: z.number().optional().nullable(),
  humidity: z.number().min(0).max(100).optional().nullable(),
  rainfall: z.number().nonnegative().optional().nullable(),
  preferredCategory: z.string().max(100).optional().nullable(),
  previousCrop: z.string().max(100).optional().nullable(),
  language: z.enum(['en', 'kn', 'hi', 'te', 'ta', 'ur', 'ml']).default('en'),
});

export const cropRecommendationResponseSchema = z.object({
  summary: z.string(),
  dataLimitations: z.array(z.string()).default([]),
  recommendations: z.array(
    z.object({
      cropName: z.string(),
      suitabilityScore: z.number().min(0).max(100),
      suitabilityLevel: z.enum(['high', 'moderate', 'low', 'unsuitable']),
      reason: z.string(),
      soilCompatibility: z.string(),
      climateCompatibility: z.string(),
      waterRequirement: z.string(),
      estimatedDurationDays: z.number().positive(),
      sowingPeriod: z.string(),
      risks: z.array(z.string()).default([]),
      nextSteps: z.array(z.string()).default([]),
    })
  ).min(1, 'At least one crop recommendation is required'),
  warnings: z.array(z.string()).default([]),
  expertConsultationRequired: z.boolean().default(false),
});

