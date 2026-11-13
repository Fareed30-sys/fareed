import {
  recommendIrrigationService,
  getIrrigationAdvisoriesService,
  getIrrigationAdvisoryByIdService,
  deleteIrrigationAdvisoryService,
} from '../services/irrigation.service.js';
import { successResponse } from '../utils/response.js';

export const recommendIrrigation = async (req, res, next) => {
  try {
    const result = await recommendIrrigationService(req.user.id, req.body, req.supabase);
    return successResponse(res, 'Irrigation advisory generated successfully', result, 201);
  } catch (err) {
    next(err);
  }
};

export const getIrrigationAdvisories = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;
    const result = await getIrrigationAdvisoriesService(req.user.id, req.supabase, { limit, offset });
    return successResponse(res, 'Irrigation advisories retrieved successfully', result);
  } catch (err) {
    next(err);
  }
};

export const getIrrigationAdvisoryById = async (req, res, next) => {
  try {
    const result = await getIrrigationAdvisoryByIdService(req.params.id, req.user.id, req.supabase);
    return successResponse(res, 'Irrigation advisory details retrieved successfully', result);
  } catch (err) {
    next(err);
  }
};

export const deleteIrrigationAdvisory = async (req, res, next) => {
  try {
    await deleteIrrigationAdvisoryService(req.params.id, req.user.id, req.supabase);
    return successResponse(res, 'Irrigation advisory deleted successfully', null);
  } catch (err) {
    next(err);
  }
};

