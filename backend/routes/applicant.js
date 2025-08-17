import express from "express";
import { 
    createApplicant,
    getAllApplicants,
    getApplicantById, 
    deleteApplicant
} from "../controllers/applicantController.js";
import { protect, authorize, permissions } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Public routes
router.post("/", upload.single("cv"), createApplicant);

// Protected routes
router.use(protect);
router.use(authorize("superadmin", "admin"));
router.use(permissions("Applicants"));

router.get('/', getAllApplicants);
router.get('/:id', getApplicantById);
router.delete('/:id', deleteApplicant);

export default router;
