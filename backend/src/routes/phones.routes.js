import express from 'express';
import { getPhoneUnits, addPhoneUnit, bulkImportPhoneUnits } from '../controllers/phones.controller.js';

const router = express.Router();

router.get('/units', getPhoneUnits);
router.post('/units', addPhoneUnit);
router.post('/units/bulk-import', bulkImportPhoneUnits);

export default router;
