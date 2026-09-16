import express from 'express';
import { login, unlockWithPin } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/unlock-pin', unlockWithPin);

export default router;
