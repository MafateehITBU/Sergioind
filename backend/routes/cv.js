import express from "express";
import {
    createCV,
    getAllCVs,
    deleteCV
} from "../controllers/cvController.js";
import { protect, authorize, permissions } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.post("/", upload.single("cv"), createCV);

// Protected routes
router.use(protect);
router.use(authorize("superadmin", "admin"));
router.use(permissions("Cvs"));

router.get('/', getAllCVs);
router.delete('/:id', deleteCV);

export default router;