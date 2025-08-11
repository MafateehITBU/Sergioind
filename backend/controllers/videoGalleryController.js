import VideoGallery from "../models/VideoGallery.js";

// @desc  Create a new video gallery
// @route POST /api/video-gallery
// @access Private
export const createVideoGallery = async (req, res) => {
  try {
    const { title, videoUrl } = req.body;

    if (!title || !videoUrl) {
      return res
        .status(400)
        .json({ message: "Title and video URL are required." });
    }

    const newVideoGallery = new VideoGallery({
      title,
      videoUrl,
    });

    await newVideoGallery.save();
    res.status(201).json(newVideoGallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all video galleries
// @route GET /api/video-gallery
// @access Public
export const getVideoGalleries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      active,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const query = {};
    // Search functionality
    if (search) {
      query.$or = [{ title: { $regex: search, $options: "i" } }];
    }

    // Filter by active status
    if (active !== undefined) {
      query.isActive = active === "true";
    }

    const videoGalleries = await VideoGallery.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ title: 1 });

    const total = await VideoGallery.countDocuments(query);
    res.status(200).json({
      success: true,
      data: videoGalleries,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching video galleries",
      error: error.message,
    });
  }
};

// @desc  Get a single video gallery by ID
// @route GET /api/video-gallery/:id
// @access Public
export const getVideoGalleryById = async (req, res) => {
  try {
    const videoGallery = await VideoGallery.findById(req.params.id);
    if (!videoGallery) {
      return res.status(404).json({ message: "Video gallery not found." });
    }
    res.status(200).json(videoGallery);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching video gallery",
      error: error.message,
    });
  }
};

// @desc Update a video gallery by ID
// @route PUT /api/video-gallery/:id
// @access Private
export const updateVideoGallery = async (req, res) => {
  try {
    const { title, videoUrl } = req.body;
    const updateData = {};

    // Validation for provided fields
    if (title) {
      if (title.length < 2 || title.length > 50) {
        return res.status(400).json({
          success: false,
          message: "Size title must be between 2 and 50 characters",
        });
      }
      updateData.title = title;
    }

    if (videoUrl !== undefined) {
      updateData.videoUrl = videoUrl;
    }

    const updatedVideoGallery = await VideoGallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedVideoGallery) {
      return res.status(404).json({
        success: false,
        message: "Video Gallery not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Video Gallery updated successfully",
      data: updatedVideoGallery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating video gallery",
      error: error.message,
    });
  }
};

// @desc Delete a video gallery by ID
// @route DELETE /api/video-gallery/:id
// @access Private
export const deleteVideoGallery = async (req, res) => {
  try {
    const videoGallery = await VideoGallery.findById(req.params.id);

    if (!videoGallery) {
      return res.status(404).json({
        success: false,
        message: "Video Gallery not found",
      });
    }

    await VideoGallery.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting video",
      error: error.message,
    });
  }
};

// @desc Toggle video gallery active status
// @route PUT /api/video-gallery/:id/toggle-active
// @access Private
export const toggleVideoGalleryActive = async (req, res) => {
  try {
    const videoGallery = await VideoGallery.findById(req.params.id);

    if (!videoGallery) {
      return res.status(404).json({
        success: false,
        message: "Video Gallery not found",
      });
    }

    videoGallery.isActive = !videoGallery.isActive;
    await videoGallery.save();

    res.status(200).json({
      success: true,
      message: `Video Gallery is now ${
        videoGallery.isActive ? "active" : "inactive"
      }`,
      data: videoGallery,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error toggling video gallery status",
      error: error.message,
    });
  }
};
