import express from 'express';
import { body } from 'express-validator';
import {
  createFileCenter,
  getAllFileCenter,
  getFileCenterById,
  downloadFile,
  viewFile,
  updateFileCenter,
  deleteFileCenterImage,
  deleteFileCenter,
  toggleFileCenterStatus,
  getFileStats
} from '../controllers/fileCenterController.js';
import { protect, authorize, permissions } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Validation rules
const fileCenterValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('File name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('File name must be between 2 and 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('File description is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('File description must be between 10 and 1000 characters')
];

const updateFileCenterValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('File name must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('File description must be between 10 and 1000 characters')
];

// Public routes
router.get('/', getAllFileCenter);
router.get('/:id', getFileCenterById);
router.get('/:id/download', downloadFile);
router.get('/:id/view', viewFile);

// Protected routes - SuperAdmin only
router.use(protect);
router.use(authorize('superadmin', 'admin'));
router.use(permissions('Files'));

router.post('/', upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), fileCenterValidation, validate, createFileCenter);

router.put('/:id', upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), updateFileCenterValidation, validate, updateFileCenter);

router.delete('/:id/delete-image', deleteFileCenterImage);
router.delete('/:id', deleteFileCenter);
router.patch('/:id/toggle-status', toggleFileCenterStatus);
router.get('/stats/overview', getFileStats);

export default router; 