import FileCenter from '../models/FileCenter.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import path from 'path';

// @desc    Create FileCenter Entry
// @route   POST /api/filecenter
// @access  Private - SuperAdmin Only
export const createFileCenter = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name and description'
      });
    }

    if (name.length < 2 || name.length > 200) {
      return res.status(400).json({
        success: false,
        message: 'Name must be between 2 and 200 characters'
      });
    }

    if (description.length < 10 || description.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Description must be between 10 and 1000 characters'
      });
    }

    // Check if file is provided
    if (!req.files || !req.files.file) {
      return res.status(400).json({
        success: false,
        message: 'File is required'
      });
    }

    // Create file center entry
    const fileCenter = await FileCenter.create({
      name,
      description
    });

    // Handle file upload
    try {
      const file = req.files.file[0];
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'sergioind/files',
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true,
        type: 'upload'
      });

      // Update file center with file info
      fileCenter.file = {
        public_id: result.public_id,
        url: result.secure_url,
        originalName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size
      };
      await fileCenter.save();

      // Delete temporary file
      fs.unlinkSync(file.path);
    } catch (uploadError) {
      console.error('File upload error:', uploadError);
      // Delete the created entry if file upload fails
      await FileCenter.findByIdAndDelete(fileCenter._id);
      return res.status(500).json({
        success: false,
        message: 'Error uploading file',
        error: uploadError.message
      });
    }

    // Handle image upload if provided
    if (req.files && req.files.image) {
      try {
        const image = req.files.image[0];
        const result = await cloudinary.uploader.upload(image.path, {
          folder: 'sergioind/filecenter-images',
          width: 400,
          crop: 'scale'
        });

        fileCenter.image = {
          public_id: result.public_id,
          url: result.secure_url
        };
        await fileCenter.save();

        // Delete temporary image file
        fs.unlinkSync(image.path);
      } catch (imageUploadError) {
        console.error('Image upload error:', imageUploadError);
        // Continue without image if upload fails
        if (req.files.image && req.files.image[0]) {
          fs.unlinkSync(req.files.image[0].path);
        }
      }
    }

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: fileCenter
    });
  } catch (error) {
    // Clean up temporary files if error occurs
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        if (Array.isArray(fileArray)) {
          fileArray.forEach(file => {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          });
        }
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating file center entry',
      error: error.message
    });
  }
};

// @desc    Get all FileCenter Entries
// @route   GET /api/filecenter
// @access  Public
export const getAllFileCenter = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category,
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

    // Filter by file category
    if (category) {
      // This would need to be implemented with aggregation pipeline
      // For now, we'll filter by file type
      if (category === 'document') {
        query['file.fileType'] = { $regex: /pdf|word|document/i };
      } else if (category === 'image') {
        query['file.fileType'] = { $regex: /^image\//i };
      } else if (category === 'video') {
        query['file.fileType'] = { $regex: /^video\//i };
      } else if (category === 'audio') {
        query['file.fileType'] = { $regex: /^audio\//i };
      }
    }

    // Filter by active status
    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const fileCenter = await FileCenter.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sortOptions);

    const total = await FileCenter.countDocuments(query);

    res.status(200).json({
      success: true,
      data: fileCenter,
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
      message: 'Error fetching file center entries',
      error: error.message
    });
  }
};

// @desc    Get FileCenter Entry by ID
// @route   GET /api/filecenter/:id
// @access  Public
export const getFileCenterById = async (req, res) => {
  try {
    const fileCenter = await FileCenter.findById(req.params.id);

    if (!fileCenter) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Increment view count
    fileCenter.viewCount += 1;
    await fileCenter.save();

    res.status(200).json({
      success: true,
      data: fileCenter
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching file',
      error: error.message
    });
  }
};

// @desc    Download File
// @route   GET /api/filecenter/:id/download
// @access  Public
export const downloadFile = async (req, res) => {
  try {
    const fileCenter = await FileCenter.findById(req.params.id);

    if (!fileCenter) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    if (!fileCenter.file.url) {
      return res.status(404).json({
        success: false,
        message: 'File URL not found'
      });
    }

    // Increment download count
    fileCenter.downloadCount += 1;
    await fileCenter.save();

    // Redirect to Cloudinary URL for download
    res.redirect(fileCenter.file.url);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error downloading file',
      error: error.message
    });
  }
};

// @desc    View File
// @route   GET /api/filecenter/:id/view
// @access  Public
export const viewFile = async (req, res) => {
  try {
    const fileCenter = await FileCenter.findById(req.params.id);

    if (!fileCenter) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    if (!fileCenter.file.url) {
      return res.status(404).json({
        success: false,
        message: 'File URL not found'
      });
    }

    // Increment view count
    fileCenter.viewCount += 1;
    await fileCenter.save();

    // For images, videos, and PDFs, redirect to view
    const fileType = fileCenter.file.fileType;
    if (fileType && (fileType.startsWith('image/') || fileType.startsWith('video/') || fileType.includes('pdf'))) {
      res.redirect(fileCenter.file.url);
    } else {
      // For other file types, redirect to download
      res.redirect(fileCenter.file.url);
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error viewing file',
      error: error.message
    });
  }
};

// @desc    Update FileCenter Entry
// @route   PUT /api/filecenter/:id
// @access  Private - SuperAdmin Only
export const updateFileCenter = async (req, res) => {
  try {
    const { name, description } = req.body;
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

    if (description) {
      if (description.length < 10 || description.length > 1000) {
        return res.status(400).json({
          success: false,
          message: 'Description must be between 10 and 1000 characters'
        });
      }
      updateData.description = description;
    }

    const fileCenter = await FileCenter.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!fileCenter) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Handle new file upload if provided
    if (req.files && req.files.file) {
      try {
        // Delete old file from Cloudinary if exists
        if (fileCenter.file.public_id) {
          // Determine resource type based on file type
          let resourceType = 'raw'; // default for documents, archives, etc.

          if (fileCenter.file.fileType && fileCenter.file.fileType.startsWith('image/')) {
            resourceType = 'image';
          } else if (fileCenter.file.fileType && fileCenter.file.fileType.startsWith('video/')) {
            resourceType = 'video';
          }

          await cloudinary.uploader.destroy(fileCenter.file.public_id, {
            resource_type: resourceType
          });
        }

        const file = req.files.file[0];
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'sergioind/files',
          resource_type: 'auto',
          use_filename: true,
          unique_filename: true,
          type: 'upload'
        });

        // Update file center with new file info
        fileCenter.file = {
          public_id: result.public_id,
          url: result.secure_url,
          originalName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size
        };
        await fileCenter.save();

        // Delete temporary file
        fs.unlinkSync(file.path);
      } catch (uploadError) {
        console.error('File upload error:', uploadError);
        if (req.files.file && req.files.file[0]) {
          fs.unlinkSync(req.files.file[0].path);
        }
        return res.status(500).json({
          success: false,
          message: 'Error uploading new file',
          error: uploadError.message
        });
      }
    }

    // Handle new image upload if provided
    if (req.files && req.files.image) {
      try {
        // Delete old image from Cloudinary if exists
        if (fileCenter.image.public_id) {
          await cloudinary.uploader.destroy(fileCenter.image.public_id);
        }

        const image = req.files.image[0];
        const result = await cloudinary.uploader.upload(image.path, {
          folder: 'sergioind/filecenter-images',
          width: 400,
          crop: 'scale'
        });
        
        fileCenter.image = {
          public_id: result.public_id,
          url: result.secure_url
        };
        await fileCenter.save();
        
        // Delete temporary image file
        fs.unlinkSync(image.path);
      } catch (imageUploadError) {
        console.error('Image upload error:', imageUploadError);
        if (req.files.image && req.files.image[0]) {
          fs.unlinkSync(req.files.image[0].path);
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'File updated successfully',
      data: fileCenter
    });
  } catch (error) {
    // Clean up temporary files if error occurs
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        if (Array.isArray(fileArray)) {
          fileArray.forEach(file => {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          });
        }
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating file',
      error: error.message
    });
  }
};

// @desc    Delete FileCenter Image
// @route   DELETE /api/filecenter/:id/delete-image
// @access  Private - SuperAdmin Only
export const deleteFileCenterImage = async (req, res) => {
  try {
    const fileCenter = await FileCenter.findById(req.params.id);
    if (!fileCenter) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete image from Cloudinary if exists
    if (fileCenter.image.public_id) {
      await cloudinary.uploader.destroy(fileCenter.image.public_id);
    }

    // Remove image info from file center
    fileCenter.image = {
      public_id: null,
      url: null
    };
    await fileCenter.save();

    res.status(200).json({
      success: true,
      message: 'File image deleted successfully',
      data: fileCenter
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting file image',
      error: error.message
    });
  }
};

// @desc    Delete FileCenter Entry
// @route   DELETE /api/filecenter/:id
// @access  Private - SuperAdmin Only
export const deleteFileCenter = async (req, res) => {
  try {
    const fileCenter = await FileCenter.findById(req.params.id);

    if (!fileCenter) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete file from Cloudinary if exists
    if (fileCenter.file.public_id) {
      // Determine resource type based on file type
      let resourceType = 'raw'; // default for documents, archives, etc.

      if (fileCenter.file.fileType && fileCenter.file.fileType.startsWith('image/')) {
        resourceType = 'image';
      } else if (fileCenter.file.fileType && fileCenter.file.fileType.startsWith('video/')) {
        resourceType = 'video';
      }

      await cloudinary.uploader.destroy(fileCenter.file.public_id, {
        resource_type: resourceType
      });
    }

    // Delete image from Cloudinary if exists
    if (fileCenter.image.public_id) {
      await cloudinary.uploader.destroy(fileCenter.image.public_id);
    }

    await FileCenter.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting file',
      error: error.message
    });
  }
};

// @desc    Toggle FileCenter Status
// @route   PATCH /api/filecenter/:id/toggle-status
// @access  Private - SuperAdmin Only
export const toggleFileCenterStatus = async (req, res) => {
  try {
    const fileCenter = await FileCenter.findById(req.params.id);

    if (!fileCenter) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    fileCenter.isActive = !fileCenter.isActive;
    await fileCenter.save();

    res.status(200).json({
      success: true,
      message: `File ${fileCenter.isActive ? 'activated' : 'deactivated'} successfully`,
      data: fileCenter
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling file status',
      error: error.message
    });
  }
};

// @desc    Get File Statistics
// @route   GET /api/filecenter/stats
// @access  Private - SuperAdmin Only
export const getFileStats = async (req, res) => {
  try {
    const stats = await FileCenter.aggregate([
      {
        $group: {
          _id: null,
          totalFiles: { $sum: 1 },
          totalDownloads: { $sum: '$downloadCount' },
          totalViews: { $sum: '$viewCount' },
          averageDownloads: { $avg: '$downloadCount' },
          averageViews: { $avg: '$viewCount' }
        }
      }
    ]);

    const fileTypes = await FileCenter.aggregate([
      {
        $group: {
          _id: '$file.fileType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {
          totalFiles: 0,
          totalDownloads: 0,
          totalViews: 0,
          averageDownloads: 0,
          averageViews: 0
        },
        fileTypes
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching file statistics',
      error: error.message
    });
  }
}; 