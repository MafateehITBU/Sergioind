import { validationResult } from 'express-validator';

// Validation middleware
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg
      }))
    });
  }
  next();
};

// Validation rules for SuperAdmin
export const superAdminValidation = {
  // Register validation
  register: [
    {
      name: 'name',
      rules: [
        { type: 'notEmpty', message: 'Name is required' },
        { type: 'isLength', options: { min: 2, max: 50 }, message: 'Name must be between 2 and 50 characters' }
      ]
    },
    {
      name: 'email',
      rules: [
        { type: 'notEmpty', message: 'Email is required' },
        { type: 'isEmail', message: 'Please enter a valid email' }
      ]
    },
    {
      name: 'password',
      rules: [
        { type: 'notEmpty', message: 'Password is required' },
        { type: 'isLength', options: { min: 6 }, message: 'Password must be at least 6 characters' }
      ]
    },
    {
      name: 'phoneNumber',
      rules: [
        { type: 'notEmpty', message: 'Phone number is required' },
        { type: 'matches', options: /^(\+?1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/, message: 'Please enter a valid phone number' }
      ]
    }
  ],

  // Login validation
  login: [
    {
      name: 'email',
      rules: [
        { type: 'notEmpty', message: 'Email is required' },
        { type: 'isEmail', message: 'Please enter a valid email' }
      ]
    },
    {
      name: 'password',
      rules: [
        { type: 'notEmpty', message: 'Password is required' }
      ]
    }
  ],

  // Update validation
  update: [
    {
      name: 'name',
      rules: [
        { type: 'optional' },
        { type: 'isLength', options: { min: 2, max: 50 }, message: 'Name must be between 2 and 50 characters' }
      ]
    },
    {
      name: 'email',
      rules: [
        { type: 'optional' },
        { type: 'isEmail', message: 'Please enter a valid email' }
      ]
    },
    {
      name: 'phoneNumber',
      rules: [
        { type: 'optional' },
        { type: 'matches', options: /^(\+?1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/, message: 'Please enter a valid phone number' }
      ]
    }
  ]
};

// Validation for quotation requests
export const validateQuotationRequest = (req, res, next) => {
  const { name, email, phoneNumber, items } = req.body;
  const errors = [];

  // Validate required fields
  if (!name || name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (name.trim().length < 2 || name.trim().length > 50) {
    errors.push({ field: 'name', message: 'Name must be between 2 and 50 characters' });
  }

  if (!email || email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push({ field: 'email', message: 'Please enter a valid email' });
    }
  }

  if (!phoneNumber || phoneNumber.trim().length === 0) {
    errors.push({ field: 'phoneNumber', message: 'Phone number is required' });
  } else {
    const phoneRegex = /^(\+?1)?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    if (!phoneRegex.test(phoneNumber)) {
      errors.push({ field: 'phoneNumber', message: 'Please enter a valid phone number' });
    }
  }

  // Validate items
  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push({ field: 'items', message: 'At least one item is required' });
  } else {
    items.forEach((item, index) => {
      if (!item.product) {
        errors.push({ field: `items[${index}].product`, message: 'Product is required' });
      }
      if (!item.size) {
        errors.push({ field: `items[${index}].size`, message: 'Size is required' });
      }
      if (!item.quantity || item.quantity < 1) {
        errors.push({ field: `items[${index}].quantity`, message: 'Quantity must be at least 1' });
      }
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

