import { TeamController } from './team.controller.js';
import { TeamRepository } from './team.repository.js';
import { TeamService } from './team.service.js';

const teamRepository = new TeamRepository();
const teamService = new TeamService(teamRepository);
const teamController = new TeamController(teamService);

export { teamController };
