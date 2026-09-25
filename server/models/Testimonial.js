import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide name'],
      trim: true,
    },
    role: {
      type: String,
      default: 'Guest',
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide a review / quote'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating'],
      min: 1,
      max: 5,
      default: 5,
    },
    image: {
      type: String,
      default: '',
    },
    initials: {
      type: String,
      default: '',
    },
    approved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-fill initials if not present
testimonialSchema.pre('save', function (next) {
  if (this.name && !this.initials) {
    this.initials = this.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }
  next();
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
