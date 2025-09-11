import mongoose from "mongoose";
import Applicant from "../models/Applicant.js";
import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import { sendApplicantEmail } from "../utils/sendApplicantEmail.js";

const GENDER = ["Male", "Female"];
const GOVERNORATE = [
  "Amman",
  "Zarqa",
  "Irbid",
  "Aqaba",
  "Mafraq",
  "Jerash",
  "Ajloun",
  "Balqa",
  "Madaba",
  "Karak",
  "Tafileh",
  "Maan",
];

// @desc    Create Applicant
// @route   POST /api/applicant
// @access  Public
export const createApplicant = async (req, res) => {
  try {
    const {
      postId,
      name,
      phoneNumber,
      speciality,
      experienceYears,
      gender,
      email,
    } = req.body;

    const address = req.body.address ? JSON.parse(req.body.address) : undefined;

    // Basic field validation
    if (
      !postId ||
      !name ||
      !phoneNumber ||
      !speciality ||
      experienceYears === undefined ||
      !gender ||
      !email ||
      !address ||
      !address.governorate
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the required fields",
      });
    }

    // Check if Post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if job expired
    if (new Date() > post.endDate) {
      return res.status(400).json({
        success: false,
        message: "Job application is closed. End date has passed.",
      });
    }

    // Check if applicant with same email already applied to this post
    const existingApplicant = await Applicant.findOne({ postId, email });
    if (existingApplicant) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to this job with this email.",
      });
    }

    // Name validation
    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 50 characters",
      });
    }

    const phoneRegex =
      /^(\+?1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid phone number",
      });
    }

    // Speciality validation
    if (speciality.length < 2 || speciality.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Speciality must be between 2 and 100 characters",
      });
    }

    // Experience validation
    const exp = Number(experienceYears);
    if (isNaN(exp) || exp < 0) {
      return res.status(400).json({
        success: false,
        message: "Experience years must be a non-negative number",
      });
    }

    // Gender validation
    if (!GENDER.includes(gender)) {
      return res.status(400).json({
        success: false,
        message: `Gender must be one of: ${GENDER.join(", ")}`,
      });
    }

    // governorate validation
    if (!GOVERNORATE.includes(address.governorate)) {
      return res.status(400).json({
        success: false,
        message: `Governorate must be one of: ${GOVERNORATE.join(", ")}`,
      });
    }

    // File validation: only one file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CV file is required",
      });
    }

    // Create applicant entry first
    const applicant = await Applicant.create({
      postId,
      name,
      phoneNumber,
      email,
      speciality,
      experienceYears: exp,
      gender,
      address,
    });

    // Handle CV file upload
    try {
      const file = req.file;

      const result = await cloudinary.uploader.upload(file.path, {
        folder: "sergioind/applicantsCV",
        resource_type: "auto",
        use_filename: true,
        unique_filename: true,
        type: "upload",
      });

      applicant.cv = {
        public_id: result.public_id,
        url: result.secure_url,
        originalName: file.originalname,
        cvType: file.mimetype,
        cvSize: file.size,
      };

      await applicant.save();

      try {
        await sendApplicantEmail({
          name,
          email,
          phoneNumber,
          speciality,
          experienceYears: exp,
          gender,
          address,
          postTitle: post.title,
          cvPath: file.path, // local CV path
          cvOriginalName: file.originalname, // CV filename
        });
      } catch (emailError) {
        console.error("Error sending applicant email:", emailError);
      }

      // Delete temporary file
      fs.unlinkSync(file.path);
    } catch (uploadError) {
      console.error("CV upload error:", uploadError);
      await Applicant.findByIdAndDelete(applicant._id);
      return res.status(500).json({
        success: false,
        message: "Error uploading CV",
        error: uploadError.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "Applicant created successfully",
      data: applicant,
    });
  } catch (error) {
    // Clean up temporary file if something went wrong
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: "Error creating applicant",
      error: error.message,
    });
  }
};

// @desc    Get all applicants
// @route   GET /api/applicants
// @access  Private
export const getAllApplicants = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", postId, status } = req.query;

    const query = {};

    // Always filter by postId if provided
    if (postId && mongoose.Types.ObjectId.isValid(postId)) {
      query.postId = postId;
    }

    if (search) {
      const orConditions = [
        { name: { $regex: search, $options: "i" } },
        { speciality: { $regex: search, $options: "i" } },
        { gender: { $regex: search, $options: "i" } },
      ];

      if (!isNaN(search)) {
        orConditions.push({ experienceYears: Number(search) });
      }

      query.$or = orConditions;
    }

    const applicants = await Applicant.find(query)
      .populate({
        path: "postId",
        select: "title description",
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 });

    const total = await Applicant.countDocuments(query);

    res.status(200).json({
      success: true,
      data: applicants,
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
      message: "Error fetching applicants",
      error: error.message,
    });
  }
};

// @desc    Get Applicant by ID
// @route   GET /api/applicants/:id
// @access  Private
export const getApplicantById = async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id).populate({
      path: "postId",
      select: "title description",
    });

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    res.status(200).json({
      success: true,
      data: applicant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching applicant",
      error: error.message,
    });
  }
};

// @desc    Delete Applicant
// @route   DELETE /api/applicant/:id
// @access  Private
export const deleteApplicant = async (req, res) => {
  try {
    const applicant = await Applicant.findById(req.params.id);

    if (!applicant) {
      return res.status(404).json({
        success: false,
        message: "Applicant not found",
      });
    }

    // Delete the applicant
    await Applicant.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Applicant deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting applicant",
      error: error.message,
    });
  }
};
