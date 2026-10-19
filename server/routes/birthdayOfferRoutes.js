import express from 'express';
import {
  getBirthdayOffers,
  getBirthdayOfferById,
  createBirthdayOffer,
  updateBirthdayOffer,
  toggleBirthdayOfferStatus,
  deleteBirthdayOffer,
} from '../controllers/birthdayOfferController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getBirthdayOffers)
  .post(protect, adminOnly, createBirthdayOffer);

router.route('/:id')
  .get(getBirthdayOfferById)
  .put(protect, adminOnly, updateBirthdayOffer)
  .delete(protect, adminOnly, deleteBirthdayOffer);

router.route('/:id/toggle')
  .put(protect, adminOnly, toggleBirthdayOfferStatus);

export default router;
