import { getProfileService, updateProfileService } from '../services/profile.service.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getProfile = async (req, res, next) => {
  try {
    const profile = await getProfileService(req.user.id, req.supabase);
    return successResponse(res, 'Profile retrieved successfully', profile);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updated = await updateProfileService(req.user.id, req.body, req.supabase);
    return successResponse(res, 'Profile updated successfully', updated);
  } catch (err) {
    next(err);
  }
};

