import { Router } from 'express';
import {
  getFarms,
  createFarm,
  getFarmById,
  updateFarm,
  deleteFarm,
} from '../controllers/farm.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createFarmSchema, updateFarmSchema } from '../schemas/farm.schema.js';

const router = Router();

router.use(authenticate);

router.get('/', getFarms);
router.post('/', validate(createFarmSchema), createFarm);
router.get('/:id', getFarmById);
router.put('/:id', validate(updateFarmSchema), updateFarm);
router.delete('/:id', deleteFarm);

export default router;

