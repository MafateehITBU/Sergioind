import express from 'express';
const router = express.Router();
import {
  createQuotationRequest,
  getAllQuotationRequests,
  getQuotationRequestById,
  updateQuotationRequestStatus,
  deleteQuotationRequest,
  getQuotationRequestStats,
  getQuotationRequestsByEmail
} from '../controllers/quotationRequestController.js';
import { protect } from '../middleware/auth.js';
import { validateQuotationRequest } from '../middleware/validate.js';

// Public routes (no authentication required)
router.post('/', validateQuotationRequest, createQuotationRequest);
router.get('/email/:email', getQuotationRequestsByEmail);

// Admin routes (authentication required)
router.get('/', protect, getAllQuotationRequests);
router.get('/stats', protect, getQuotationRequestStats);
router.get('/:id', protect, getQuotationRequestById);
router.patch('/:id/status', protect, updateQuotationRequestStatus);
router.delete('/:id', protect, deleteQuotationRequest);

export default router; 