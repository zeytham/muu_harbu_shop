import express from 'express';
import {
  createSale,
  verifyManagerPin,
  simulateStkPush,
  verifyTradeInVoucher,
  getReceiptPayload,
  manageShift,
} from '../controllers/pos.controller.js';

const router = express.Router();

router.post('/sales', createSale);
router.post('/manager-override', verifyManagerPin);
router.post('/stk-push', simulateStkPush);
router.get('/vouchers/:code', verifyTradeInVoucher);
router.get('/sales/:id/receipt', getReceiptPayload);
router.post('/shift', manageShift);

export default router;
