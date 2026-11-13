import { generateGeminiStructuredContent } from './gemini.service.js';
import { generateIrrigationPrompt } from '../prompts/irrigation.prompt.js';
import { irrigationResponseSchema } from '../schemas/irrigation.schema.js';

export const recommendIrrigationService = async (userId, inputData, supabase) => {
  const prompt = generateIrrigationPrompt(inputData);
  const advisory = await generateGeminiStructuredContent(
    prompt,
    irrigationResponseSchema
  );

  const insertPayload = {
    user_id: userId,
    farm_id: inputData.farmId || null,
    crop_name: inputData.crop,
    input_data: inputData,
    advisory: advisory,
  };

  const { data, error } = await supabase
    .from('irrigation_advisories')
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error('[DB_INSERT_IRRIG_ADVISORY_ERROR]', error);
    throw new Error(`Failed to save irrigation advisory: ${error.message}`);
  }

  return data;
};

export const getIrrigationAdvisoriesService = async (userId, supabase, { limit = 20, offset = 0 } = {}) => {
  const { data, error, count } = await supabase
    .from('irrigation_advisories')
    .select('*, farms(farm_name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to retrieve irrigation advisories: ${error.message}`);
  }

  return { items: data, total: count };
};

export const getIrrigationAdvisoryByIdService = async (id, userId, supabase) => {
  const { data, error } = await supabase
    .from('irrigation_advisories')
    .select('*, farms(*)')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Irrigation advisory not found or access denied: ${error.message}`);
  }

  return data;
};

export const deleteIrrigationAdvisoryService = async (id, userId, supabase) => {
  const { error } = await supabase
    .from('irrigation_advisories')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete irrigation advisory: ${error.message}`);
  }

  return true;
};

