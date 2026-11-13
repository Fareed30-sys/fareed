import {
  recommendFertilizerService,
  getFertilizerAdvisoriesService,
  getFertilizerAdvisoryByIdService,
  deleteFertilizerAdvisoryService,
} from '../services/fertilizer.service.js';
import { successResponse } from '../utils/response.js';

export const recommendFertilizer = async (req, res, next) => {
  try {
    const result = await recommendFertilizerService(req.user.id, req.body, req.supabase);
    return successResponse(res, 'Fertilizer advisory generated successfully', result, 201);
  } catch (err) {
    next(err);
  }
};

export const getFertilizerAdvisories = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;
    const result = await getFertilizerAdvisoriesService(req.user.id, req.supabase, { limit, offset });
    return successResponse(res, 'Fertilizer advisories retrieved successfully', result);
  } catch (err) {
    next(err);
  }
};

export const getFertilizerAdvisoryById = async (req, res, next) => {
  try {
    const result = await getFertilizerAdvisoryByIdService(req.params.id, req.user.id, req.supabase);
    return successResponse(res, 'Fertilizer advisory details retrieved successfully', result);
  } catch (err) {
    next(err);
  }
};

export const deleteFertilizerAdvisory = async (req, res, next) => {
  try {
    await deleteFertilizerAdvisoryService(req.params.id, req.user.id, req.supabase);
    return successResponse(res, 'Fertilizer advisory deleted successfully', null);
  } catch (err) {
    next(err);
  }
};

