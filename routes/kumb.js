import express from 'express';
import { createKumb, deleteKumbById, editBussinessStatusById, getAllKumb, getKumbById } from '../controllers/kumbModule/kumb.controller.js';

const router = express.Router();

router.post('/create/kumb', createKumb);
router.get('/getAllKumb', getAllKumb);
router.get('/getAllKumbById/:kumbId', getKumbById);
router.put('/editKumbStatusById/:kumbId', editBussinessStatusById);
router.delete('/deleteKumbById/:kumbId', deleteKumbById);


export default router;