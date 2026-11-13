import { Router } from 'express';
import {
  recommendCrops,
  getCropRecommendations,
  getCropRecommendationById,
  deleteCropRecommendation,
} from '../controllers/crop.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { cropRecommendationSchema } from '../schemas/crop.schema.js';

const router = Router();

router.use(authenticate);

router.post('/recommend', validate(cropRecommendationSchema), recommendCrops);
router.get('/recommendations', getCropRecommendations);
router.get('/recommendations/:id', getCropRecommendationById);
router.delete('/recommendations/:id', deleteCropRecommendation);

export default router;

