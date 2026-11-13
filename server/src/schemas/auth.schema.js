import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  preferredLanguage: z.enum(['en', 'kn', 'hi', 'te', 'ta', 'ur', 'ml']).default('en'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const profileSchema = z.object({
  fullName: z.string().min(2).max(100),
  phone: z.string().max(20).optional().nullable(),
  country: z.string().default('India'),
  state: z.string().max(100).optional().nullable(),
  district: z.string().max(100).optional().nullable(),
  village: z.string().max(100).optional().nullable(),
  preferredLanguage: z.enum(['en', 'kn', 'hi', 'te', 'ta', 'ur', 'ml']).default('en'),
  farmingExperience: z.number().int().nonnegative().optional().default(0),
  landArea: z.number().nonnegative().optional().nullable(),
  landUnit: z.enum(['acre', 'hectare', 'sqm']).default('acre'),
  farmingType: z.string().max(100).optional().nullable(),
  irrigationAvailable: z.boolean().default(false),
});

