import Order from '../models/Order.js';

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

    // If not admin, only fetch own orders
    if (req.user.role !== 'admin') {
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
