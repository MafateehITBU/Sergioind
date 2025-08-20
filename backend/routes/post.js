import express from "express";
import { body } from "express-validator";
import {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost
 } from "../controllers/postController.js";
import { protect, authorize, permissions } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

// Validation rules
const postValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Post title is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Post title must be between 2 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Post description is required"),

  body("endDate").trim().notEmpty().withMessage("End Date is required"),
];

const updatePostValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Post title must be between 2 and 100 characters"),

  body("endDate")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("End Date is required"),
];

// Public routes
router.get('/', getPosts);
router.get('/:id', getPostById);

// Protected routes
router.use(protect);
router.use(authorize("superadmin", "admin"));
router.use(permissions("Posts"));

router.post("/", postValidation, validate, createPost);
router.put('/:id', updatePostValidation, validate, updatePost);
router.delete('/:id', deletePost);

export default router;
