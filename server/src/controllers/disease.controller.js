import {
  analyzeCropDiseaseService,
  getDiseaseReportsService,
  getDiseaseReportByIdService,
  deleteDiseaseReportService,
} from '../services/disease.service.js';
import { successResponse } from '../utils/response.js';

export const analyzeCropDisease = async (req, res, next) => {
  try {
    const inputData = {
      farmId: req.body.farmId || null,
      crop: req.body.crop,
      affectedPart: req.body.affectedPart,
      symptoms: req.body.symptoms,
      duration: req.body.duration,
      visibleDamage: req.body.visibleDamage || null,
      language: req.body.language || 'en',
    };

    const file = req.file || null;

    const result = await analyzeCropDiseaseService(
      req.user.id,
      inputData,
      file,
      req.supabase
    );

    return successResponse(res, 'Crop disease diagnostic completed successfully', result, 201);
  } catch (err) {
    next(err);
  }
};

export const getDiseaseReports = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;
    const result = await getDiseaseReportsService(req.user.id, req.supabase, { limit, offset });
    return successResponse(res, 'Disease reports retrieved successfully', result);
  } catch (err) {
    next(err);
  }
};

export const getDiseaseReportById = async (req, res, next) => {
  try {
    const result = await getDiseaseReportByIdService(req.params.id, req.user.id, req.supabase);
    return successResponse(res, 'Disease report details retrieved successfully', result);
  } catch (err) {
    next(err);
  }
};

export const deleteDiseaseReport = async (req, res, next) => {
  try {
    await deleteDiseaseReportService(req.params.id, req.user.id, req.supabase);
    return successResponse(res, 'Disease report deleted successfully', null);
  } catch (err) {
    next(err);
  }
};

