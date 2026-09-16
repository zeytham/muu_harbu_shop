import express from 'express';
import {
  getCategories,
  getBrands,
  getPhoneModels,
  createCategory,
  createBrand,
  createPhoneModel,
} from '../controllers/categories.controller.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', createCategory);

router.get('/brands', getBrands);
router.post('/brands', createBrand);

router.get('/models', getPhoneModels);
router.post('/models', createPhoneModel);

export default router;

