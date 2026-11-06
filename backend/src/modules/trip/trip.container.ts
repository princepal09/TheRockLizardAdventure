import { TripController } from './trip.controller.js';
import { TripRepository } from './trip.repository.js';
import { TripService } from './trip.service.js';

const tripRepository = new TripRepository();
const tripService = new TripService(tripRepository);
const tripController = new TripController(tripService);

export { tripController, tripService };
