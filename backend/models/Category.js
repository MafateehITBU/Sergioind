import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [100, 'Category name cannot exceed 100 characters'],
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Category description is required'],
    trim: true,
    maxlength: [500, 'Category description cannot exceed 500 characters']
  },
  image: {
    public_id: {
      type: String,
      default: null
    },
    url: {
      type: String,
      default: null
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better search performance
categorySchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Category', categorySchema); 