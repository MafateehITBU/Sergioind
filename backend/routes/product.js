import express from 'express';
import { body } from 'express-validator';
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductsByCategory,
  updateProduct,
  deleteProductImage,
  deleteProduct,
  toggleProductStatus,
  updateProductStock
} from '../controllers/productController.js';
import { protect, authorize, permissions } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Validation rules
const productValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2 and 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Product description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Product description must be between 10 and 1000 characters'),
  body('price')
    .notEmpty()
    .withMessage('Product price is required')
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage('Price must be between 0 and 999,999.99'),
  body('category')
    .notEmpty()
    .withMessage('Product category is required')
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('flavors')
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) return value.every(v => typeof v === 'string');
      return typeof value === 'string';
    })
    .withMessage('Flavors must be a string or array of strings'),
  body('sizes')
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) return value.every(v => typeof v === 'string');
      return typeof value === 'string';
    })
    .withMessage('Sizes must be a string or array of strings')
];

const updateProductValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Product name must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Product description must be between 10 and 1000 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0, max: 999999.99 })
    .withMessage('Price must be between 0 and 999,999.99'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  body('flavors')
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) return value.every(v => typeof v === 'string');
      return typeof value === 'string';
    })
    .withMessage('Flavors must be a string or array of strings'),
  body('sizes')
    .optional()
    .custom((value) => {
      if (Array.isArray(value)) return value.every(v => typeof v === 'string');
      return typeof value === 'string';
    })
    .withMessage('Sizes must be a string or array of strings')
];

const stockValidation = [
  body('stock')
    .notEmpty()
    .withMessage('Stock is required')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
];

// Public routes
router.get('/', getAllProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:id', getProductById);

// Protected routes - SuperAdmin only
router.use(protect);
router.use(authorize('superadmin', 'admin'));
router.use(permissions('Products'));

router.post('/', upload.array('images', 5), productValidation, validate, createProduct);
router.put('/:id', upload.array('images', 5), updateProductValidation, validate, updateProduct);
router.delete('/:id/delete-image', deleteProductImage);
router.delete('/:id', deleteProduct);
router.patch('/:id/toggle-status', toggleProductStatus);
router.patch('/:id/stock', stockValidation, validate, updateProductStock);

export default router; 