import express from 'express';
import { getProducts, createProduct, getLowStockAlerts, deleteProduct } from '../controllers/products.controller.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', createProduct);
router.delete('/:id', deleteProduct);
router.get('/alerts/low-stock', getLowStockAlerts);

export default router;

