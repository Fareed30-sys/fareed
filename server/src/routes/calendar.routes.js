import { Router } from 'express';
import {
  generateCalendar,
  getCalendars,
  getCalendarById,
  updateCalendarActivities,
  deleteCalendar,
} from '../controllers/calendar.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  cultivationCalendarSchema,
  updateCalendarSchema,
} from '../schemas/calendar.schema.js';

const router = Router();

router.use(authenticate);

router.post('/generate', validate(cultivationCalendarSchema), generateCalendar);
router.get('/', getCalendars);
router.get('/:id', getCalendarById);
router.put('/:id', validate(updateCalendarSchema), updateCalendarActivities);
router.delete('/:id', deleteCalendar);

export default router;

