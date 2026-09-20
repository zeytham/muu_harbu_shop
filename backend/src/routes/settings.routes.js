import express from 'express';
import {
  getSettings,
  updateSettings,
  updateSecurityCredentials,
  exportDatabaseBackup,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getSystemMetrics,
} from '../controllers/settings.controller.js';

const router = express.Router();

router.get('/', getSettings);
router.put('/', updateSettings);
router.post('/security', updateSecurityCredentials);
router.get('/export-backup', exportDatabaseBackup);

// Staff Users & Role Access routes
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// System Health & Metrics
router.get('/metrics', getSystemMetrics);

export default router;


