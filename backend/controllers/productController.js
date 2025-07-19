import Product from '../models/Product.js';
import Category from '../models/Category.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

// @desc    Create Product
// @route   POST /api/products
// @access  Private - SuperAdmin Only
export const createProduct = async (req, res) => {
  try {
    const { name, sku, description, price, category, stock } = req.body;

    // Validation
    if (!name || !sku || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, sku, description, price, and category'
      });
    }

    if (name.length < 2 || name.length > 200) {
      return res.status(400).json({
        success: false,
        message: 'Name must be between 2 and 200 characters'
      });
    }

    if (sku.length < 2 || sku.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'SKU must be between 2 and 100 characters'
      });
    }

    // Check if SKU already exists
    const existingSKU = await Product.findOne({ sku });
    if (existingSKU) {
      return res.status(400).json({
        success: false,
        message: 'SKU must be unique. This SKU already exists.'
      });
    }

    if (description.length < 10 || description.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Description must be between 10 and 1000 characters'
      });
    }

    if (price < 0 || price > 999999.99) {
      return res.status(400).json({
        success: false,
        message: 'Price must be between 0 and 999,999.99'
      });
    }

    // Check if category exists and is active
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Category not found'
      });
    }

    if (!categoryExists.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create product in inactive category'
      });
    }

    // Validate flavors and sizes if provided
    if (req.body.flavors) {
      const Flavor = (await import('../models/Flavor.js')).default;
      const flavorIds = Array.isArray(req.body.flavors) ? req.body.flavors : [req.body.flavors];
      const validFlavors = await Flavor.find({ _id: { $in: flavorIds }, isActive: true });
      if (validFlavors.length !== flavorIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more flavors are invalid or inactive',
          debug: { provided: flavorIds, found: validFlavors.map(f => f._id.toString()) }
        });
      }
    }

    if (req.body.sizes) {
      const Size = (await import('../models/Size.js')).default;
      const sizeIds = Array.isArray(req.body.sizes) ? req.body.sizes : [req.body.sizes];
      const validSizes = await Size.find({ _id: { $in: sizeIds }, isActive: true });
      if (validSizes.length !== sizeIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more sizes are invalid or inactive',
          debug: { provided: sizeIds, found: validSizes.map(s => s._id.toString()) }
        });
      }
    }

    // Create product
    const product = await Product.create({
      name,
      sku,
      description,
      price: parseFloat(price),
      category,
      stock: stock ? parseInt(stock) : 0,
      flavors: Array.isArray(req.body.flavors) ? req.body.flavors : (req.body.flavors ? [req.body.flavors] : []),
      sizes: Array.isArray(req.body.sizes) ? req.body.sizes : (req.body.sizes ? [req.body.sizes] : [])
    });

    // Handle image upload if provided
    if (req.file) {
      try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'sergioind/products',
          width: 500,
          crop: 'scale'
        });
        // Update product with Cloudinary image info
        product.image = {
          public_id: result.public_id,
          url: result.secure_url
        };
        await product.save();
        // Delete file from server
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        console.error('Image upload error:', uploadError);
        // Continue without image if upload fails
      }
    }

    // Populate category info
    await product.populate('category', 'name');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
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
      search = '', 
      category, 
      minPrice, 
      maxPrice, 
      active,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Filter by active status
    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(query)
      .populate('category', 'name isActive')
      .populate('flavors', 'name description color isActive')
      .populate('sizes', 'name description isActive')
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
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// @desc    Get Product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name description isActive')
      .populate('flavors', 'name description color isActive')
      .populate('sizes', 'name description isActive');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
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
      search = '', 
      minPrice, 
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = { category: req.params.categoryId };
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('flavors', 'name description color isActive')
      .populate('sizes', 'name description isActive')
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
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
      error: error.message
    });
  }
};

// @desc    Update Product
// @route   PUT /api/products/:id
// @access  Private - SuperAdmin Only
export const updateProduct = async (req, res) => {
  try {
    const { name, sku, description, price, category, stock } = req.body;
    const updateData = {};

    // Validation for provided fields
    if (name) {
      if (name.length < 2 || name.length > 200) {
        return res.status(400).json({
          success: false,
          message: 'Name must be between 2 and 200 characters'
        });
      }
      updateData.name = name;
    }

    if (sku) {
      if (sku.length < 2 || sku.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'SKU must be between 2 and 100 characters'
        });
      }
      // Check if SKU is being updated and if it already exists
      const existingSKU = await Product.findOne({ sku, _id: { $ne: req.params.id } });
      if (existingSKU) {
        return res.status(400).json({
          success: false,
          message: 'SKU must be unique. This SKU already exists.'
        });
      }
      updateData.sku = sku;
    }

    if (description) {
      if (description.length < 10 || description.length > 1000) {
        return res.status(400).json({
          success: false,
          message: 'Description must be between 10 and 1000 characters'
        });
      }
      updateData.description = description;
    }

    if (price !== undefined) {
      if (price < 0 || price > 999999.99) {
        return res.status(400).json({
          success: false,
          message: 'Price must be between 0 and 999,999.99'
        });
      }
      updateData.price = parseFloat(price);
    }

    if (stock !== undefined) {
      if (stock < 0) {
        return res.status(400).json({
          success: false,
          message: 'Stock cannot be negative'
        });
      }
      updateData.stock = parseInt(stock);
    }
    if (req.body.flavors) {
      updateData.flavors = Array.isArray(req.body.flavors) ? req.body.flavors : [req.body.flavors];
    }
    if (req.body.sizes) {
      updateData.sizes = Array.isArray(req.body.sizes) ? req.body.sizes : [req.body.sizes];
    }

    // Validate flavors and sizes if being updated
    if (req.body.flavors) {
      const Flavor = (await import('../models/Flavor.js')).default;
      const flavorIds = Array.isArray(req.body.flavors) ? req.body.flavors : [req.body.flavors];
      const validFlavors = await Flavor.find({ _id: { $in: flavorIds }, isActive: true });
      if (validFlavors.length !== flavorIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more flavors are invalid or inactive',
          debug: { provided: flavorIds, found: validFlavors.map(f => f._id.toString()) }
        });
      }
    }

    if (req.body.sizes) {
      const Size = (await import('../models/Size.js')).default;
      const sizeIds = Array.isArray(req.body.sizes) ? req.body.sizes : [req.body.sizes];
      const validSizes = await Size.find({ _id: { $in: sizeIds }, isActive: true });
      if (validSizes.length !== sizeIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more sizes are invalid or inactive',
          debug: { provided: sizeIds, found: validSizes.map(s => s._id.toString()) }
        });
      }
    }

    // Check if category is being updated and if it exists and is active
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }

      if (!categoryExists.isActive) {
        return res.status(400).json({
          success: false,
          message: 'Cannot assign product to inactive category'
        });
      }
      updateData.category = category;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Handle image upload if provided
    if (req.file) {
      try {
        // Delete old image from Cloudinary if exists
        if (product.image.public_id) {
          await cloudinary.uploader.destroy(product.image.public_id);
        }
        // Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'sergioind/products',
          width: 500,
          crop: 'scale'
        });
        // Update product with new Cloudinary image info
        product.image = {
          public_id: result.public_id,
          url: result.secure_url
        };
        await product.save();
        // Delete file from server
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        console.error('Image upload error:', uploadError);
        // Continue without image if upload fails
      }
    }

    // Populate category info
    await product.populate('category', 'name');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
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
        message: 'Product not found'
      });
    }

    // Delete image from Cloudinary if exists
    if (product.image.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    // Remove image info from product
    product.image = {
      public_id: null,
      url: null
    };
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product image deleted successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product image',
      error: error.message
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
        message: 'Product not found'
      });
    }

    // Delete image from Cloudinary if exists
    if (product.image.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
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
        message: 'Product not found'
      });
    }

    product.isActive = !product.isActive;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling product status',
      error: error.message
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
        message: 'Stock must be a non-negative number'
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
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product stock updated successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating product stock',
      error: error.message
    });
  }
}; 