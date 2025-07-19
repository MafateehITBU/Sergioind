import express from 'express';
import { body } from 'express-validator';
import {
  createFlavor,
  getAllFlavors,
  getFlavorById,
  updateFlavor,
  deleteFlavor,
  toggleFlavorStatus
} from '../controllers/flavorController.js';
import { protect, authorize, permissions } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Validation rules
const flavorValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Flavor name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Flavor name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Flavor description cannot exceed 500 characters'),
  body('color')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Color code cannot exceed 20 characters')
];

const updateFlavorValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Flavor name must be between 2 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Flavor description cannot exceed 500 characters'),
  body('color')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Color code cannot exceed 20 characters')
];

// Public routes
router.get('/', getAllFlavors);
router.get('/:id', getFlavorById);

// Protected routes - SuperAdmin only
router.use(protect);
router.use(authorize('superadmin', 'admin'));
router.use(permissions('Products'));

router.post('/', flavorValidation, validate, createFlavor);
router.put('/:id', updateFlavorValidation, validate, updateFlavor);
router.delete('/:id', deleteFlavor);
router.patch('/:id/toggle-status', toggleFlavorStatus);

export default router; 