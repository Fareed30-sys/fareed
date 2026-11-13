import { aiClient, getModelName } from '../config/gemini.js';
import { AGROAI_SYSTEM_PROMPT } from '../prompts/system.prompt.js';

/**
 * Strips code fences and parses structured JSON string from Gemini output
 * @param {string} rawText 
 * @returns {object}
 */
const parseCleanJson = (rawText) => {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Empty response received from Gemini model.');
  }

  // Remove markdown code fences if returned by model
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[GEMINI_JSON_PARSE_ERROR]', err.message, 'Raw Text:', rawText);
    throw new Error(`Failed to parse AI response into structured JSON: ${err.message}`);
  }
};

/**
 * Universal Gemini generation helper with system instructions and JSON response schema
 *
 * @param {string|Array} promptOrContents 
 * @param {import('zod').ZodSchema} responseSchema 
 * @param {object} options 
 * @returns {Promise<object>}
 */
export const generateGeminiStructuredContent = async (
  promptOrContents,
  responseSchema,
  options = {}
) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your-google-gemini-api-key') {
    throw new Error(
      'Google Gemini API key is missing or not configured. Please set GEMINI_API_KEY in server/.env file.'
    );
  }

  const model = options.model || getModelName();

  let contents;
  if (typeof promptOrContents === 'string') {
    contents = [promptOrContents];
  } else if (Array.isArray(promptOrContents)) {
    contents = promptOrContents;
  } else {
    contents = [promptOrContents];
  }

  try {
    const response = await aiClient.models.generateContent({
      model: model,
      contents: contents,
      config: {
        systemInstruction: AGROAI_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        temperature: options.temperature ?? 0.3,
        maxOutputTokens: options.maxTokens ?? 3000,
      },
    });

    const responseText = response.text ? response.text.trim() : '';
    const parsedData = parseCleanJson(responseText);

    // Validate using Zod schema
    const validationResult = responseSchema.safeParse(parsedData);
    if (!validationResult.success) {
      console.error('[AI_RESPONSE_SCHEMA_VALIDATION_ERROR]', validationResult.error.errors);
      throw new Error(
        `AI generated output failed validation: ${validationResult.error.errors
          .map((e) => `${e.path.join('.')}: ${e.message}`)
          .join(', ')}`
      );
    }

    return validationResult.data;
  } catch (err) {
    console.error('[GEMINI_SERVICE_ERROR]', err.message);
    throw err;
  }
};

