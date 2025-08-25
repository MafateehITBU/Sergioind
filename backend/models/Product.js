import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    nameAr: { type: String, trim: true },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      trim: true,
      unique: true,
      maxlength: [100, "SKU cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      maxlength: [1000, "Product description cannot exceed 1000 characters"],
    },
    descriptionAr: { type: String, trim: true },
    details: [
      {
        type: String,
        trim: true,
        maxlength: [300, "Each detail cannot exceed 300 characters"],
      },
    ],
    detailsAr: [{ type: String, trim: true }],
    image: [
      {
        public_id: {
          type: String,
          default: null,
        },
        url: {
          type: String,
          default: null,
        },
      },
    ],
    flavors: [
      {
        name: {
          type: String,
          required: [true, "Flavor name is required"],
          trim: true,
          maxlength: [100, "Flavor name cannot exceed 100 characters"],
        },
        nameAr: {
          type: String,
          trim: true,
        },
      },
    ],
    sizes: [
      {
        name: {
          type: String,
          required: [true, "Size name is required"],
          trim: true,
          maxlength: [50, "Size name cannot exceed 50 characters"],
        },
        weight: {
          value: {
            type: Number,
            required: [true, "Weight value is required"],
            min: [0, "Weight must be greater than 0"],
          },
          unit: {
            type: String,
            enum: ["g", "kg"],
            required: [true, "Weight unit is required"],
          },
        },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1 });

// Ensure virtual fields are serialized
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

export default mongoose.model("Product", productSchema);
