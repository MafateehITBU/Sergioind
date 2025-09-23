import User from "../models/User.js";
import Admin from "../models/Admin.js";
import SuperAdmin from "../models/SuperAdmin.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import path from "path";
import { getAvatarUrl, avatarStyles } from "../utils/avatarGenerator.js";
import { setTokenCookie, clearTokenCookie } from "../utils/cookieUtils.js";
import {
  generateOTP,
  getOTPExpiry,
  sendOTPEmail,
  verifyOTPMatch,
} from "../utils/otp.js";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// @desc    Register User
// @route   POST /api/user/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;

    // Validation
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: name, email, password, phoneNumber",
      });
    }

    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 50 characters",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    // Phone validation using libphonenumber-js
    const parsedPhone = parsePhoneNumberFromString(phoneNumber);
    if (!parsedPhone || !parsedPhone.isValid()) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid international phone number (include country code, e.g. +1, +44, +962)",
      });
    }

    // normalize before saving (+9627xxxxxxx)
    const normalizedPhone = parsedPhone.number;

    // Check for existing email across all user types
    const existingUser = await User.findOne({ email });
    const existingAdmin = await Admin.findOne({ email });
    const existingSuperAdmin = await SuperAdmin.findOne({ email });

    if (existingUser || existingAdmin || existingSuperAdmin) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use by another account",
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phoneNumber: normalizedPhone,
      image: getAvatarUrl({ name }),
    });

    // Handle image upload if provided
    if (req.file) {
      try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "sergioind/usres",
          width: 300,
          crop: "scale",
        });
        // Update user with Cloudinary image info
        user.image = {
          public_id: result.public_id,
          url: result.secure_url,
        };
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

    await user.save();

    // Generate token
    const token = user.getJwtToken();

    // Set token in HTTP-only cookie
    setTokenCookie(res, token);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
      token,
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: "Error registering User",
      error: error.message,
    });
  }
};

// @desc    Login User
// @route   POST /api/user/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if password matches
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = user.getJwtToken();

    // Set token in HTTP-only cookie
    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
      token, // Still return token for mobile apps or if needed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};

// @desc    Get Current User
// @route   GET /api/user/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching User",
      error: error.message,
    });
  }
};

// @desc    Get all Users
// @route   GET /api/user
// @access  Private
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
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
      message: "Error fetching Users",
      error: error.message,
    });
  }
};

// @desc    Update User
// @route   PUT /api/user/:id
// @access  Private
export const updateUser = async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;
    const updateData = {};

    // Validation for provided fields
    if (name) {
      if (name.length < 2 || name.length > 50) {
        return res.status(400).json({
          success: false,
          message: "Name must be between 2 and 50 characters",
        });
      }
      updateData.name = name;
    }

    if (email) {
      const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid email",
        });
      }
      updateData.email = email;
    }

    if (phoneNumber) {
      // Global validation with libphonenumber-js
      const parsedPhone = parsePhoneNumberFromString(phoneNumber);
      if (!parsedPhone || !parsedPhone.isValid()) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a valid international phone number (include country code, e.g. +1, +44, +962)",
        });
      }
      // Normalize before saving
      updateData.phoneNumber = parsedPhone.number;
    }

    // Check if email is being updated and if it already exists across all user types
    if (email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: req.params.id },
      });
      const existingAdmin = await Admin.findOne({ email });
      const existingSuperAdmin = await SuperAdmin.findOne({ email });

      if (existingUser || existingAdmin || existingSuperAdmin) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use by another account",
        });
      }
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Handle image upload if provided
    if (req.file) {
      try {
        // Delete old image from Cloudinary if exists
        if (user.image.public_id) {
          await cloudinary.uploader.destroy(user.image.public_id);
        }
        // Upload new image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "sergioind/users",
          width: 300,
          crop: "scale",
        });
        // Update user with new Cloudinary image info
        user.image = {
          public_id: result.public_id,
          url: result.secure_url,
        };
        await user.save();
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
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: "Error updating User",
      error: error.message,
    });
  }
};

// @desc    Delete User image
// @route   DELETE /api/user/:id/delete-image
// @access  Private
export const deleteImage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete image file if exists
    if (user.image.public_id) {
      const imagePath = path.join("uploads", user.image.public_id);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("Image file deleted:", imagePath);
      }
    }

    // Remove image info from user
    user.image = {
      public_id: null,
      url: null,
    };
    await user.save();

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting image",
      error: error.message,
    });
  }
};

// @desc    Delete User
// @route   DELETE /api/user/:id
// @access  Private
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete image file if exists
    if (user.image.public_id) {
      const imagePath = path.join("uploads", user.image.public_id);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("Image file deleted:", imagePath);
      }
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};

// @desc    Get User avatar options
// @route   GET /api/user/:id/avatar-options
// @access  Private
export const getAvatarOptions = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const name = user.name || "User";
    const avatarOptions = {
      current: getAvatarUrl(user),
      styles: {
        profile: avatarStyles.profile(name),
        thumbnail: avatarStyles.thumbnail(name),
        list: avatarStyles.list(name),
        square: avatarStyles.square(name),
        primary: avatarStyles.primary(name),
        secondary: avatarStyles.secondary(name),
        success: avatarStyles.success(name),
        warning: avatarStyles.warning(name),
        danger: avatarStyles.danger(name),
      },
    };

    res.status(200).json({
      success: true,
      data: avatarOptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching avatar options",
      error: error.message,
    });
  }
};

// @desc Send OTP for User
// @route POST /api/user/send-otp
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email address",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate OTP and expiry
    const otp = generateOTP();
    const otpExpiresAt = getOTPExpiry();

    // Update user with OTP and expiry
    user.otp = otp;
    user.otpExpires = otpExpiresAt;
    await user.save();

    // Send OTP via email
    await sendOTPEmail({
      to: email,
      otp,
      senderLabel: "Sergio",
      emailUser: process.env.EMAIL_USER,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({
      success: false,
      message: "Error sending OTP",
      error: error.message,
    });
  }
};

// @desc Verify OTP for User
// @route POST /api/user/verify-otp
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const lowercaseEmail = email.toLowerCase();
    const user = await User.findOne({ email: lowercaseEmail });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!verifyOTPMatch(user, otp)) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    res.status(200).json({ message: "OTP correct!" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Reset User Password after OTP verification
// @route   PUT /api/user/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    // Validation
    if (!email || !confirmPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide both current password and new password",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    // Get user with password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if current password matches
    const isPasswordMatch = newPassword === confirmPassword;
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match",
      });
    }

    // Check if new password is same as current password
    const isNewPasswordSame = await user.comparePassword(newPassword);
    if (isNewPasswordSame) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error changing password",
      error: error.message,
    });
  }
};

// @desc    Change User Password
// @route   PUT /api/user/change-password
export const changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    // Validation
    if (!email || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide both current password and new password",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    // Get user with password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if current password matches
    const isCurrentPasswordMatch = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Check if new password is same as current password
    const isNewPasswordSame = await user.comparePassword(newPassword);
    if (isNewPasswordSame) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error changing password",
      error: error.message,
    });
  }
};

// @desc    Logout User
// @route   POST /api/user/logout
// @access  Private
export const logoutUser = async (req, res) => {
  try {
    // Clear the token cookie
    clearTokenCookie(res);

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging out",
      error: error.message,
    });
  }
};
