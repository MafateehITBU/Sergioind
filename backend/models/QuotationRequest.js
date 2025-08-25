import mongoose from "mongoose";

const quotationItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    flavor: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: true }
);

const quotationRequestSchema = new mongoose.Schema({
  // User Information
  name: {
    type: String,
    required: true,
    trim: true,
  },
  companyName: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
  },
  note: {
    type: String,
    trim: true,
  },

  // Products requested
  items: [quotationItemSchema],

  // Status management
  status: {
    type: String,
    enum: ["closed", "ongoing", "sent"],
    default: "closed",
  },

  // Admin response
  adminResponse: {
    type: String,
    trim: true,
  },

  // Pricing (filled by admin)
  totalPrice: {
    type: Number,
    min: 0,
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },

  // Status change tracking
  statusHistory: [
    {
      status: {
        type: String,
        enum: ["closed", "ongoing", "sent"],
      },
      changedAt: {
        type: Date,
        default: Date.now,
      },
      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "statusHistory.adminModel",
      },
      adminModel: {
        type: String,
        enum: ["Admin", "SuperAdmin"],
        required: true,
      },
    },
  ],
});

// Update the updatedAt field before saving
quotationRequestSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for total items count
quotationRequestSchema.virtual("totalItems").get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Ensure virtuals are serialized
quotationRequestSchema.set("toJSON", { virtuals: true });
quotationRequestSchema.set("toObject", { virtuals: true });

export default mongoose.model("QuotationRequest", quotationRequestSchema);
