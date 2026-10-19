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
import birthdayOfferRoutes from './routes/birthdayOfferRoutes.js';
import BirthdayOffer from './models/BirthdayOffer.js';

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
app.use('/api/birthday-offers', birthdayOfferRoutes);

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

  // Auto-seed initial birthday offers if collection is empty
  try {
    const count = await BirthdayOffer.countDocuments();
    if (count === 0) {
      await BirthdayOffer.create([
        {
          title: 'Artisan Birthday Cake & Coffee Combo',
          description: 'A decadent 1/2 kg Belgian dark chocolate truffle cake paired with two freshly brewed pour-over or flat white coffees of your choice.',
          category: 'combo',
          image: '/assets/pastry-breakfast.jpg',
          originalPrice: 799,
          discountedPrice: 499,
          discountPercentage: '38% OFF',
          specialReward: 'Free sparkler candle presentation & greeting card',
          validity: 'Valid throughout your birthday week with photo ID',
          terms: [
            'Valid for dine-in celebrations only',
            'Please present valid ID proof showing date of birth',
            'May not be combined with other promotional coupons or discounts'
          ],
          badge: "Chef's Special",
          highlights: [
            '1/2 Kg Handcrafted Belgian Dark Chocolate Cake',
            '2 Signature Pour-Over or Flat White Coffees',
            'Sparkler Candle & Personalized Greeting Card'
          ],
          isActive: true
        },
        {
          title: 'Complimentary Birthday Dessert Delight',
          description: 'Enjoy a free handcrafted dessert on us to sweeten your special day! Choose between our warm Molten Chocolate Lava Cake or house Tiramisu.',
          category: 'dessert',
          image: '/assets/special-latte.jpg',
          originalPrice: 260,
          discountedPrice: 0,
          discountPercentage: '100% FREE',
          specialReward: 'Free warm dessert with custom chocolate name piping',
          validity: 'Valid on your birthday with minimum order of ₹400',
          terms: [
            'Applicable on dine-in beverage & food order of ₹400+',
            'One complimentary dessert per birthday celebrant',
            'Subject to daily bakery availability'
          ],
          badge: 'Free Treat',
          highlights: [
            'Choice of Molten Chocolate Lava or Classic Tiramisu',
            'Handwritten chocolate celebration message on plate',
            'No extra dessert charge'
          ],
          isActive: true
        },
        {
          title: 'VIP Café Birthday Celebration Experience',
          description: 'Turn your celebration into an unforgettable coffee house party! Enjoy reserved cozy lounge seating, gourmet celebration cake, craft drinks, and bakery platter.',
          category: 'package',
          image: '/assets/cafe-interior.jpg',
          originalPrice: 2999,
          discountedPrice: 1999,
          discountPercentage: '33% OFF',
          specialReward: 'Reserved VIP lounge seating & custom table flower arrangement',
          validity: 'Available year-round with minimum 24-hour advance booking',
          terms: [
            'Requires booking at least 24 hours prior to celebration',
            'Comfortably accommodates up to 6 guests',
            'Includes custom table banner and celebration sparkler'
          ],
          badge: 'Bestseller',
          highlights: [
            'Priority corner lounge reservation (2 hours)',
            '1 Kg Gourmet Celebration Cake of your choice',
            '6 Specialty hot coffees or iced brews',
            'Artisanal bakery and savory bites platter'
          ],
          isActive: true
        },
        {
          title: 'Group Birthday Fiesta Feast (8–12 Guests)',
          description: 'The ultimate celebration spread for your squad! Loaded savory sharing platters, unlimited iced beverages, and a grand celebratory cake.',
          category: 'group',
          image: '/assets/hero-cafe.jpg',
          originalPrice: 4800,
          discountedPrice: 3499,
          discountPercentage: '27% OFF',
          specialReward: 'Unlimited signature iced teas & commemorative group Polaroid',
          validity: 'Valid for group bookings of 8 or more with advance reservation',
          terms: [
            'Valid for group table bookings of 8+ guests',
            '24-hour advance booking advised for seamless coordination',
            'Custom beverage substitutions available upon request'
          ],
          badge: 'Party Favorite',
          highlights: [
            'Assorted gourmet sandwich & artisanal flatbread platters',
            'Customizable celebration cake with personalized plaque',
            'Free-flowing signature iced teas & cold brews',
            'Dedicated server and festive café music shoutout'
          ],
          isActive: true
        },
        {
          title: 'Warm Fairy-Light Decor & Cake Package',
          description: 'An enchanting cafe corner decorated with warm fairy lights, helium balloon cluster, floral accents, and a personalized celebratory mini-cake.',
          category: 'decor',
          image: '/assets/barista-pour.jpg',
          originalPrice: 1800,
          discountedPrice: 1199,
          discountPercentage: '33% OFF',
          specialReward: 'Warm fairy-light table styling & photo backdrop props',
          validity: 'Available daily with minimum 12-hour advance notice',
          terms: [
            'Table styling prepared 30 minutes prior to your arrival',
            'Decorative props and backdrop available for celebration duration',
            'Custom birthday message text submitted during booking'
          ],
          badge: 'Festive Vibes',
          highlights: [
            'Aesthetic warm fairy-light canopy & fresh table florals',
            'Color-coordinated helium balloon cluster',
            'Custom welcoming entrance chalkboard easel',
            'Handcrafted mini celebration cake'
          ],
          isActive: true
        }
      ]);
      console.log('✅ Default Birthday Offers seeded successfully into database!');
    }
  } catch (err) {
    console.error('Error auto-seeding birthday offers:', err);
  }
});
