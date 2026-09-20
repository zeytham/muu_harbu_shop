import express from 'express';
import { 
  getPhoneUnits, 
  addPhoneUnit, 
  bulkImportPhoneUnits,
  updatePhoneUnitStatus,
  deletePhoneUnit,
} from '../controllers/phones.controller.js';

const router = express.Router();

router.get('/units', getPhoneUnits);
router.post('/units', addPhoneUnit);
router.post('/units/bulk-import', bulkImportPhoneUnits);
router.patch('/units/:id', updatePhoneUnitStatus);
router.delete('/units/:id', deletePhoneUnit);

export default router;

