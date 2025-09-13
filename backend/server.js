import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

// Import routes
import superAdminRoutes from './routes/superAdmin.js';
import categoryRoutes from './routes/category.js';
import productRoutes from './routes/product.js';
import fileCenterRoutes from './routes/fileCenter.js';
import quotationRequestRoutes from './routes/quotationRequest.js';
import userRoutes from './routes/user.js';
import adminRoutes from './routes/admin.js';
import contactRoutes from './routes/contact.js';
import upload from './middleware/upload.js';
import gallery from './routes/gallery.js';
import videoGallery from './routes/videoGallery.js';
import postRoutes from './routes/post.js';
import applicantRoutes from './routes/applicant.js';
import cvRoutes from './routes/cv.js';

dotenv.config();

// Debug environment variables
console.log('=== ENVIRONMENT VARIABLES DEBUG ===');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('=== END ENVIRONMENT VARIABLES DEBUG ===');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security middleware
app.use(helmet());

// Logging middleware
app.use(morgan('combined'));

// CORS middleware
app.use(cors({
  // Reflect the request origin to allow any origin while supporting credentials
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
// Explicitly handle preflight for all routes
app.options('*', cors({ origin: true, credentials: true }));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser middleware
app.use(cookieParser());

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Test file upload route
app.post('/api/test-upload', upload.single('image'), (req, res) => {
  console.log('=== TEST UPLOAD DEBUG ===');
  console.log('req.file:', req.file);
  console.log('req.body:', req.body);
  console.log('Content-Type:', req.get('Content-Type'));
  console.log('=== END TEST UPLOAD DEBUG ===');
  
  res.json({
    success: true,
    message: 'Test upload completed',
    file: req.file,
    body: req.body
  });
});

// API Routes
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/filecenter', fileCenterRoutes);
app.use('/api/quotation-requests', quotationRequestRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact-us', contactRoutes);
app.use('/api/gallery', gallery);
app.use('/api/video-gallery', videoGallery);
app.use('/api/post', postRoutes);
app.use('/api/applicant', applicantRoutes);
app.use('/api/cv', cvRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to SergioIND Backend API',
    version: '1.0.0',
    endpoints: {
      superadmin: '/api/superadmin',
      categories: '/api/categories',
      products: '/api/products',
      filecenter: '/api/filecenter',
      quotationRequests: '/api/quotation-requests',
      user: '/api/user',
      admin: '/api/admin'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 