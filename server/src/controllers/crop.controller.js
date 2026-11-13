import {
  generateCropRecommendationService,
  getCropRecommendationsService,
  getCropRecommendationByIdService,
  deleteCropRecommendationService,
} from '../services/crop.service.js';
import { successResponse } from '../utils/response.js';

export const recommendCrops = async (req, res, next) => {
  try {
    const result = await generateCropRecommendationService(req.user.id, req.body, req.supabase);
    return successResponse(res, 'Crop recommendations generated successfully', result, 201);
  } catch (err) {
    next(err);
  }
};

export const getCropRecommendations = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;
    const result = await getCropRecommendationsService(req.user.id, req.supabase, { limit, offset });
    return successResponse(res, 'Crop recommendations retrieved successfully', result);
  } catch (err) {
    next(err);
  }
};

export const getCropRecommendationById = async (req, res, next) => {
  try {
    const result = await getCropRecommendationByIdService(req.params.id, req.user.id, req.supabase);
    return successResponse(res, 'Crop recommendation details retrieved successfully', result);
  } catch (err) {
    next(err);
  }
};

export const deleteCropRecommendation = async (req, res, next) => {
  try {
    await deleteCropRecommendationService(req.params.id, req.user.id, req.supabase);
    return successResponse(res, 'Crop recommendation deleted successfully', null);
  } catch (err) {
    next(err);
  }
};

