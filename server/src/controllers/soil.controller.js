import {
  analyzeSoilHealthService,
  getSoilReportsService,
  getSoilReportByIdService,
  deleteSoilReportService,
} from '../services/soil.service.js';
import { successResponse } from '../utils/response.js';

export const analyzeSoil = async (req, res, next) => {
  try {
    const result = await analyzeSoilHealthService(req.user.id, req.body, req.supabase);
    return successResponse(res, 'Soil health analysis completed successfully', result, 201);
  } catch (err) {
    next(err);
  }
};

export const getSoilReports = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;
    const result = await getSoilReportsService(req.user.id, req.supabase, { limit, offset });
    return successResponse(res, 'Soil reports retrieved successfully', result);
  } catch (err) {
    next(err);
  }
};

export const getSoilReportById = async (req, res, next) => {
  try {
    const result = await getSoilReportByIdService(req.params.id, req.user.id, req.supabase);
    return successResponse(res, 'Soil report details retrieved successfully', result);
  } catch (err) {
    next(err);
  }
};

export const deleteSoilReport = async (req, res, next) => {
  try {
    await deleteSoilReportService(req.params.id, req.user.id, req.supabase);
    return successResponse(res, 'Soil report deleted successfully', null);
  } catch (err) {
    next(err);
  }
};

