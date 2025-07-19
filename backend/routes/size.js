import express from 'express';
import { body } from 'express-validator';
import {
  createSize,
  getAllSizes,
  getSizeById,
  updateSize,
  deleteSize,
  toggleSizeStatus
} from '../controllers/sizeController.js';
import { protect, authorize, permissions } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const sizeValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Size name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Size name must be between 2 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Size description cannot exceed 200 characters'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
];

const updateSizeValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Size name must be between 2 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Size description cannot exceed 200 characters'),
  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a non-negative integer')
];

// Public routes
router.get('/', getAllSizes);
router.get('/:id', getSizeById);

// Protected routes - SuperAdmin only
router.use(protect);
router.use(authorize('superadmin', 'admin'));
router.use(permissions('Products'));

router.post('/', sizeValidation, validate, createSize);
router.put('/:id', updateSizeValidation, validate, updateSize);
router.delete('/:id', deleteSize);
router.patch('/:id/toggle-status', toggleSizeStatus);

export default router; 