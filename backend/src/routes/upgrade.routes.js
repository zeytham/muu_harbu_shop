import express from 'express';
import {
  evaluatePhoneUpgrade,
  saveDigitalContract,
  getUpgradeEvaluations,
  updateUpgradeStatus,
  getUpgradeAnalytics,
} from '../controllers/upgrade.controller.js';

const router = express.Router();

router.get('/', getUpgradeEvaluations);
router.get('/analytics', getUpgradeAnalytics);
router.post('/evaluate', evaluatePhoneUpgrade);
router.post('/contract', saveDigitalContract);
router.patch('/:id/status', updateUpgradeStatus);

export default router;

