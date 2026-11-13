import { Router } from 'express';
import {
  recommendFertilizer,
  getFertilizerAdvisories,
  getFertilizerAdvisoryById,
  deleteFertilizerAdvisory,
} from '../controllers/fertilizer.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { fertilizerAdvisorySchema } from '../schemas/fertilizer.schema.js';

const router = Router();

router.use(authenticate);

router.post('/recommend', validate(fertilizerAdvisorySchema), recommendFertilizer);
router.get('/advisories', getFertilizerAdvisories);
router.get('/advisories/:id', getFertilizerAdvisoryById);
router.delete('/advisories/:id', deleteFertilizerAdvisory);

export default router;

