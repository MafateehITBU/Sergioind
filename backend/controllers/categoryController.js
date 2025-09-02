import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import { translateText } from "../utils/translate.js";

// @desc    Create Category
// @route   POST /api/categories
// @access  Private - SuperAdmin Only
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Please provide name",
      });
    }

    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 100 characters",
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    // Translate name, description in parallel
    const descriptionAr = await translateText(description, "ar");

    // Create category
    const category = await Category.create({
      name,
      description,
      descriptionAr,
    });

    // Handle image upload if provided
    if (req.file) {
      try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "sergioind/categories",
          width: 400,
          crop: "scale",
        });
        // Update category with Cloudinary image info
        category.image = {
          public_id: result.public_id,
          url: result.secure_url,
        };
        await category.save();
        // Delete file from server
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        console.error("Image upload error:", uploadError);
        // Continue without image if upload fails
      }
    }

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: "Error creating category",
      error: error.message,
    });
  }
};

// @desc    Get all Categories
// @route   GET /api/categories
// @access  Public
export const getAllCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", active } = req.query;

    const query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by active status
    if (active !== undefined) {
      query.isActive = active === "true";
    }

    const categories = await Category.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Category.countDocuments(query);

    res.status(200).json({
      success: true,
      data: categories,
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
      message: "Error fetching categories",
      error: error.message,
    });
  }
};

// @desc    Get Category by ID
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching category",
      error: error.message,
    });
  }
};

// @desc    Update Category
// @route   PUT /api/categories/:id
// @access  Private - SuperAdmin Only
export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const updateData = {};

    // Validation for provided fields
    if (name) {
      if (name.length < 2 || name.length > 100) {
        return res.status(400).json({
          success: false,
          message: "Name must be between 2 and 100 characters",
        });
      }
      updateData.name = name;
    }

    if (description) {
      if (description.length < 10 || description.length > 500) {
        return res.status(400).json({
          success: false,
          message: "Description must be between 10 and 500 characters",
        });
      }
      updateData.description = description;
      updateData.descriptionAr = await translateText(description, "ar");
    }

    // Check if name is being updated and if it already exists
    if (name) {
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${name}$`, "i") },
        _id: { $ne: req.params.id },
      });
      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: "Category with this name already exists",
        });
      }
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Handle image upload if provided
    if (req.file) {
      try {
        // Delete old image from Cloudinary if exists
        if (category.image.public_id) {
          await cloudinary.uploader.destroy(category.image.public_id);
        }
        // Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "sergioind/categories",
          width: 400,
          crop: "scale",
        });
        // Update category with new Cloudinary image info
        category.image = {
          public_id: result.public_id,
          url: result.secure_url,
        };
        await category.save();
        // Delete file from server
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        console.error("Image upload error:", uploadError);
        // Continue without image if upload fails
      }
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: "Error updating category",
      error: error.message,
    });
  }
};

// @desc    Delete Category Image
// @route   DELETE /api/categories/:id/delete-image
// @access  Private - SuperAdmin Only
export const deleteCategoryImage = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Delete image from Cloudinary if exists
    if (category.image.public_id) {
      await cloudinary.uploader.destroy(category.image.public_id);
    }

    // Remove image info from category
    category.image = {
      public_id: null,
      url: null,
    };
    await category.save();

    res.status(200).json({
      success: true,
      message: "Category image deleted successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting category image",
      error: error.message,
    });
  }
};

// @desc    Delete Category
// @route   DELETE /api/categories/:id
// @access  Private - SuperAdmin Only
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Check if category has products
    const Product = (await import("../models/Product.js")).default;
    const productsCount = await Product.countDocuments({
      category: req.params.id,
    });

    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${productsCount} product(s) associated with it. Please remove or reassign the products first.`,
      });
    }

    // Delete image from Cloudinary if exists
    if (category.image.public_id) {
      await cloudinary.uploader.destroy(category.image.public_id);
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting category",
      error: error.message,
    });
  }
};

// @desc    Toggle Category Status
// @route   PATCH /api/categories/:id/toggle-status
// @access  Private - SuperAdmin Only
export const toggleCategoryStatus = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.isActive = !category.isActive;
    await category.save();

    res.status(200).json({
      success: true,
      message: `Category ${
        category.isActive ? "activated" : "deactivated"
      } successfully`,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error toggling category status",
      error: error.message,
    });
  }
};
