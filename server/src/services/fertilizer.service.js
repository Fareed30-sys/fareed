import { generateGeminiStructuredContent } from './gemini.service.js';
import { generateFertilizerPrompt } from '../prompts/fertilizer.prompt.js';
import { fertilizerResponseSchema } from '../schemas/fertilizer.schema.js';

export const recommendFertilizerService = async (userId, inputData, supabase) => {
  const prompt = generateFertilizerPrompt(inputData);
  const advisory = await generateGeminiStructuredContent(
    prompt,
    fertilizerResponseSchema
  );

  const insertPayload = {
    user_id: userId,
    farm_id: inputData.farmId || null,
    crop_name: inputData.crop,
    input_data: inputData,
    advisory: advisory,
  };

  const { data, error } = await supabase
    .from('fertilizer_advisories')
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error('[DB_INSERT_FERT_ADVISORY_ERROR]', error);
    throw new Error(`Failed to save fertilizer advisory: ${error.message}`);
  }

  return data;
};

export const getFertilizerAdvisoriesService = async (userId, supabase, { limit = 20, offset = 0 } = {}) => {
  const { data, error, count } = await supabase
    .from('fertilizer_advisories')
    .select('*, farms(farm_name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to retrieve fertilizer advisories: ${error.message}`);
  }

  return { items: data, total: count };
};

export const getFertilizerAdvisoryByIdService = async (id, userId, supabase) => {
  const { data, error } = await supabase
    .from('fertilizer_advisories')
    .select('*, farms(*)')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Fertilizer advisory not found or access denied: ${error.message}`);
  }

  return data;
};

export const deleteFertilizerAdvisoryService = async (id, userId, supabase) => {
  const { error } = await supabase
    .from('fertilizer_advisories')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete fertilizer advisory: ${error.message}`);
  }

  return true;
};

