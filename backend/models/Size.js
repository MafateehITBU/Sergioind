import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Size name is required'],
    trim: true,
    maxlength: [50, 'Size name cannot exceed 50 characters'],
    unique: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Size description cannot exceed 200 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better search performance
sizeSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Size', sizeSchema); 