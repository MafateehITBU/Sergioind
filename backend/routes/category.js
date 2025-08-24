import express from 'express';
import { body } from 'express-validator';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategoryImage,
  deleteCategory,
  toggleCategoryStatus
} from '../controllers/categoryController.js';
import { protect, authorize, permissions } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Validation rules
const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters'),
  body('description')
    .trim()
];

const updateCategoryValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Category name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
];

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Protected routes - SuperAdmin only
router.use(protect);
router.use(authorize('superadmin', 'admin'));
router.use(permissions('Categories'));

router.post('/', upload.single('image'), categoryValidation, validate, createCategory);
router.put('/:id', upload.single('image'), updateCategoryValidation, validate, updateCategory);
router.delete('/:id/delete-image', deleteCategoryImage);
router.delete('/:id', deleteCategory);
router.patch('/:id/toggle-status', toggleCategoryStatus);

export default router; 