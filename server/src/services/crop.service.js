import { generateGeminiStructuredContent } from './gemini.service.js';
import { generateCropPrompt } from '../prompts/crop.prompt.js';
import { cropRecommendationResponseSchema } from '../schemas/crop.schema.js';
import { getModelName } from '../config/gemini.js';

export const generateCropRecommendationService = async (userId, inputData, supabase) => {
  const prompt = generateCropPrompt(inputData);
  const recommendations = await generateGeminiStructuredContent(
    prompt,
    cropRecommendationResponseSchema
  );

  // Store in database using user-scoped Supabase client
  const insertPayload = {
    user_id: userId,
    farm_id: inputData.farmId || null,
    input_data: inputData,
    recommendations: recommendations,
    advisory_language: inputData.language || 'en',
    model_name: getModelName(),
  };

  const { data, error } = await supabase
    .from('crop_recommendations')
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error('[DB_INSERT_CROP_REC_ERROR]', error);
    throw new Error(`Failed to save crop recommendation: ${error.message}`);
  }

  return data;
};

export const getCropRecommendationsService = async (userId, supabase, { limit = 20, offset = 0 } = {}) => {
  const { data, error, count } = await supabase
    .from('crop_recommendations')
    .select('*, farms(farm_name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(`Failed to retrieve crop recommendations: ${error.message}`);
  }

  return { items: data, total: count };
};

export const getCropRecommendationByIdService = async (id, userId, supabase) => {
  const { data, error } = await supabase
    .from('crop_recommendations')
    .select('*, farms(*)')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(`Crop recommendation not found or access denied: ${error.message}`);
  }

  return data;
};

export const deleteCropRecommendationService = async (id, userId, supabase) => {
  const { error } = await supabase
    .from('crop_recommendations')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(`Failed to delete crop recommendation: ${error.message}`);
  }

  return true;
};

