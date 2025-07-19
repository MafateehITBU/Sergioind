import mongoose from 'mongoose';

const fileCenterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'File name is required'],
    trim: true,
    maxlength: [200, 'File name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'File description is required'],
    trim: true,
    maxlength: [1000, 'File description cannot exceed 1000 characters']
  },
  file: {
    public_id: {
      type: String,
      default: null
    },
    url: {
      type: String,
      default: null
    },
    originalName: {
      type: String,
      default: null
    },
    fileType: {
      type: String,
      default: null
    },
    fileSize: {
      type: Number,
      default: null
    }
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
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for better search performance
fileCenterSchema.index({ name: 'text', description: 'text' });

// Virtual for file size in human readable format
fileCenterSchema.virtual('formattedFileSize').get(function() {
  if (!this.file.fileSize) return null;
  
  const bytes = this.file.fileSize;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Bytes';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
});

// Virtual for file type category
fileCenterSchema.virtual('fileCategory').get(function() {
  if (!this.file.fileType) return 'unknown';
  
  const type = this.file.fileType.toLowerCase();
  
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('video/')) return 'video';
  if (type.startsWith('audio/')) return 'audio';
  if (type.includes('pdf')) return 'document';
  if (type.includes('word') || type.includes('document')) return 'document';
  if (type.includes('excel') || type.includes('spreadsheet')) return 'spreadsheet';
  if (type.includes('powerpoint') || type.includes('presentation')) return 'presentation';
  if (type.includes('zip') || type.includes('rar') || type.includes('archive')) return 'archive';
  if (type.includes('text/')) return 'text';
  
  return 'other';
});

// Ensure virtual fields are serialized
fileCenterSchema.set('toJSON', { virtuals: true });
fileCenterSchema.set('toObject', { virtuals: true });

export default mongoose.model('FileCenter', fileCenterSchema); 