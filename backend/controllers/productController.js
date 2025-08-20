import Product from "../models/Product.js";
import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import { translateText } from "../utils/translate.js";

// @desc    Create Product
// @route   POST /api/products
// @access  Private - SuperAdmin Only
export const createProduct = async (req, res) => {
  try {
    let { name, sku, description, category, stock, details, flavors, sizes } =
      req.body;

    // Parse JSON strings if sent as strings
    if (sizes && typeof sizes === "string") {
      try {
        sizes = JSON.parse(sizes);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Sizes must be a valid JSON array",
        });
      }
    }

    if (details && typeof details === "string") {
      try {
        details = JSON.parse(details);
      } catch {
        details = [details];
      }
    }

    // Validation
    if (!name || !sku || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, sku, description, and category",
      });
    }

    if (name.length < 2 || name.length > 200) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 200 characters",
      });
    }

    if (sku.length < 2 || sku.length > 100) {
      return res.status(400).json({
        success: false,
        message: "SKU must be between 2 and 100 characters",
      });
    }

    const existingSKU = await Product.findOne({ sku });
    if (existingSKU) {
      return res.status(400).json({
        success: false,
        message: "SKU must be unique. This SKU already exists.",
      });
    }

    if (description.length < 10 || description.length > 1000) {
      return res.status(400).json({
        success: false,
        message: "Description must be between 10 and 1000 characters",
      });
    }

    // Check category
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res
        .status(400)
        .json({ success: false, message: "Category not found" });
    }
    if (!categoryExists.isActive) {
      return res.status(400).json({
        success: false,
        message: "Cannot create product in inactive category",
      });
    }

    // Validate flavors
    if (flavors) {
      const Flavor = (await import("../models/Flavor.js")).default;
      const flavorIds = Array.isArray(flavors) ? flavors : [flavors];
      const validFlavors = await Flavor.find({
        _id: { $in: flavorIds },
        isActive: true,
      });
      if (validFlavors.length !== flavorIds.length) {
        return res.status(400).json({
          success: false,
          message: "One or more flavors are invalid or inactive",
        });
      }
    }

    // Translate fields to Arabic
    const nameAr = await translateText(name, "ar");
    const descriptionAr = await translateText(description, "ar");
    const detailsAr = details
      ? await Promise.all(details.map((d) => translateText(d, "ar")))
      : [];

    // Create product
    const product = await Product.create({
      name,
      nameAr,
      sku,
      description,
      descriptionAr,
      details: Array.isArray(details) ? details : [],
      detailsAr,
      category,
      stock: stock ? parseInt(stock) : 0,
      flavors: Array.isArray(flavors) ? flavors : flavors ? [flavors] : [],
      sizes: Array.isArray(sizes) ? sizes : [],
    });

    // Handle image upload
    if (req.files && req.files.length > 0) {
      const uploadedImages = [];
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "sergioind/products",
            width: 500,
            crop: "scale",
          });
          uploadedImages.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
          fs.unlinkSync(file.path);
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          fs.unlinkSync(file.path);
        }
      }
      product.image = uploadedImages;
      await product.save();
    }

    await product.populate("category", "name");

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({
      success: false,
      message: "Error creating product",
      error: error.message,
    });
  }
};

// @desc    Get all Products
// @route   GET /api/products
// @access  Public
export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      category,
      active,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (category) query.category = category;
    if (active !== undefined) query.isActive = active === "true";

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const products = await Product.find(query)
      .populate("category", "name isActive")
      .populate("flavors", "name description color isActive")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: products,
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
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// @desc    Get Product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name description isActive")
      .populate("flavors", "name description color isActive");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

// @desc    Get Products by Category
// @route   GET /api/products/category/:categoryId
// @access  Public
export const getProductsByCategory = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const query = { category: req.params.categoryId };

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const products = await Product.find(query)
      .populate("category", "name")
      .populate("flavors", "name description color isActive")
      .populate("sizes", "name description isActive")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: products,
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
      message: "Error fetching products by category",
      error: error.message,
    });
  }
};

// @desc    Update Product
// @route   PUT /api/products/:id
// @access  Private - SuperAdmin Only
export const updateProduct = async (req, res) => {
  try {
    let { name, sku, description, category, stock, details, flavors, sizes } =
      req.body;
    const updateData = {};

    // Parse JSON strings if sent as strings
    if (sizes && typeof sizes === "string") {
      try {
        sizes = JSON.parse(sizes);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Sizes must be a valid JSON array",
        });
      }
    }

    if (details && typeof details === "string") {
      try {
        details = JSON.parse(details);
      } catch {
        // If single string, wrap in array
        details = [details];
      }
    }

    // FIELD VALIDATIONS + TRANSLATIONS

    if (name) {
      if (name.length < 2 || name.length > 200) {
        return res.status(400).json({
          success: false,
          message: "Name must be between 2 and 200 characters",
        });
      }
      updateData.name = name;
      updateData.nameAr = await translateText(name);
    }

    if (sku) {
      if (sku.length < 2 || sku.length > 100) {
        return res.status(400).json({
          success: false,
          message: "SKU must be between 2 and 100 characters",
        });
      }
      const existingSKU = await Product.findOne({
        sku,
        _id: { $ne: req.params.id },
      });
      if (existingSKU) {
        return res.status(400).json({
          success: false,
          message: "SKU must be unique. This SKU already exists.",
        });
      }
      updateData.sku = sku;
    }

    if (description) {
      if (description.length < 10 || description.length > 1000) {
        return res.status(400).json({
          success: false,
          message: "Description must be between 10 and 1000 characters",
        });
      }
      updateData.description = description;
      updateData.descriptionAr = await translateText(description);
    }

    if (stock !== undefined) {
      if (stock < 0)
        return res
          .status(400)
          .json({ success: false, message: "Stock cannot be negative" });
      updateData.stock = parseInt(stock);
    }

    if (details) {
      updateData.details = [];
      for (const d of Array.isArray(details) ? details : [details]) {
        updateData.details.push(d);
        updateData.detailsAr.push(await translateText(d));
      }
    }

    if (flavors) {
      updateData.flavors = Array.isArray(flavors) ? flavors : [flavors];
    }

    if (sizes) {
      updateData.sizes = [];
      for (const s of sizes) {
        updateData.sizes.push({
          name: s.name,
          weight: s.weight,
        });
      }
    }

    // VALIDATE FLAVORS
    if (flavors) {
      const Flavor = (await import("../models/Flavor.js")).default;
      const flavorIds = Array.isArray(flavors) ? flavors : [flavors];
      const validFlavors = await Flavor.find({
        _id: { $in: flavorIds },
        isActive: true,
      });
      if (validFlavors.length !== flavorIds.length) {
        return res.status(400).json({
          success: false,
          message: "One or more flavors are invalid or inactive",
        });
      }
    }

    // VALIDATE CATEGORY
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists)
        return res
          .status(400)
          .json({ success: false, message: "Category not found" });
      if (!categoryExists.isActive) {
        return res.status(400).json({
          success: false,
          message: "Cannot assign product to inactive category",
        });
      }
      updateData.category = category;
    }

    // UPDATE PRODUCT
    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    // HANDLE IMAGES
    if (req.files && req.files.length > 0) {
      const uploadedImages = [];
      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "sergioind/products",
            width: 500,
            crop: "scale",
          });

          uploadedImages.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
          fs.unlinkSync(file.path);
        } catch (uploadError) {
          console.error("Image upload error:", uploadError);
          fs.unlinkSync(file.path);
        }
      }
      product.image.push(...uploadedImages);
      await product.save();
    }

    await product.populate("category", "name");

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({
      success: false,
      message: "Error updating product",
      error: error.message,
    });
  }
};

// @desc    Delete Product Image
// @route   DELETE /api/products/:id/delete-image
// @access  Private - SuperAdmin Only
export const deleteProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete image from Cloudinary if exists
    if (product.image.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    // Remove image info from product
    product.image = {
      public_id: null,
      url: null,
    };
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product image deleted successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product image",
      error: error.message,
    });
  }
};

// @desc    Delete Product
// @route   DELETE /api/products/:id
// @access  Private - SuperAdmin Only
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete image from Cloudinary if exists
    if (product.image.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

// @desc    Toggle Product Status
// @route   PATCH /api/products/:id/toggle-status
// @access  Private - SuperAdmin Only
export const toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${
        product.isActive ? "activated" : "deactivated"
      } successfully`,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error toggling product status",
      error: error.message,
    });
  }
};

// @desc    Update Product Stock
// @route   PATCH /api/products/:id/stock
// @access  Private - SuperAdmin Only
export const updateProductStock = async (req, res) => {
  try {
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock must be a non-negative number",
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stock: parseInt(stock) },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product stock updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating product stock",
      error: error.message,
    });
  }
};
