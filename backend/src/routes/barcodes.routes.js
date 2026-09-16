import express from 'express';
import { generateBarcodeSticker } from '../controllers/barcodes.controller.js';

const router = express.Router();
router.get('/:code', generateBarcodeSticker);

export default router;
