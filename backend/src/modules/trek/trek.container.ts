import { TrekController } from './trek.controller.js';
import { TrekRepository } from './trek.repository.js';
import { TrekService } from './trek.service.js';

const trekRepository = new TrekRepository();
const trekService = new TrekService(trekRepository);
const trekController = new TrekController(trekService);

export { trekController, trekService };
