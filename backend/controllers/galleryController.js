import Gallery from "../models/Gallery.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// @desc    Create Gallery
// @route   POST /api/gallery
// @access  Private
export const createGallery = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required." });
    }

    // Check if a gallery with the same title already exists
    const existingGallery = await Gallery.findOne({ title: title.trim() });
    if (existingGallery) {
      return res.status(400).json({
        success: false,
        message: "A gallery with this title already exists.",
      });
    }

    const gallery = await Gallery.create({
      title: title.trim(),
      description,
    });

    // Handle image upload if provided
    if (req.files && req.files.length > 0) {
      const uploadedImages = [];

      for (const file of req.files) {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: `sergioind/gallery/${title.trim()}`,
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
          try {
            fs.unlinkSync(file.path); // clean up on error
          } catch {}
        }
      }

      gallery.images = uploadedImages;
      await gallery.save();
    }

    res.status(201).json({
      message: "Gallery created successfully",
      gallery,
    });
  } catch (error) {
    // Delete uploaded files if error occurs
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          fs.unlinkSync(file.path);
        } catch {}
      }
    }
    res.status(500).json({
      success: false,
      message: "Error creating gallery",
      error: error.message,
    });
  }
};

// @desc    Get all Galleries
// @route   GET /api/gallery
// @access  Public
export const getAllGalleries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      title,
      active,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const query = {};

    // Search using text index
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by title (exact match)
    if (title) {
      query.title = title;
    }

    // Filter by active status
    if (active === "true" || active === "false") {
      query.isActive = active === "true";
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    const galleries = await Gallery.find(
      query,
      search ? { score: { $meta: "textScore" } } : {}
    )
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .sort(search ? { score: { $meta: "textScore" } } : sortOptions);

    const total = await Gallery.countDocuments(query);

    res.status(200).json({
      success: true,
      data: galleries,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        itemsPerPage: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching galleries",
      error: error.message,
    });
  }
};

// @desc    Get single Gallery by ID
// @route   GET /api/gallery/:id
// @access  Public
export const getGalleryById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gallery ID format",
      });
    }

    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: "Gallery not found",
      });
    }

    res.status(200).json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching gallery",
      error: error.message,
    });
  }
};

// @desc    Update Gallery
// @route   PUT /api/gallery/:id
// @access  Private
export const updateGallery = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid gallery ID format" });
    }

    let gallery = await Gallery.findById(id);

    if (!gallery) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery not found" });
    }

    // Update only provided fields
    const updatableFields = ["title", "description"];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        gallery[field] = req.body[field];
      }
    });

    // Handle deleted images
    if (req.body.deleteImages && Array.isArray(req.body.deleteImages)) {
      for (const publicId of req.body.deleteImages) {
        try {
          await cloudinary.uploader.destroy(publicId);
          gallery.images = gallery.images.filter(
            (img) => img.public_id !== publicId
          );
        } catch (err) {
          console.error("Error deleting image from Cloudinary:", err);
        }
      }
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const uploadedImages = await Promise.all(
        req.files.map(async (file) => {
          try {
            const result = await cloudinary.uploader.upload(file.path, {
              folder: `sergioind/gallery/${gallery.title}`,
              width: 500,
              crop: "scale",
            });

            fs.unlinkSync(file.path); // remove local temp file

            return {
              public_id: result.public_id,
              url: result.secure_url,
            };
          } catch (uploadError) {
            console.error("Image upload error:", uploadError);
            fs.unlinkSync(file.path);
            return null;
          }
        })
      );

      // Add only successfully uploaded images
      gallery.images.push(...uploadedImages.filter(Boolean));
    }

    await gallery.save();

    res.status(200).json({
      success: true,
      message: "Gallery updated successfully",
      data: gallery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating gallery",
      error: error.message,
    });
  }
};

// @desc    Toggle Gallery active status
// @route   PATCH /api/gallery/:id/toggle-status
// @access  Private
export const toggleGalleryStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid gallery ID format" });
    }

    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery not found" });
    }

    // Toggle isActive
    gallery.isActive = !gallery.isActive;
    await gallery.save();

    res.status(200).json({
      success: true,
      message: `Gallery is now ${gallery.isActive ? "active" : "inactive"}`,
      data: { id: gallery._id, isActive: gallery.isActive },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error toggling gallery status",
      error: error.message,
    });
  }
};

// @desc    Delete Gallery and all its images
// @route   DELETE /api/gallery/:id
// @access  Private
export const deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid gallery ID format" });
    }

    const gallery = await Gallery.findById(id);

    if (!gallery) {
      return res
        .status(404)
        .json({ success: false, message: "Gallery not found" });
    }

    // Delete all images from Cloudinary
    if (gallery.images && gallery.images.length > 0) {
      for (const img of gallery.images) {
        try {
          await cloudinary.uploader.destroy(img.public_id);
        } catch (err) {
          console.error(
            `Failed to delete image ${img.public_id} from Cloudinary:`,
            err
          );
        }
      }
    }

    // Delete gallery document from DB
    await Gallery.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Gallery and all associated images deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting gallery",
      error: error.message,
    });
  }
};
