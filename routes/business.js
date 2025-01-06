import express from 'express';
import { createBusiness, deleteBusinessById, editBussinessStatusById, getAllBusiness, getBusinessById } from '../controllers/businessModule/business.controller.js';

const router = express.Router();

router.post('/createBusiness', createBusiness);
router.get('/getAllBusiness', getAllBusiness);
router.get('/getBusinessById/:businesId', getBusinessById);
router.put('/editBussinessStatusById/:businesId',editBussinessStatusById);
router.delete('/deleteBusinessById/:businesId', deleteBusinessById);

export default router;