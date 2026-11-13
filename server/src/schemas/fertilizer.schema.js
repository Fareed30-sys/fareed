import { z } from 'zod';

export const fertilizerAdvisorySchema = z.object({
  farmId: z.string().uuid().optional().nullable(),
  crop: z.string().min(1, 'Crop name is required').max(100),
  cropVariety: z.string().max(100).optional().nullable(),
  growthStage: z.enum([
    'Basal / Land Preparation',
    'Sowing / Germination',
    'Vegetative',
    'Tillering / Branching',
    'Flowering',
    'Fruit / Grain Formation',
    'Maturation / Pre-Harvest',
    'Other',
  ]),
  landArea: z.number().positive('Land area must be greater than 0'),
  landUnit: z.enum(['acre', 'hectare', 'sqm']).default('acre'),
  soilTestData: z.string().max(500).optional().nullable(),
  existingFertilizerUsage: z.string().max(300).optional().nullable(),
  farmingMethod: z.enum(['Conventional', 'Organic', 'Integrated (INM)']).default('Integrated (INM)'),
  language: z.enum(['en', 'kn', 'hi', 'te', 'ta', 'ur', 'ml']).default('en'),
});

export const fertilizerResponseSchema = z.object({
  cropName: z.string(),
  growthStage: z.string(),
  nutrientAssessment: z.array(z.string()).default([]),
  recommendations: z.array(
    z.object({
      fertilizerCategory: z.string(),
      purpose: z.string(),
      applicationTiming: z.string(),
      applicationMethod: z.string(),
      quantity: z.union([z.number(), z.string()]).nullable().default(null),
      quantityUnit: z.string().nullable().default(null),
      reason: z.string(),
    })
  ).min(1, 'At least one fertilizer recommendation is required'),
  safetyPrecautions: z.array(z.string()).default([]),
  dataLimitations: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
});

