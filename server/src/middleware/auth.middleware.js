import { supabasePublic, createUserClient } from '../config/supabase.js';
import { errorResponse } from '../utils/response.js';

/**
 * Authentication Middleware
 * Validates Supabase JWT access token and attaches user & user-scoped Supabase client.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'Authentication token missing or invalid format', 'UNAUTHORIZED', [], 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return errorResponse(res, 'Access token is required', 'UNAUTHORIZED', [], 401);
    }

    // Verify token using Supabase Auth
    const { data: { user }, error } = await supabasePublic.auth.getUser(token);

    if (error || !user) {
      return errorResponse(
        res,
        'Invalid or expired session. Please log in again.',
        'UNAUTHORIZED',
        error ? [error.message] : [],
        401
      );
    }

    // Attach authenticated user information and user-scoped Supabase client for RLS
    req.user = user;
    req.token = token;
    req.supabase = createUserClient(token);

    next();
  } catch (err) {
    console.error('[AUTH_ERROR]', err.message);
    return errorResponse(res, 'Internal authentication error', 'INTERNAL_ERROR', [err.message], 500);
  }
};

