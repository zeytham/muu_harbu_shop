import express from 'express';
import { getSmsLogs, sendSms } from '../controllers/sms.controller.js';

const router = express.Router();

router.get('/', getSmsLogs);
router.post('/send', sendSms);

export default router;
