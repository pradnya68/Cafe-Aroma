import BirthdayOffer from '../models/BirthdayOffer.js';

// @desc   Get active birthday offers (or all for admin)
// @route  GET /api/birthday-offers
// @access Public (filtered by isActive) / Admin (can view all via ?all=true)
export const getBirthdayOffers = async (req, res, next) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const offers = await BirthdayOffer.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get single birthday offer
// @route  GET /api/birthday-offers/:id
// @access Public
export const getBirthdayOfferById = async (req, res, next) => {
  try {
    const offer = await BirthdayOffer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Birthday offer not found',
      });
    }

    res.status(200).json({
      success: true,
      data: offer,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Create birthday offer
// @route  POST /api/birthday-offers
// @access Private (Admin)
export const createBirthdayOffer = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      image,
      originalPrice,
      discountedPrice,
      discountPercentage,
      specialReward,
      validity,
      terms,
      badge,
      highlights,
      isActive,
    } = req.body;

    if (!title || !description || !validity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and validity',
      });
    }

    const offer = await BirthdayOffer.create({
      title,
      description,
      category: category || 'combo',
      image: image || '/assets/pastry-breakfast.jpg',
      originalPrice: originalPrice ? Number(originalPrice) : null,
      discountedPrice: discountedPrice ? Number(discountedPrice) : null,
      discountPercentage: discountPercentage || '',
      specialReward: specialReward || '',
      validity,
      terms: Array.isArray(terms) ? terms : (terms ? terms.split(',').map((t) => t.trim()) : []),
      badge: badge || '',
      highlights: Array.isArray(highlights) ? highlights : (highlights ? highlights.split(',').map((h) => h.trim()) : []),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json({
      success: true,
      data: offer,
      message: 'Birthday offer created successfully 🎉',
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update birthday offer
// @route  PUT /api/birthday-offers/:id
// @access Private (Admin)
export const updateBirthdayOffer = async (req, res, next) => {
  try {
    const offer = await BirthdayOffer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Birthday offer not found',
      });
    }

    const updated = await BirthdayOffer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: updated,
      message: 'Birthday offer updated successfully ✨',
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Toggle birthday offer active status
// @route  PUT /api/birthday-offers/:id/toggle
// @access Private (Admin)
export const toggleBirthdayOfferStatus = async (req, res, next) => {
  try {
    const offer = await BirthdayOffer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Birthday offer not found',
      });
    }

    offer.isActive = !offer.isActive;
    await offer.save();

    res.status(200).json({
      success: true,
      data: offer,
      message: `Offer "${offer.title}" is now ${offer.isActive ? 'active' : 'inactive'}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete birthday offer
// @route  DELETE /api/birthday-offers/:id
// @access Private (Admin)
export const deleteBirthdayOffer = async (req, res, next) => {
  try {
    const offer = await BirthdayOffer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Birthday offer not found',
      });
    }

    await offer.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Birthday offer removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
