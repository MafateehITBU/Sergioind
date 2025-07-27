import QuotationRequest from '../models/QuotationRequest.js';
import Product from '../models/Product.js';
import Size from '../models/Size.js';
import Flavor from '../models/Flavor.js';
import Admin from '../models/Admin.js';
import SuperAdmin from '../models/SuperAdmin.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// Create a new quotation request (public endpoint)
const createQuotationRequest = async (req, res) => {
  try {
    const { name, companyName, email, phoneNumber, note, items } = req.body;

    // Validate required fields
    if (!name || !email || !phoneNumber || !items || !Array.isArray(items) || items.length === 0) {
      return errorResponse(res, 400, 'Name, email, phone number, and at least one item are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse(res, 400, 'Invalid email format');
    }

    // Validate items
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.product || !item.size || !item.flavor || !item.quantity) {
        return errorResponse(res, 400, `Item ${i + 1}: product, size, flavor, and quantity are required`);
      }
      if (item.quantity < 1) {
        return errorResponse(res, 400, `Item ${i + 1}: quantity must be at least 1`);
      }
    }

    // Validate that all products, sizes, and flavors exist
    const productIds = items.map(item => item.product);
    const sizeIds = items.map(item => item.size);
    const flavorIds = items.map(item => item.flavor);

    const [products, sizes, flavors] = await Promise.all([
      Product.find({ _id: { $in: productIds } }),
      Size.find({ _id: { $in: sizeIds } }),
      Flavor.find({ _id: { $in: flavorIds } })
    ]);

    if (products.length !== productIds.length) {
      return errorResponse(res, 400, 'One or more products not found');
    }
    if (sizes.length !== sizeIds.length) {
      return errorResponse(res, 400, 'One or more sizes not found');
    }
    if (flavors.length !== flavorIds.length) {
      return errorResponse(res, 400, 'One or more flavors not found');
    }

    // Create the quotation request
    const quotationRequest = new QuotationRequest({
      name,
      companyName,
      email,
      phoneNumber,
      note,
      items
    });

    await quotationRequest.save();

    // Populate the items for response
    await quotationRequest.populate([
      { path: 'items.product', select: 'name sku price' },
      { path: 'items.size', select: 'name' },
      { path: 'items.flavor', select: 'name' }
    ]);

    return successResponse(res, 201, 'Quotation request created successfully', quotationRequest);
  } catch (error) {
    console.error('Error creating quotation request:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

// Get all quotation requests (admin only)
const getAllQuotationRequests = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Build filter
    const filter = {};
    if (status && ['closed', 'ongoing', 'sent'].includes(status)) {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { companyName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [quotationRequests, total] = await Promise.all([
      QuotationRequest.find(filter)
        .populate([
          { path: 'items.product', select: 'name sku price' },
          { path: 'items.size', select: 'name' },
          { path: 'items.flavor', select: 'name' },
          {
            path: 'statusHistory.changedBy',
            select: 'name',
          }
        ])
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit)),
      QuotationRequest.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    return successResponse(res, 200, 'Quotation requests retrieved successfully', {
      quotationRequests,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error getting quotation requests:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

// Get quotation request by ID (admin only)
const getQuotationRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const quotationRequest = await QuotationRequest.findById(id)
      .populate([
        { path: 'items.product', select: 'name sku price description' },
        { path: 'items.size', select: 'name' },
        { path: 'items.flavor', select: 'name' },
        { path: 'statusHistory.changedBy', select: 'name email' }
      ]);

    if (!quotationRequest) {
      return errorResponse(res, 404, 'Quotation request not found');
    }

    return successResponse(res, 200, 'Quotation request retrieved successfully', quotationRequest);
  } catch (error) {
    console.error('Error getting quotation request:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

// Update quotation request status (admin only)
const updateQuotationRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse, totalPrice } = req.body;
    const adminId = req.user.id;
    const adminModel = req.user.role === 'superadmin' ? 'SuperAdmin' : 'Admin';

    const quotationRequest = await QuotationRequest.findById(id);
    if (!quotationRequest) {
      return errorResponse(res, 404, 'Quotation request not found');
    }

    // Store old status to compare
    const previousStatus = quotationRequest.status;

    // Update fields
    if (status) quotationRequest.status = status;
    if (adminResponse !== undefined) quotationRequest.adminResponse = adminResponse;
    if (totalPrice !== undefined) quotationRequest.totalPrice = totalPrice;

    // Only add to history if status has changed
    if (status && status !== previousStatus) {
      quotationRequest.statusHistory.push({
        status,
        changedAt: new Date(),
        changedBy: adminId,
        adminModel: adminModel
      });
    }

    await quotationRequest.save();

    // Populate fields for response
    await quotationRequest.populate([
      { path: 'items.product', select: 'name sku price' },
      { path: 'items.size', select: 'name' },
      { path: 'items.flavor', select: 'name' },
      { path: 'statusHistory.changedBy', select: 'name email' }
    ]);

    return successResponse(res, 200, 'Quotation request updated successfully', quotationRequest);
  } catch (error) {
    console.error('Error updating quotation request:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

// Delete quotation request (admin only)
const deleteQuotationRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const quotationRequest = await QuotationRequest.findByIdAndDelete(id);
    if (!quotationRequest) {
      return errorResponse(res, 404, 'Quotation request not found');
    }

    return successResponse(res, 200, 'Quotation request deleted successfully');
  } catch (error) {
    console.error('Error deleting quotation request:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

// Get quotation request statistics (admin only)
const getQuotationRequestStats = async (req, res) => {
  try {
    const [total, closed, ongoing, sent] = await Promise.all([
      QuotationRequest.countDocuments(),
      QuotationRequest.countDocuments({ status: 'closed' }),
      QuotationRequest.countDocuments({ status: 'ongoing' }),
      QuotationRequest.countDocuments({ status: 'sent' })
    ]);

    // Get recent requests (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRequests = await QuotationRequest.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    return successResponse(res, 200, 'Statistics retrieved successfully', {
      total,
      byStatus: {
        closed,
        ongoing,
        sent
      },
      recentRequests
    });
  } catch (error) {
    console.error('Error getting statistics:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

// Get quotation request by email (public endpoint for users to check their requests)
const getQuotationRequestsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse(res, 400, 'Invalid email format');
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [quotationRequests, total] = await Promise.all([
      QuotationRequest.find({ email: email.toLowerCase() })
        .populate([
          { path: 'items.product', select: 'name sku price' },
          { path: 'items.size', select: 'name' },
          { path: 'items.flavor', select: 'name' }
        ])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      QuotationRequest.countDocuments({ email: email.toLowerCase() })
    ]);

    const totalPages = Math.ceil(total / parseInt(limit));

    return successResponse(res, 200, 'Quotation requests retrieved successfully', {
      quotationRequests,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error getting quotation requests by email:', error);
    return errorResponse(res, 500, 'Internal server error');
  }
};

export {
  createQuotationRequest,
  getAllQuotationRequests,
  getQuotationRequestById,
  updateQuotationRequestStatus,
  deleteQuotationRequest,
  getQuotationRequestStats,
  getQuotationRequestsByEmail
}; 