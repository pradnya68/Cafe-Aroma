import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Optional user attachment for guest vs logged-in order placement
const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_cafe_aroma_jwt_key_2026_secure');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (e) {
      // Ignore invalid token for guest order
    }
  }
  next();
};

router.route('/')
  .post(optionalAuth, createOrder)
  .get(protect, getOrders);

router.route('/:id')
  .get(getOrderById);

router.route('/:id/status')
  .put(protect, adminOnly, updateOrderStatus);

export default router;
