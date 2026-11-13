import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || '';
export const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

if (!apiKey && process.env.NODE_ENV !== 'test') {
  console.warn('[WARN] GEMINI_API_KEY is not set. Ensure .env is properly configured.');
}

/**
 * Official Google Gemini Client via @google/genai SDK
 */
export const aiClient = new GoogleGenAI({
  apiKey: apiKey,
});

export const getModelName = () => {
  return process.env.GEMINI_MODEL || DEFAULT_MODEL;
};

