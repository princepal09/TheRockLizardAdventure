import { DashboardController } from './dashboard.controller.js';
import { DashboardRepository } from './dashboard.repository.js';

const dashboardRepository = new DashboardRepository();
const dashboardController = new DashboardController(dashboardRepository);

export { dashboardController };
