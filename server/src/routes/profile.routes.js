import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { profileSchema } from '../schemas/auth.schema.js';

const router = Router();

router.use(authenticate);

router.get('/', getProfile);
router.put('/', validate(profileSchema), updateProfile);

export default router;

