import Flavor from '../models/Flavor.js';

// @desc    Create Flavor
// @route   POST /api/flavors
// @access  Private - SuperAdmin Only
export const createFlavor = async (req, res) => {
  try {
    const { name, description, color } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Flavor name is required'
      });
    }

    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Flavor name must be between 2 and 100 characters'
      });
    }

    // Check if flavor already exists
    const existingFlavor = await Flavor.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingFlavor) {
      return res.status(400).json({
        success: false,
        message: 'Flavor with this name already exists'
      });
    }

    // Create flavor
    const flavor = await Flavor.create({
      name,
      description,
      color
    });

    res.status(201).json({
      success: true,
      message: 'Flavor created successfully',
      data: flavor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating flavor',
      error: error.message
    });
  }
};

// @desc    Get all Flavors
// @route   GET /api/flavors
// @access  Public
export const getAllFlavors = async (req, res) => {
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

    const flavors = await Flavor.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 });

    const total = await Flavor.countDocuments(query);

    res.status(200).json({
      success: true,
      data: flavors,
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
      message: 'Error fetching flavors',
      error: error.message
    });
  }
};

// @desc    Get Flavor by ID
// @route   GET /api/flavors/:id
// @access  Public
export const getFlavorById = async (req, res) => {
  try {
    const flavor = await Flavor.findById(req.params.id);
    
    if (!flavor) {
      return res.status(404).json({
        success: false,
        message: 'Flavor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: flavor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching flavor',
      error: error.message
    });
  }
};

// @desc    Update Flavor
// @route   PUT /api/flavors/:id
// @access  Private - SuperAdmin Only
export const updateFlavor = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const updateData = {};

    // Validation for provided fields
    if (name) {
      if (name.length < 2 || name.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'Flavor name must be between 2 and 100 characters'
        });
      }
      updateData.name = name;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (color !== undefined) {
      updateData.color = color;
    }

    // Check if name is being updated and if it already exists
    if (name) {
      const existingFlavor = await Flavor.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: req.params.id } 
      });
      if (existingFlavor) {
        return res.status(400).json({
          success: false,
          message: 'Flavor with this name already exists'
        });
      }
    }

    const flavor = await Flavor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!flavor) {
      return res.status(404).json({
        success: false,
        message: 'Flavor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Flavor updated successfully',
      data: flavor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating flavor',
      error: error.message
    });
  }
};

// @desc    Delete Flavor
// @route   DELETE /api/flavors/:id
// @access  Private - SuperAdmin Only
export const deleteFlavor = async (req, res) => {
  try {
    const flavor = await Flavor.findById(req.params.id);
    
    if (!flavor) {
      return res.status(404).json({
        success: false,
        message: 'Flavor not found'
      });
    }

    // Check if flavor is used in any products
    const Product = (await import('../models/Product.js')).default;
    const productsCount = await Product.countDocuments({ flavors: req.params.id });
    
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete flavor. It is used in ${productsCount} product(s). Please remove it from products first.`
      });
    }

    await Flavor.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Flavor deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting flavor',
      error: error.message
    });
  }
};

// @desc    Toggle Flavor Status
// @route   PATCH /api/flavors/:id/toggle-status
// @access  Private - SuperAdmin Only
export const toggleFlavorStatus = async (req, res) => {
  try {
    const flavor = await Flavor.findById(req.params.id);
    
    if (!flavor) {
      return res.status(404).json({
        success: false,
        message: 'Flavor not found'
      });
    }

    flavor.isActive = !flavor.isActive;
    await flavor.save();

    res.status(200).json({
      success: true,
      message: `Flavor ${flavor.isActive ? 'activated' : 'deactivated'} successfully`,
      data: flavor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling flavor status',
      error: error.message
    });
  }
}; 