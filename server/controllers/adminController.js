import Order from '../models/Order.js';
import Reservation from '../models/Reservation.js';
import MenuItem from '../models/MenuItem.js';
import ContactMessage from '../models/ContactMessage.js';
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';
import User from '../models/User.js';

// @desc   Get comprehensive admin dashboard statistics
// @route  GET /api/admin/stats
// @access Private (Admin)
export const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalOrders,
      totalReservations,
      totalMenuItems,
      totalSubscribers,
      totalMessages,
      totalUsers,
      orders,
      recentReservations,
      recentMessages,
    ] = await Promise.all([
      Order.countDocuments(),
      Reservation.countDocuments(),
      MenuItem.countDocuments(),
      NewsletterSubscriber.countDocuments(),
      ContactMessage.countDocuments(),
      User.countDocuments(),
      Order.find().sort({ createdAt: -1 }),
      Reservation.find().sort({ createdAt: -1 }).limit(5),
      ContactMessage.find().sort({ createdAt: -1 }).limit(5),
    ]);

    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const pendingReservations = await Reservation.countDocuments({ status: 'pending' });

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        totalReservations,
        pendingReservations,
        totalMenuItems,
        totalSubscribers,
        totalMessages,
        totalUsers,
        recentOrders: orders.slice(0, 5),
        recentReservations,
        recentMessages,
      },
    });
  } catch (error) {
    next(error);
  }
};
