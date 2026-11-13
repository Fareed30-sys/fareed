import { Router } from 'express';
import {
  analyzeSoil,
  getSoilReports,
  getSoilReportById,
  deleteSoilReport,
} from '../controllers/soil.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { soilAnalysisSchema } from '../schemas/soil.schema.js';

const router = Router();

router.use(authenticate);

router.post('/analyze', validate(soilAnalysisSchema), analyzeSoil);
router.get('/reports', getSoilReports);
router.get('/reports/:id', getSoilReportById);
router.delete('/reports/:id', deleteSoilReport);

export default router;

