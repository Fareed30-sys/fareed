import { z } from 'zod';

export const createFarmSchema = z.object({
  farmName: z.string().min(1, 'Farm name is required').max(100),
  location: z.string().max(200).optional().nullable(),
  state: z.string().max(100).optional().nullable(),
  district: z.string().max(100).optional().nullable(),
  soilType: z.string().max(50).optional().nullable(),
  soilPH: z.number().min(0).max(14).optional().nullable(),
  landArea: z.number().positive('Land area must be greater than zero'),
  landUnit: z.enum(['acre', 'hectare', 'sqm']).default('acre'),
  irrigationMethod: z.string().max(100).optional().nullable(),
});

export const updateFarmSchema = createFarmSchema.partial();

