import Reservation from '../models/Reservation.js';

// @desc   Create new table reservation
// @route  POST /api/reservations
// @access Public
export const createReservation = async (req, res, next) => {
  try {
    const { name, email, phone, date, time, guests, specialRequest, isBirthdayBooking, offerTitle, offerId } = req.body;

    if (!name || !email || !phone || !date || !time || !guests) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields (name, email, phone, date, time, and guests)',
      });
    }

    const reservation = await Reservation.create({
      name,
      email,
      phone,
      date,
      time,
      guests,
      specialRequest: specialRequest || '',
      status: 'confirmed',
      isBirthdayBooking: Boolean(isBirthdayBooking),
      offerTitle: offerTitle || '',
      offerId: offerId || null,
    });

    res.status(201).json({
      success: true,
      data: reservation,
      message: 'Your table has been reserved successfully! ☕',
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get all reservations
// @route  GET /api/reservations
// @access Private (Admin)
export const getReservations = async (req, res, next) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get single reservation
// @route  GET /api/reservations/:id
// @access Private (Admin)
export const getReservationById = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update reservation status
// @route  PUT /api/reservations/:id/status
// @access Private (Admin)
export const updateReservationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'seated', 'cancelled', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    res.status(200).json({
      success: true,
      data: reservation,
      message: `Reservation status updated to '${status}'`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete reservation
// @route  DELETE /api/reservations/:id
// @access Private (Admin)
export const deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    await reservation.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Reservation deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
