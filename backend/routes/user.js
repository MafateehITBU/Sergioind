import express from 'express';
import { body } from 'express-validator';
import {
    registerUser,
    loginUser,
    getCurrentUser,
    getAllUsers,
    updateUser,
    deleteImage,
    deleteUser,
    logoutUser,
    getAvatarOptions,
    sendOTP,
    verifyOTP,
    changePassword
} from '../controllers/userController.js';
import { protect, authorize, permissions } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Validation rules
const registerValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('phoneNumber')
        .trim()
        .notEmpty()
        .withMessage('Phone number is required')
        .matches(/^(\+?1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/)
        .withMessage('Please enter a valid phone number')
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

const updateValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email'),
    body('phoneNumber')
        .optional()
        .trim()
        .matches(/^(\+?1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/)
        .withMessage('Please enter a valid phone number')
];

const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .notEmpty()
        .withMessage('New password is required')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters')
];

// Public routes
router.post('/register', upload.single('image'), registerValidation, validate, registerUser);
router.post('/login', loginValidation, validate, loginUser);
router.put('/send-otp', sendOTP);
router.post('/verify-otp',  verifyOTP);

// Protected routes (user must be logged in)
router.use(protect);
router.get('/me', getCurrentUser);
router.post('/logout', authorize('user'), logoutUser);
router.put('/change-password', authorize('user'), changePasswordValidation, validate, changePassword);
router.get('/:id/avatar-options', authorize('user'), getAvatarOptions);
router.put('/:id', updateValidation, upload.single('image'), updateUser);
router.delete('/:id/delete-image', deleteImage);

// Admin & SuperAdmin routes
router.use(authorize('admin', 'superadmin'));
router.use(permissions('Users'));

router.get('/', getAllUsers);
router.delete('/:id', deleteUser);

export default router;