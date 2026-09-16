import express from 'express';
import {
  getWarrantyCertificates,
  createWarrantyCertificate,
  verifyWarrantyByImei,
  createSupplierRmaClaim,
  getSupplierRmaClaims,
  resolveSupplierRmaClaim,
  getWarrantyAnalytics,
} from '../controllers/warranties.controller.js';

const router = express.Router();

router.get('/', getWarrantyCertificates);
router.get('/analytics', getWarrantyAnalytics);
router.get('/verify/:term', verifyWarrantyByImei);
router.post('/issue', createWarrantyCertificate);

// Supplier RMA Routes
router.get('/rma', getSupplierRmaClaims);
router.post('/rma', createSupplierRmaClaim);
router.patch('/rma/:id/resolve', resolveSupplierRmaClaim);

export default router;
