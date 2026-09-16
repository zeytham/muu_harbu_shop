import express from 'express';
import { getCompatibleAccessories } from '../controllers/compatibility.controller.js';

const router = express.Router();
router.get('/', getCompatibleAccessories);

export default router;
