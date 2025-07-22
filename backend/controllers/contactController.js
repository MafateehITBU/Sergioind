import Contact from '../models/Contact.js';
import { successResponse, errorResponse } from '../utils/responseHandler.js';

// Create a new contact (public)
const createContact = async (req, res) => {
    try {
        const { name, email, phoneNumber, message } = req.body;

        if (!name || !email || !phoneNumber || !message) {
            return errorResponse(res, 400, 'All fields are required.');
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return errorResponse(res, 400, 'Invalid email format.');
        }

        const contact = new Contact({ name, email, phoneNumber, message });
        await contact.save();

        return successResponse(res, 201, 'Contact request submitted successfully.', contact);
    } catch (error) {
        console.error('Error creating contact:', error);
        return errorResponse(res, 500, 'Internal server error');
    }
};

// Get all contacts (admin)
const getAllContacts = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        const filter = {};
        if (status && ['pending', 'ongoing', 'closed', 'spam'].includes(status)) {
            filter.status = status;
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { message: { $regex: search, $options: 'i' } }
            ];
        }

        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [contacts, total] = await Promise.all([
            Contact.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit)),
            Contact.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total / parseInt(limit));

        return successResponse(res, 200, 'Contacts retrieved successfully.', {
            contacts,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalItems: total,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.error('Error getting contacts:', error);
        return errorResponse(res, 500, 'Internal server error');
    }
};

// Get contact by ID (admin)
const getContactById = async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findById(id);
        if (!contact) {
            return errorResponse(res, 404, 'Contact not found.');
        }

        return successResponse(res, 200, 'Contact retrieved successfully.', contact);
    } catch (error) {
        console.error('Error getting contact:', error);
        return errorResponse(res, 500, 'Internal server error');
    }
};

// Update contact status (admin)
const updateContactStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminResponse } = req.body;

        if (status && !['pending', 'ongoing', 'closed', 'spam'].includes(status)) {
            return errorResponse(res, 400, 'Invalid status. Must be pending, ongoing, closed, or spam.');
        }

        const contact = await Contact.findById(id);
        if (!contact) {
            return errorResponse(res, 404, 'Contact not found.');
        }

        if (status) contact.status = status;
        if (adminResponse !== undefined) contact.adminResponse = adminResponse;

        await contact.save();

        return successResponse(res, 200, 'Contact updated successfully.', contact);
    } catch (error) {
        console.error('Error updating contact:', error);
        return errorResponse(res, 500, 'Internal server error');
    }
};

// Delete contact (admin)
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        const contact = await Contact.findByIdAndDelete(id);
        if (!contact) {
            return errorResponse(res, 404, 'Contact not found.');
        }

        return successResponse(res, 200, 'Contact deleted successfully.');
    } catch (error) {
        console.error('Error deleting contact:', error);
        return errorResponse(res, 500, 'Internal server error');
    }
};

// Get contact statistics (admin)
const getContactStats = async (req, res) => {
    try {
        const [total, pending, ongoing, closed, spam] = await Promise.all([
            Contact.countDocuments(),
            Contact.countDocuments({ status: 'pending' }),
            Contact.countDocuments({ status: 'ongoing' }),
            Contact.countDocuments({ status: 'closed' }),
            Contact.countDocuments({ status: 'spam' }),
        ]);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentContacts = await Contact.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

        return successResponse(res, 200, 'Contact statistics retrieved successfully.', {
            total,
            byStatus: { pending, ongoing, closed, spam },
            recentContacts
        });
    } catch (error) {
        console.error('Error getting contact stats:', error);
        return errorResponse(res, 500, 'Internal server error');
    }
};

export {
    createContact,
    getAllContacts,
    getContactById,
    updateContactStatus,
    deleteContact,
    getContactStats
};