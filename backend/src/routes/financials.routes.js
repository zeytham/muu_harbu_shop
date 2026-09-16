import express from 'express';
import {
  getFinancialOverview,
  getStoreExpenses,
  createStoreExpense,
  deleteStoreExpense,
  getFinancialAuditReport,
} from '../controllers/financials.controller.js';

const router = express.Router();

router.get('/overview', getFinancialOverview);
router.get('/expenses', getStoreExpenses);
router.post('/expenses', createStoreExpense);
router.delete('/expenses/:id', deleteStoreExpense);
router.get('/audit-report', getFinancialAuditReport);

export default router;
