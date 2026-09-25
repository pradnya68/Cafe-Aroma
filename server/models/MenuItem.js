import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide item name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide item description'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide item price'],
      min: [0, 'Price must be positive'],
    },
    category: {
      type: String,
      required: [true, 'Please specify category'],
      trim: true,
      lowercase: true,
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL or path'],
    },
    badge: {
      type: String,
      default: '',
      trim: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
