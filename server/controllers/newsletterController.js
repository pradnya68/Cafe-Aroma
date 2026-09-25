import NewsletterSubscriber from '../models/NewsletterSubscriber.js';

// @desc   Subscribe to newsletter
// @route  POST /api/newsletter
// @access Public
export const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    const existing = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "You're already subscribed to the Aroma circle!",
      });
    }

    await NewsletterSubscriber.create({
      email: email.toLowerCase(),
    });

    res.status(201).json({
      success: true,
      message: 'Welcome to the Aroma circle! Watch your inbox for seasonal stories and brews.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get newsletter subscribers
// @route  GET /api/newsletter
// @access Private (Admin)
export const getNewsletterSubscribers = async (req, res, next) => {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    next(error);
  }
};
