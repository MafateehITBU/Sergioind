import express from "express";
import { body } from 'express-validator';
import { createGallery,
    getAllGalleries,
    getGalleryById,
    updateGallery,
    toggleGalleryStatus,
    deleteGallery,
 } from "../controllers/galleryController.js";
import { protect, authorize, permissions } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Validation rules
const galleryValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Gallery title is required")
    .isLength({ min: 2, max: 200 })
    .withMessage("Gallery title must be between 2 and 200 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Gallery description is required")
    .isLength({ min: 10, max: 1000 })
    .withMessage("Gallery description must be between 10 and 1000 characters"),
];

// Routes
router.get("/", getAllGalleries);
router.get("/:id", getGalleryById);

// Protected routes - SuperAdmin only
router.use(protect);
router.use(authorize('superadmin', 'admin'));
router.use(permissions('Gallery'));

router.post("/", upload.array("images", 10), galleryValidation, validate, createGallery);
router.put("/:id", upload.array("images", 10), updateGallery);
router.put("/:id/status", toggleGalleryStatus);
router.delete("/:id", deleteGallery);

export default router;