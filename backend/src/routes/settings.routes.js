import express from 'express';
import {
  getSettings,
  updateSettings,
  updateSecurityCredentials,
  exportDatabaseBackup,
} from '../controllers/settings.controller.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', updateSettings);
router.post('/security', updateSecurityCredentials);
router.get('/export-backup', exportDatabaseBackup);

export default router;
