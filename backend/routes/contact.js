import express from 'express';
const router = express.Router();
import {
    createContact,
    getAllContacts,
    getContactById,
    updateContactStatus,
    deleteContact,
    getContactStats 
} from '../controllers/contactController.js';
import { protect, authorize, permissions } from '../middleware/auth.js';

// Public routes (no authentication required)
router.post('/', createContact);

// Admin routes (authentication required)
router.use(protect);
router.use(authorize('superadmin', 'admin'));
router.use(permissions('Contact-us'));

router.get('/', getAllContacts);
router.get('/stats', getContactStats);
router.get('/:id', getContactById);
router.patch('/:id/status', updateContactStatus);
router.delete('/:id', deleteContact);

export default router; 