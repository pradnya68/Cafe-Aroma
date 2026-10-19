import mongoose from 'mongoose';

const birthdayOfferSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide offer title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide offer description'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['combo', 'dessert', 'package', 'group', 'decor', 'special'],
      default: 'combo',
    },
    image: {
      type: String,
      default: '/assets/pastry-breakfast.jpg',
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    discountedPrice: {
      type: Number,
      default: null,
    },
    discountPercentage: {
      type: String,
      default: '',
      trim: true,
    },
    specialReward: {
      type: String,
      default: '',
      trim: true,
    },
    validity: {
      type: String,
      required: [true, 'Please specify validity dates or terms'],
      trim: true,
    },
    terms: {
      type: [String],
      default: [],
    },
    badge: {
      type: String,
      default: '',
      trim: true,
    },
    highlights: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    orderCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const BirthdayOffer = mongoose.model('BirthdayOffer', birthdayOfferSchema);
export default BirthdayOffer;
