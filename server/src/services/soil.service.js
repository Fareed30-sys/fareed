import { generateGeminiStructuredContent } from './gemini.service.js';
import { generateSoilPrompt } from '../prompts/soil.prompt.js';
import { soilAnalysisResponseSchema } from '../schemas/soil.schema.js';

export const analyzeSoilHealthService = async (userId, inputData, supabase) => {
  const prompt = generateSoilPrompt(inputData);
  const analysis = await generateGeminiStructuredContent(
    prompt,
    soilAnalysisResponseSchema
  );

  const insertPayload = {
    user_id: userId,
    farm_id: inputData.farmId || null,
    soil_data: inputData,
    analysis: analysis,
  };

  const { data, error } = await supabase
    .from('soil_reports')
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error('[DB_INSERT_SOIL_REPORT_ERROR]', error);
    throw new Error(`Failed to save soil health report: ${error.message}`);
  }

  return data;
};

export const getSoilReportsService = async (userId, supabase, { limit = 20, offset = 0 } = {}) => {
  const { data, error, count } = await supabase
    .from('soil_reports')
    .select('*, farms(farm_name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to retrieve soil reports: ${error.message}`);
  }

  return { items: data, total: count };
};

export const getSoilReportByIdService = async (id, userId, supabase) => {
  const { data, error } = await supabase
    .from('soil_reports')
    .select('*, farms(*)')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Soil report not found or access denied: ${error.message}`);
  }

  return data;
};

export const deleteSoilReportService = async (id, userId, supabase) => {
  const { error } = await supabase
    .from('soil_reports')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete soil report: ${error.message}`);
  }

  return true;
};

