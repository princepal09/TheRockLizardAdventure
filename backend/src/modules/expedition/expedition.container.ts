import { ExpeditionController } from './expedition.controller.js';
import { ExpeditionRepository } from './expedition.repository.js';
import { ExpeditionService } from './expedition.service.js';

const expeditionRepository = new ExpeditionRepository();
const expeditionService = new ExpeditionService(expeditionRepository);
const expeditionController = new ExpeditionController(expeditionService);

export { expeditionController, expeditionService };
