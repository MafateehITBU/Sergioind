import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Gallery title is required'],
        trim: true,
        maxlength: [200, 'Gallery title cannot exceed 200 characters'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Gallery description is required'],
        trim: true,
        maxlength: [1000, 'Gallery description cannot exceed 1000 characters']
    },
    images: [{
        public_id: {
            type: String,
            default: null
        },
        url: {
            type: String,
            default: null
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});

// Index for better search performance
gallerySchema.index({ title: 'text', description: 'text' });
gallerySchema.index({ isActive: 1 });

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;