import express from 'express';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonialStatus,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getTestimonials)
  .post(createTestimonial);

router.route('/:id/approve')
  .put(protect, adminOnly, updateTestimonialStatus);

router.route('/:id')
  .delete(protect, adminOnly, deleteTestimonial);

export default router;
