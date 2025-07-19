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
import { protect, authorize, permissions } from '../middleware/auth.js';
import { validateQuotationRequest } from '../middleware/validate.js';

// Public routes (no authentication required)
router.post('/', validateQuotationRequest, createQuotationRequest);
router.get('/email/:email', getQuotationRequestsByEmail);

// Admin routes (authentication required)
router.use(protect);
router.use(authorize('superadmin', 'admin'));
router.use(permissions('Quotations'));

router.get('/', getAllQuotationRequests);
router.get('/stats', getQuotationRequestStats);
router.get('/:id', getQuotationRequestById);
router.patch('/:id/status', updateQuotationRequestStatus);
router.delete('/:id', deleteQuotationRequest);

export default router; 