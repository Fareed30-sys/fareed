import { errorResponse } from '../utils/response.js';

/**
 * Zod validation middleware factory
 * @param {import('zod').ZodSchema} schema 
 * @param {'body' | 'query' | 'params'} source 
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const dataToValidate = req[source];
      const result = schema.safeParse(dataToValidate);

      if (!result.success) {
        const errorDetails = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return errorResponse(
          res,
          'Validation failed. Please verify your submitted information.',
          'VALIDATION_ERROR',
          errorDetails,
          400
        );
      }

      // Assign parsed & sanitized data back to the request
      req[source] = result.data;
      next();
    } catch (err) {
      console.error('[VALIDATION_MIDDLEWARE_ERROR]', err);
      return errorResponse(res, 'Internal validation error', 'INTERNAL_ERROR', [err.message], 500);
    }
  };
};

