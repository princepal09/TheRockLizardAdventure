import { RegionController } from './region.controller.js';
import { RegionRepository } from './region.repository.js';
import { RegionService } from './region.service.js';

const regionRepository = new RegionRepository();
const regionService = new RegionService(regionRepository);
const regionController = new RegionController(regionService);

export { regionController, regionService };
