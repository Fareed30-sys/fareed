import {
  generateCultivationCalendarService,
  getCultivationCalendarsService,
  getCultivationCalendarByIdService,
  updateCultivationCalendarActivitiesService,
  deleteCultivationCalendarService,
} from '../services/calendar.service.js';
import { successResponse } from '../utils/response.js';

export const generateCalendar = async (req, res, next) => {
  try {
    const result = await generateCultivationCalendarService(req.user.id, req.body, req.supabase);
    return successResponse(res, 'Cultivation calendar generated successfully', result, 201);
  } catch (err) {
    next(err);
  }
};

export const getCalendars = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const offset = parseInt(req.query.offset, 10) || 0;
    const result = await getCultivationCalendarsService(req.user.id, req.supabase, { limit, offset });
    return successResponse(res, 'Cultivation calendars retrieved successfully', result);
  } catch (err) {
    next(err);
  }
};

export const getCalendarById = async (req, res, next) => {
  try {
    const result = await getCultivationCalendarByIdService(req.params.id, req.user.id, req.supabase);
    return successResponse(res, 'Cultivation calendar details retrieved successfully', result);
  } catch (err) {
    next(err);
  }
};

export const updateCalendarActivities = async (req, res, next) => {
  try {
    const result = await updateCultivationCalendarActivitiesService(
      req.params.id,
      req.user.id,
      req.body.activities,
      req.supabase
    );
    return successResponse(res, 'Cultivation calendar updated successfully', result);
  } catch (err) {
    next(err);
  }
};

export const deleteCalendar = async (req, res, next) => {
  try {
    await deleteCultivationCalendarService(req.params.id, req.user.id, req.supabase);
    return successResponse(res, 'Cultivation calendar deleted successfully', null);
  } catch (err) {
    next(err);
  }
};

