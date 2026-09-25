import express from 'express';
import {
  subscribeNewsletter,
  getNewsletterSubscribers,
} from '../controllers/newsletterController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(subscribeNewsletter)
  .get(protect, adminOnly, getNewsletterSubscribers);

export default router;
