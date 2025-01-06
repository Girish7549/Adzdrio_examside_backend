import express from 'express';
import { createCategory, deleteCategoryById, editCategoryById, getAllCategory, getAllCategoryAdmin, getAllProductByCategory, getAllProductByCategoryName, getCategoryById } from '../controllers/categoryModule/category.controller.js';
import upload from '../config/multer.js';

const  router = express.Router();

router.post('/create/category',upload.single('categoryImage'), createCategory);
router.get('/getAllCategories', getAllCategory);
router.get('/getAllCategoryAdmin', getAllCategoryAdmin);
router.get('/getCategoryById/:categoryId', getCategoryById);
router.get('/getProductByCategory', getAllProductByCategory);
router.put('/editCategoryById/:categoryId',upload.single('categoryImage'), editCategoryById);
router.delete('/deleteCategoryById/:categoryId', deleteCategoryById);
router.get('/getProductByCategory', getAllProductByCategory);
router.get('/getProductByCategoryName', getAllProductByCategoryName)

export default router;