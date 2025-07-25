import mongoose from 'mongoose';

const flavorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Flavor name is required'],
    trim: true,
    maxlength: [100, 'Flavor name cannot exceed 100 characters'],
    unique: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Flavor description cannot exceed 500 characters']
  },
  color: {
    type: String,
    trim: true,
    maxlength: [20, 'Color code cannot exceed 20 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better search performance
flavorSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Flavor', flavorSchema); 