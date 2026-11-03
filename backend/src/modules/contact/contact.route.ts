import express from 'express';

import { verifyUser } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { authService } from '../auth/auth.container.js';
import { contactController } from './contact.container.js';
import { createContactSchema, updateContactSchema } from './contact.schema.js';

const router = express.Router();

router.post('/', validate(createContactSchema), contactController.createContactController);

router.use(verifyUser(authService));

router.get('/', contactController.getContactsController);
router.get('/:contactId', contactController.getContactController);
router.patch(
  '/:contactId',
  validate(updateContactSchema),
  contactController.updateContactController,
);

export default router;
