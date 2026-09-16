import express from 'express';
import { getCategories, getBrands, getPhoneModels } from '../controllers/categories.controller.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/brands', getBrands);
router.get('/models', getPhoneModels);

export default router;
