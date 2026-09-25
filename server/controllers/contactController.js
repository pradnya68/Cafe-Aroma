import ContactMessage from '../models/ContactMessage.js';

// @desc   Send contact message
// @route  POST /api/contact
// @access Public
export const createContactMessage = async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required',
      });
    }

    const contact = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      message,
    });

    res.status(201).json({
      success: true,
      data: contact,
      message: 'Thank you for reaching out! We will reply to your message shortly.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get all contact messages
// @route  GET /api/contact
// @access Private (Admin)
export const getContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};
