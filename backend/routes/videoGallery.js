import express from "express";
import {
  createVideoGallery,
  getVideoGalleries,
  getVideoGalleryById,
  updateVideoGallery,
  deleteVideoGallery,
  toggleVideoGalleryActive,
} from "../controllers/videoGalleryController.js";
import { protect, authorize, permissions } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.get("/", getVideoGalleries);
router.get("/:id", getVideoGalleryById);

// Protected routes (admin, super-admin)
router.use(protect);
router.use(authorize("superadmin", "admin"));
router.use(permissions("VideoGallery"));
router.post("/", createVideoGallery);
router.put("/:id", updateVideoGallery);
router.delete("/:id", deleteVideoGallery);
router.put("/:id/toggle-active", toggleVideoGalleryActive);

export default router;
