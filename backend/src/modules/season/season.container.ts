import { SeasonController } from './season.controller.js';
import { SeasonRepository } from './season.repository.js';
import { SeasonService } from './season.service.js';

const seasonRepository = new SeasonRepository();
const seasonService = new SeasonService(seasonRepository);
const seasonController = new SeasonController(seasonService);

export { seasonController, seasonService };
