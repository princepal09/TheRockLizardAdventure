import { SiteSettingsController } from './site-settings.controller.js';
import { SiteSettingsRepository } from './site-settings.repository.js';
import { SiteSettingsService } from './site-settings.service.js';

const settingsRepository = new SiteSettingsRepository();
const settingsService = new SiteSettingsService(settingsRepository);
const settingsController = new SiteSettingsController(settingsService);

export { settingsController, settingsService };
