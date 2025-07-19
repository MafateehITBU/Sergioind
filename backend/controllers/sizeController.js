import Size from '../models/Size.js';

// @desc    Create Size
// @route   POST /api/sizes
// @access  Private - SuperAdmin Only
export const createSize = async (req, res) => {
  try {
    const { name, description, order } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Size name is required'
      });
    }

    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Size name must be between 2 and 50 characters'
      });
    }

    // Check if size already exists
    const existingSize = await Size.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingSize) {
      return res.status(400).json({
        success: false,
        message: 'Size with this name already exists'
      });
    }

    // Create size
    const size = await Size.create({
      name,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Size created successfully',
      data: size
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating size',
      error: error.message
    });
  }
};

// @desc    Get all Sizes
// @route   GET /api/sizes
// @access  Public
export const getAllSizes = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', active } = req.query;

    const query = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by active status
    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    const sizes = await Size.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 });

    const total = await Size.countDocuments(query);

    res.status(200).json({
      success: true,
      data: sizes,
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
      message: 'Error fetching sizes',
      error: error.message
    });
  }
};

// @desc    Get Size by ID
// @route   GET /api/sizes/:id
// @access  Public
export const getSizeById = async (req, res) => {
  try {
    const size = await Size.findById(req.params.id);
    
    if (!size) {
      return res.status(404).json({
        success: false,
        message: 'Size not found'
      });
    }

    res.status(200).json({
      success: true,
      data: size
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching size',
      error: error.message
    });
  }
};

// @desc    Update Size
// @route   PUT /api/sizes/:id
// @access  Private - SuperAdmin Only
export const updateSize = async (req, res) => {
  try {
    const { name, description } = req.body;
    const updateData = {};

    // Validation for provided fields
    if (name) {
      if (name.length < 2 || name.length > 50) {
        return res.status(400).json({
          success: false,
          message: 'Size name must be between 2 and 50 characters'
        });
      }
      updateData.name = name;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    // Check if name is being updated and if it already exists
    if (name) {
      const existingSize = await Size.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id } 
      });
      if (existingSize) {
        return res.status(400).json({
          success: false,
          message: 'Size with this name already exists'
        });
      }
    }

    const size = await Size.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!size) {
      return res.status(404).json({
        success: false,
        message: 'Size not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Size updated successfully',
      data: size
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating size',
      error: error.message
    });
  }
};

// @desc    Delete Size
// @route   DELETE /api/sizes/:id
// @access  Private - SuperAdmin Only
export const deleteSize = async (req, res) => {
  try {
    const size = await Size.findById(req.params.id);
    
    if (!size) {
      return res.status(404).json({
        success: false,
        message: 'Size not found'
      });
    }

    // Check if size is used in any products
    const Product = (await import('../models/Product.js')).default;
    const productsCount = await Product.countDocuments({ sizes: req.params.id });
    
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete size. It is used in ${productsCount} product(s). Please remove it from products first.`
      });
    }

    await Size.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Size deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting size',
      error: error.message
    });
  }
};

// @desc    Toggle Size Status
// @route   PATCH /api/sizes/:id/toggle-status
// @access  Private - SuperAdmin Only
export const toggleSizeStatus = async (req, res) => {
  try {
    const size = await Size.findById(req.params.id);
    
    if (!size) {
      return res.status(404).json({
        success: false,
        message: 'Size not found'
      });
    }

    size.isActive = !size.isActive;
    await size.save();

    res.status(200).json({
      success: true,
      message: `Size ${size.isActive ? 'activated' : 'deactivated'} successfully`,
      data: size
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling size status',
      error: error.message
    });
  }
}; 