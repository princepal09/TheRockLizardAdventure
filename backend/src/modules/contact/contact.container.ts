import { ContactController } from './contact.controller.js';
import { ContactRepository } from './contact.repository.js';
import { ContactService } from './contact.service.js';

const contactRepository = new ContactRepository();
const contactService = new ContactService(contactRepository);
const contactController = new ContactController(contactService);

export { contactController, contactService };
