import express from 'express';
import {
  getSalesVelocity,
  getAbcMatrix,
  getSuppliers,
  createSupplier,
  getPurchaseOrders,
  createPurchaseOrder,
  receiveAndRestockPO,
} from '../controllers/forecasting.controller.js';

const router = express.Router();

// AI Sales Velocity & Restock Predictions
router.get('/velocity', getSalesVelocity);

// Fast-Moving vs Dead-Stock ABC Matrix
router.get('/abc-matrix', getAbcMatrix);

// Supplier Management
router.get('/suppliers', getSuppliers);
router.post('/suppliers', createSupplier);

// Purchase Orders (PO Tracker)
router.get('/purchase-orders', getPurchaseOrders);
router.post('/purchase-orders', createPurchaseOrder);
router.patch('/purchase-orders/:id/receive', receiveAndRestockPO);

export default router;
