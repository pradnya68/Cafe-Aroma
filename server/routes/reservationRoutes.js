import express from 'express';
import {
  createReservation,
  getReservations,
  getReservationById,
  updateReservationStatus,
  deleteReservation,
} from '../controllers/reservationController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createReservation)
  .get(protect, adminOnly, getReservations);

router.route('/:id')
  .get(protect, adminOnly, getReservationById)
  .delete(protect, adminOnly, deleteReservation);

router.route('/:id/status')
  .put(protect, adminOnly, updateReservationStatus);

export default router;
