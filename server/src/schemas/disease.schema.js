import { z } from 'zod';

export const diseaseDetectionSchema = z.object({
  farmId: z.string().uuid().optional().nullable(),
  crop: z.string().min(1, 'Crop name is required').max(100),
  affectedPart: z.enum(['Leaves', 'Stem', 'Roots', 'Fruits / Pods', 'Flowers', 'Whole Plant', 'Other']),
  symptoms: z.string().min(5, 'Symptoms description must be at least 5 characters').max(1000),
  duration: z.string().min(1, 'Duration of problem is required').max(100),
  visibleDamage: z.string().max(500).optional().nullable(),
  language: z.enum(['en', 'kn', 'hi', 'te', 'ta', 'ur', 'ml']).default('en'),
});

export const diseaseResponseSchema = z.object({
  cropName: z.string(),
  possibleConditions: z.array(
    z.object({
      name: z.string(),
      confidenceLevel: z.enum(['high', 'medium', 'low']),
      supportingSymptoms: z.array(z.string()).default([]),
      alternativeCauses: z.array(z.string()).default([]),
      recommendedInspection: z.array(z.string()).default([]),
    })
  ).min(1, 'At least one possible condition must be analyzed'),
  preventiveMeasures: z.array(z.string()).default([]),
  integratedPestManagement: z.array(z.string()).default([]),
  treatmentGuidance: z.array(z.string()).default([]),
  safetyWarnings: z.array(z.string()).default([]),
  expertConsultationRequired: z.boolean().default(true),
});

