import CV from "../models/CV.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// @desc    Create CV
// @route   POST /api/cv
// @access  Public
export const createCV = async (req, res) => {
  try {
    // Validate file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CV file is required",
      });
    }

    const file = req.file;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "sergioind/cvs",
      resource_type: "auto",
      use_filename: true,
      unique_filename: true,
    });

    // Save to DB
    const newCV = await CV.create({
      cv: {
        public_id: result.public_id,
        url: result.secure_url,
        originalName: file.originalname,
        cvType: file.mimetype,
        cvSize: file.size,
      },
    });

    // Delete temp file
    fs.unlink(file.path, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });

    res.status(201).json({
      success: true,
      message: "CV created successfully",
      data: newCV,
    });
  } catch (error) {
    // Clean up temp file if error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error cleaning up temp file:", err);
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating CV",
      error: error.message,
    });
  }
};

// @desc    Get all CVs
// @route   GET /api/cv
// @access  Private
export const getAllCVs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {};

    if (search) {
      const orConditions = [
        { "cv.originalName": { $regex: search, $options: "i" } },
        { "cv.cvType": { $regex: search, $options: "i" } },
      ];

      query.$or = orConditions;
    }

    const cvs = await CV.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 }); // newest first

    const total = await CV.countDocuments(query);

    res.status(200).json({
      success: true,
      data: cvs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching CVs",
      error: error.message,
    });
  }
};

// @desc    Delete CV
// @route   DELETE /api/cv/:id
// @access  Public
export const deleteCV = async (req, res) => {
  try {
    const cv = await CV.findById(req.params.id);
    if (!cv) {
      return res.status(404).json({
        success: false,
        message: "CV not found",
      });
    }

    // Delete from Cloudinary
    if (cv.cv.public_id) {
      await cloudinary.uploader.destroy(cv.cv.public_id, {
        resource_type: "raw",
      });
    }

    // Delete from DB
    await cv.deleteOne();

    res.status(200).json({
      success: true,
      message: "CV deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting CV",
      error: error.message,
    });
  }
};
