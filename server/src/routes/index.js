import { Router } from 'express';
import profileRoutes from './profile.routes.js';
import farmRoutes from './farm.routes.js';
import cropRoutes from './crop.routes.js';
import soilRoutes from './soil.routes.js';
import fertilizerRoutes from './fertilizer.routes.js';
import irrigationRoutes from './irrigation.routes.js';
import diseaseRoutes from './disease.routes.js';
import calendarRoutes from './calendar.routes.js';
import chatRoutes from './chat.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const apiRouter = Router();

// Health Check Endpoint (Section 12.J)
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'AgroAI Advisory Engine',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Modular Routes mount
apiRouter.use('/profile', profileRoutes);
apiRouter.use('/farms', farmRoutes);
apiRouter.use('/crop', cropRoutes);
apiRouter.use('/soil', soilRoutes);
apiRouter.use('/fertilizer', fertilizerRoutes);
apiRouter.use('/irrigation', irrigationRoutes);
apiRouter.use('/disease', diseaseRoutes);
apiRouter.use('/calendar', calendarRoutes);
apiRouter.use('/chat', chatRoutes);
apiRouter.use('/dashboard', dashboardRoutes);

export default apiRouter;

