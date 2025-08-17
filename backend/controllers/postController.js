import Post from "../models/Post.js";

const EMPLOYMENT_TYPES = ["Full-time", "Part-time"];
const LOCATIONS = ["On-site", "Remote", "Hybrid"];

// @desc    Create Post
// @route   POST /api/post
// @access  Private
export const createPost = async (req, res) => {
  try {
    const {
      title,
      description,
      employmentType,
      location,
      experienceYears,
      speciality,
      endDate,
    } = req.body;

    // Required fields check
    if (
      !title ||
      !description ||
      !employmentType ||
      !location ||
      experienceYears === undefined ||
      !speciality ||
      !endDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Title validation
    if (title.length < 2 || title.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Post title must be between 2 and 100 characters",
      });
    }

    // Enum validation
    if (!EMPLOYMENT_TYPES.includes(employmentType)) {
      return res.status(400).json({
        success: false,
        message: `Employment type must be one of: ${EMPLOYMENT_TYPES.join(
          ", "
        )}`,
      });
    }

    if (!LOCATIONS.includes(location)) {
      return res.status(400).json({
        success: false,
        message: `Location must be one of: ${LOCATIONS.join(", ")}`,
      });
    }

    // Experience years validation
    if (experienceYears < 0) {
      return res.status(400).json({
        success: false,
        message: "Experience years cannot be negative",
      });
    }

    // End date validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(endDate) <= today) {
      return res.status(400).json({
        success: false,
        message: "End date must be a future date",
      });
    }

    const post = await Post.create({
      title,
      description,
      employmentType,
      location,
      experienceYears,
      speciality,
      endDate: new Date(endDate),
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating post",
      error: error.message,
    });
  }
};

// @desc    Get All Post
// @route   GET /api/post
// @access  Public
export const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", active } = req.query;

    const query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const posts = await Post.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 });

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      data: posts,
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
      message: "Error fetching posts",
      error: error.message,
    });
  }
};

// @desc    Get Post by ID
// @route   GET /api/post/:id
// @access  Public
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching post",
      error: error.message,
    });
  }
};

// @desc    Update Post
// @route   PUT /api/post/:id
// @access  Private
export const updatePost = async (req, res) => {
  try {
    const {
      title,
      description,
      employmentType,
      location,
      experienceYears,
      speciality,
      endDate,
    } = req.body;
    const updateData = {};

    // Title validation
    if (title !== undefined) {
      if (title.length < 2 || title.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Post title must be between 2 and 100 characters",
        });
      }
      updateData.title = title;
    }

    // Description
    if (description !== undefined) {
      updateData.description = description;
    }

    // Employment type enum
    if (employmentType !== undefined) {
      if (!EMPLOYMENT_TYPES.includes(employmentType)) {
        return res.status(400).json({
          success: false,
          message: `Employment type must be one of: ${EMPLOYMENT_TYPES.join(
            ", "
          )}`,
        });
      }
      updateData.employmentType = employmentType;
    }

    // Location enum
    if (location !== undefined) {
      if (!LOCATIONS.includes(location)) {
        return res.status(400).json({
          success: false,
          message: `Location must be one of: ${LOCATIONS.join(", ")}`,
        });
      }
      updateData.location = location;
    }

    // Experience years
    if (experienceYears !== undefined) {
      if (experienceYears < 0) {
        return res.status(400).json({
          success: false,
          message: "Experience years cannot be negative",
        });
      }
      updateData.experienceYears = experienceYears;
    }

    // Speciality
    if (speciality !== undefined) {
      if (speciality.trim().length === 0 || speciality.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Speciality must be non-empty and not exceed 100 characters",
        });
      }
      updateData.speciality = speciality;
    }

    // End date validation
    if (endDate !== undefined) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(endDate) <= today) {
        return res.status(400).json({
          success: false,
          message: "End date must be a future date",
        });
      }
      updateData.endDate = new Date(endDate);
    }

    const post = await Post.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating post",
      error: error.message,
    });
  }
};

// @desc    Delete Post
// @route   DELETE /api/post/:id
// @access  Private
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Import Applicant model
    const Applicant = (await import("../models/Applicant.js")).default;

    // Delete all applicants linked to this post
    await Applicant.deleteMany({ postId: req.params.id });

    // Delete the post itself
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Post and associated applicants deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting post",
      error: error.message,
    });
  }
};
