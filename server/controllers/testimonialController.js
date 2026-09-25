import Testimonial from '../models/Testimonial.js';

// @desc   Get approved testimonials for guests
// @route  GET /api/testimonials
// @access Public
export const getTestimonials = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' && req.user && req.user.role === 'admin' 
      ? {} 
      : { approved: true };

    const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Create testimonial
// @route  POST /api/testimonials
// @access Public / Authenticated
export const createTestimonial = async (req, res, next) => {
  try {
    const { name, role, message, rating } = req.body;

    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name and testimonial message are required',
      });
    }

    const testimonial = await Testimonial.create({
      name,
      role: role || 'Guest',
      message,
      rating: Number(rating) || 5,
      approved: true, // Auto-approve or flag
    });

    res.status(201).json({
      success: true,
      data: testimonial,
      message: 'Thank you for sharing your experience with Café Aroma!',
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Toggle testimonial approval
// @route  PUT /api/testimonials/:id/approve
// @access Private (Admin)
export const updateTestimonialStatus = async (req, res, next) => {
  try {
    const { approved } = req.body;
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { approved: Boolean(approved) },
      { new: true }
    );

    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    res.status(200).json({
      success: true,
      data: testimonial,
      message: `Testimonial is now ${testimonial.approved ? 'visible' : 'hidden'}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete testimonial
// @route  DELETE /api/testimonials/:id
// @access Private (Admin)
export const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    await testimonial.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
