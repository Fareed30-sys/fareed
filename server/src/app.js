import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';
import { errorResponse } from './utils/response.js';

const app = express();

// Security Headers via Helmet
app.use(helmet());

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow dev flexibility
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Rate Limiting (Section 18 API Security)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.',
    data: null,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      details: ['Request frequency exceeded allowed safety threshold.'],
    },
  },
});

app.use('/api/', limiter);

// Request body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root sanity endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'AgroAI Assistant API',
    version: '1.0.0',
    documentation: '/api/v1/health',
    status: 'online',
  });
});

// Primary API Router mounted at /api/v1 (Section 12)
app.use('/api/v1', apiRouter);

// Undefined API routes 404 handler
app.use('/api/*', (req, res) => {
  return errorResponse(res, `API route not found: ${req.method} ${req.originalUrl}`, 'NOT_FOUND', [], 404);
});

// Centralized Error Handling Middleware
app.use(errorHandler);

export default app;

