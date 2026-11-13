import { Router } from 'express';
import {
  analyzeCropDisease,
  getDiseaseReports,
  getDiseaseReportById,
  deleteDiseaseReport,
} from '../controllers/disease.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { handleImageUploadMiddleware } from '../middleware/upload.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { diseaseDetectionSchema } from '../schemas/disease.schema.js';

const router = Router();

router.use(authenticate);

router.post(
  '/analyze',
  handleImageUploadMiddleware,
  validate(diseaseDetectionSchema),
  analyzeCropDisease
);
router.get('/reports', getDiseaseReports);
router.get('/reports/:id', getDiseaseReportById);
router.delete('/reports/:id', deleteDiseaseReport);

export default router;

