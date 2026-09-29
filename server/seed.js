import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Category from './models/Category.js';
import MenuItem from './models/MenuItem.js';
import Testimonial from './models/Testimonial.js';
import Order from './models/Order.js';
import Reservation from './models/Reservation.js';
import ContactMessage from './models/ContactMessage.js';
import NewsletterSubscriber from './models/NewsletterSubscriber.js';
import { categoriesData, menuItemsData, testimonialsData } from './services/seedData.js';

dotenv.config();

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cafe_aroma';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected for seeding.');

    // Clear existing collections
    console.log('Clearing existing collections...');
    await User.deleteMany();
    await Category.deleteMany();
    await MenuItem.deleteMany();
    await Testimonial.deleteMany();
    await Order.deleteMany();
    await Reservation.deleteMany();
    await ContactMessage.deleteMany();
    await NewsletterSubscriber.deleteMany();

    // Create users (passwords are auto-hashed in pre-save hook)
    console.log('Creating users...');
    const adminUser = await User.create({
      name: 'Café Aroma Admin',
      email: 'admin@cafearoma.com',
      password: 'admin123',
      role: 'admin',
    });

    const superAdminUser = await User.create({
      name: 'Café Aroma Superadmin',
      email: process.env.SUPERADMIN_EMAIL || 'superadmin@cafearoma.com',
      password: process.env.SUPERADMIN_PASSWORD || 'superadmin123',
      role: 'superadmin',
    });

    const customerUser = await User.create({
      name: 'Sophia Patel',
      email: 'customer@example.com',
      password: 'customer123',
      role: 'user',
    });

    console.log(`Created Admin: ${adminUser.email} / admin123`);
    console.log(`Created Superadmin: ${superAdminUser.email} / ${process.env.SUPERADMIN_PASSWORD || 'superadmin123'}`);
    console.log(`Created Customer: ${customerUser.email} / customer123`);

    // Insert categories
    console.log('Creating categories...');
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`Created ${createdCategories.length} categories.`);

    // Insert menu items
    console.log('Creating menu items...');
    const createdMenuItems = await MenuItem.insertMany(menuItemsData);
    console.log(`Created ${createdMenuItems.length} menu items.`);

    // Insert testimonials
    console.log('Creating testimonials...');
    const createdTestimonials = await Testimonial.insertMany(testimonialsData);
    console.log(`Created ${createdTestimonials.length} testimonials.`);

    // Insert sample reservations
    console.log('Creating initial reservations...');
    await Reservation.create([
      {
        name: 'Aarav Mehta',
        email: 'aarav@example.com',
        phone: '+91 98220 12345',
        date: '2026-09-25',
        time: '9:30 AM',
        guests: '2 guests',
        specialRequest: 'Window table with morning light please',
        status: 'confirmed',
      },
      {
        name: 'Ananya Deshmukh',
        email: 'ananya@example.com',
        phone: '+91 97654 32109',
        date: '2026-09-26',
        time: '6:00 PM',
        guests: '4 guests',
        specialRequest: 'Celebrating anniversary',
        status: 'pending',
      },
    ]);

    // Insert sample orders
    console.log('Creating initial orders...');
    await Order.create([
      {
        user: customerUser._id,
        items: [
          {
            menuItem: createdMenuItems[1]._id,
            name: createdMenuItems[1].name,
            price: createdMenuItems[1].price,
            quantity: 2,
            image: createdMenuItems[1].image,
          },
          {
            menuItem: createdMenuItems[7]._id,
            name: createdMenuItems[7].name,
            price: createdMenuItems[7].price,
            quantity: 1,
            image: createdMenuItems[7].image,
          },
        ],
        totalAmount: 460,
        status: 'preparing',
        customerDetails: {
          name: 'Sophia Patel',
          email: 'customer@example.com',
          phone: '+91 98234 56789',
          orderType: 'dine-in',
          tableNumber: 'Table 4',
          specialNotes: 'Extra hot cappuccino please',
        },
      },
      {
        user: null,
        items: [
          {
            menuItem: createdMenuItems[5]._id,
            name: createdMenuItems[5].name,
            price: createdMenuItems[5].price,
            quantity: 1,
            image: createdMenuItems[5].image,
          },
        ],
        totalAmount: 220,
        status: 'completed',
        customerDetails: {
          name: 'Kunal Joshi',
          email: 'kunal@example.com',
          phone: '+91 98877 66554',
          orderType: 'takeaway',
          specialNotes: 'Almond milk substitution if possible',
        },
      },
    ]);

    // Insert sample contact messages
    console.log('Creating initial contact messages...');
    await ContactMessage.create([
      {
        name: 'Tanvi Shah',
        email: 'tanvi@example.com',
        phone: '+91 99887 76655',
        message: 'Do you host private coffee tasting workshops on weekends?',
      },
    ]);

    // Insert sample newsletter subscribers
    console.log('Creating initial newsletter subscribers...');
    await NewsletterSubscriber.create([
      { email: 'coffee.lover@example.com' },
      { email: 'rohit.k@example.com' },
    ]);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedDB();
