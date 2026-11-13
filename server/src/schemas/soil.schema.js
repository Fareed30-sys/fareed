import { z } from 'zod';

export const soilAnalysisSchema = z.object({
  farmId: z.string().uuid().optional().nullable(),
  soilType: z.string().min(1, 'Soil type is required').max(100),
  soilPH: z.number().min(0).max(14).optional().nullable(),
  nitrogen: z.number().nonnegative().optional().nullable(),
  phosphorus: z.number().nonnegative().optional().nullable(),
  potassium: z.number().nonnegative().optional().nullable(),
  organicCarbon: z.number().nonnegative().optional().nullable(),
  electricalConductivity: z.number().nonnegative().optional().nullable(),
  micronutrients: z.string().max(300).optional().nullable(),
  additionalObservations: z.string().max(500).optional().nullable(),
  language: z.enum(['en', 'kn', 'hi', 'te', 'ta', 'ur', 'ml']).default('en'),
});

export const soilAnalysisResponseSchema = z.object({
  overallAssessment: z.string(),
  soilPHStatus: z.enum(['strongly_acidic', 'acidic', 'neutral', 'alkaline', 'strongly_alkaline', 'unknown']),
  nutrientAssessment: z.object({
    nitrogen: z.string().default('unknown'),
    phosphorus: z.string().default('unknown'),
    potassium: z.string().default('unknown'),
    organicCarbon: z.string().default('unknown'),
  }),
  potentialDeficiencies: z.array(z.string()).default([]),
  potentialExcesses: z.array(z.string()).default([]),
  suitableCrops: z.array(z.string()).default([]),
  improvementPractices: z.array(z.string()).default([]),
  additionalTestingRequired: z.array(z.string()).default([]),
  warnings: z.array(z.string()).default([]),
});

