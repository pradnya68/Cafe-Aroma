import express from 'express';
import { protect, superAdminOnly } from '../middleware/authMiddleware.js';
import {
  getSuperadminDashboard,
  getAdmins,
  createAdmin,
  getAdminById,
  updateAdmin,
  updateAdminStatus,
} from '../controllers/superadminController.js';

const router = express.Router();

router.use(protect, superAdminOnly);

router.get('/dashboard', getSuperadminDashboard);
router.route('/admins').get(getAdmins).post(createAdmin);
router.route('/admins/:id').get(getAdminById).put(updateAdmin);
router.patch('/admins/:id/status', updateAdminStatus);

export default router;
