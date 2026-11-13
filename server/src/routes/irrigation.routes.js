import { Router } from 'express';
import {
  recommendIrrigation,
  getIrrigationAdvisories,
  getIrrigationAdvisoryById,
  deleteIrrigationAdvisory,
} from '../controllers/irrigation.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { irrigationAdvisorySchema } from '../schemas/irrigation.schema.js';

const router = Router();

router.use(authenticate);

router.post('/recommend', validate(irrigationAdvisorySchema), recommendIrrigation);
router.get('/advisories', getIrrigationAdvisories);
router.get('/advisories/:id', getIrrigationAdvisoryById);
router.delete('/advisories/:id', deleteIrrigationAdvisory);

export default router;

