import Order from '../models/Order.js';
import { calculateDistance } from '../utils/geo.js';

// @desc   Create new order
// @route  POST /api/orders
// @access Public (or authenticated)
export const createOrder = async (req, res, next) => {
  try {
    const { items, totalAmount, customerDetails } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'No order items specified',
      });
    }

    if (!customerDetails || !customerDetails.name || !customerDetails.phone) {
      return res.status(400).json({
        success: false,
        message: 'Customer name and phone number are required',
      });
    }

    // Attach user ID if authenticated via token
    const userId = req.user ? req.user._id : null;

    let deliveryDistanceKm = null;

    if (customerDetails.orderType === 'delivery') {
      const { deliveryLocation } = customerDetails;
      
      if (!deliveryLocation || !deliveryLocation.latitude || !deliveryLocation.longitude) {
        return res.status(400).json({
          success: false,
          message: 'Delivery coordinates are required for delivery orders.',
        });
      }

      const cafeLat = parseFloat(process.env.CAFE_LATITUDE);
      const cafeLon = parseFloat(process.env.CAFE_LONGITUDE);
      const radiusKm = parseFloat(process.env.DELIVERY_RADIUS_KM || 10);

      if (isNaN(cafeLat) || isNaN(cafeLon)) {
        return res.status(500).json({
          success: false,
          message: 'Server configuration error: Cafe coordinates not set.',
        });
      }

      deliveryDistanceKm = calculateDistance(cafeLat, cafeLon, deliveryLocation.latitude, deliveryLocation.longitude);

      if (deliveryDistanceKm > radiusKm) {
        return res.status(400).json({
          success: false,
          message: `Delivery is available only within ${radiusKm} km of Café Aroma.`,
          distanceKm: parseFloat(deliveryDistanceKm.toFixed(2)),
          maxDeliveryRadiusKm: radiusKm
        });
      }
      
      // Save it back to customerDetails to store in DB
      customerDetails.deliveryDistanceKm = deliveryDistanceKm;
    }

    const order = await Order.create({
      user: userId,
      items,
      totalAmount,
      customerDetails,
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      data: order,
      message: 'Order placed successfully! We are preparing your order.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get all orders
// @route  GET /api/orders
// @access Private (Admin or authenticated user orders)
export const getOrders = async (req, res, next) => {
  try {
    let query = {};

    // If not admin or superadmin, only fetch own orders
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      query.user = req.user._id;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get single order by ID
// @route  GET /api/orders/:id
// @access Private / Public with order ID
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Update order status
// @route  PUT /api/orders/:id/status
// @access Private (Admin)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
      message: `Order status updated to '${status}'`,
    });
  } catch (error) {
    next(error);
  }
};
