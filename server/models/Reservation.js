import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email address'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Please select reservation date'],
    },
    time: {
      type: String,
      required: [true, 'Please select reservation time'],
    },
    guests: {
      type: String,
      required: [true, 'Please select number of guests'],
    },
    specialRequest: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'seated', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    isBirthdayBooking: {
      type: Boolean,
      default: false,
    },
    offerTitle: {
      type: String,
      default: '',
    },
    offerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BirthdayOffer',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;
