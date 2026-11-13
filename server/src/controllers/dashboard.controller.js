import {
  getDashboardSummaryService,
  getRecentActivitiesService,
} from '../services/dashboard.service.js';
import { successResponse } from '../utils/response.js';

export const getDashboardSummary = async (req, res, next) => {
  try {
    const data = await getDashboardSummaryService(req.user.id, req.supabase);
    return successResponse(res, 'Dashboard summary loaded successfully', data);
  } catch (err) {
    next(err);
  }
};

export const getRecentActivities = async (req, res, next) => {
  try {
    const data = await getRecentActivitiesService(req.user.id, req.supabase);
    return successResponse(res, 'Recent activities loaded successfully', data);
  } catch (err) {
    next(err);
  }
};

export const getUpcomingTasks = async (req, res, next) => {
  try {
    const summary = await getDashboardSummaryService(req.user.id, req.supabase);
    return successResponse(res, 'Upcoming tasks loaded successfully', summary.upcomingTasks);
  } catch (err) {
    next(err);
  }
};

