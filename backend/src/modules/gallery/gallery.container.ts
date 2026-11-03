import { GalleryController } from './gallery.controller.js';
import { GalleryRepository } from './gallery.repository.js';
import { GalleryService } from './gallery.service.js';

const galleryRepository = new GalleryRepository();
const galleryService = new GalleryService(galleryRepository);
const galleryController = new GalleryController(galleryService);

export { galleryController, galleryService };
