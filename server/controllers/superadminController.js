import User from '../models/User.js';
import Order from '../models/Order.js';
import Reservation from '../models/Reservation.js';
import MenuItem from '../models/MenuItem.js';

export const getSuperadminDashboard = async (req, res, next) => {
  try {
    const [
      totalOrders,
      totalReservations,
      totalMenuItems,
      totalCustomers,
      totalAdmins,
      activeAdmins,
      inactiveAdmins,
      orders,
    ] = await Promise.all([
      Order.countDocuments(),
      Reservation.countDocuments(),
      MenuItem.countDocuments(),
      User.countDocuments({ role: { $in: ['customer', 'user'] } }),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ role: 'admin', isActive: true }),
      User.countDocuments({ role: 'admin', isActive: false }),
      Order.find().sort({ createdAt: -1 }),
    ]);

    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    const completedOrders = orders.filter((o) => o.status === 'completed').length;
    const confirmedOrders = orders.filter((o) => o.status === 'confirmed').length;

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        confirmedOrders,
        completedOrders,
        totalReservations,
        totalMenuItems,
        totalCustomers,
        totalAdmins,
        activeAdmins,
        inactiveAdmins,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAdmins = async (req, res, next) => {
  try {
    const admins = await User.find({ role: { $in: ['admin', 'superadmin'] } }).select('-password');
    res.status(200).json({ success: true, data: admins });
  } catch (error) {
    next(error);
  }
};

export const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const adminRole = role === 'superadmin' ? 'superadmin' : 'admin';
    const admin = await User.create({ name, email, password, role: adminRole, isActive: true });
    res.status(201).json({ success: true, data: { _id: admin._id, name: admin.name, email: admin.email, role: admin.role, isActive: admin.isActive } });
  } catch (error) {
    next(error);
  }
};

export const getAdminById = async (req, res, next) => {
  try {
    const admin = await User.findById(req.params.id).select('-password');
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    next(error);
  }
};

export const updateAdmin = async (req, res, next) => {
  try {
    const { name, email, role, password } = req.body;
    const admin = await User.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    admin.name = name || admin.name;
    admin.email = email || admin.email;
    if (role && (role === 'admin' || role === 'superadmin')) {
      admin.role = role;
    }
    if (password) {
      admin.password = password; // pre-save hook will hash it
    }
    await admin.save();
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    next(error);
  }
};

export const updateAdminStatus = async (req, res, next) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    if (admin.role === 'superadmin' && req.user._id.toString() === admin._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot deactivate yourself' });
    }
    admin.isActive = req.body.isActive !== undefined ? req.body.isActive : !admin.isActive;
    await admin.save();
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    next(error);
  }
};
