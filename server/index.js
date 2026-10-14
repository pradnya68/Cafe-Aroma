import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import User from './models/User.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import superadminRoutes from './routes/superadminRoutes.js';
import locationRoutes from './routes/locationRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for dev/preview
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/location', locationRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`☕ Café Aroma Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  
  // Auto-seed superadmin
  try {
    const existingSuperadmin = await User.findOne({ email: 'superadmin@cafearoma.com' });
    if (!existingSuperadmin) {
      await User.create({
        name: 'Super Admin',
        email: 'superadmin@cafearoma.com',
        password: 'superadmin123',
        role: 'superadmin',
        isActive: true
      });
      console.log('✅ Default Superadmin created: superadmin@cafearoma.com / superadmin123');
    }
  } catch (err) {
    console.error('Error auto-seeding superadmin:', err);
  }
});
