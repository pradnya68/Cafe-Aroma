import React, { useState, useEffect } from 'react';
import {
  adminAPI,
  menuAPI,
  orderAPI,
  reservationAPI,
  contactAPI,
  newsletterAPI,
  testimonialAPI,
  categoryAPI,
  birthdayOfferAPI,
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  CalendarCheck,
  MessageSquare,
  Mail,
  Quote,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  X,
  Loader2,
  LogOut,
  Bell,
  Search,
  Menu as MenuIcon,
  Star,
  ShieldCheck,
  ToggleLeft,
  Gift
} from 'lucide-react';

const getStatusBadgeStyles = (status) => {
  let styles = "bg-gray-100 text-gray-700 border-gray-200";
  const s = (status || '').toLowerCase();
  
  if (['confirmed', 'completed', 'resolved', 'published', 'seated', 'live', 'true'].includes(s)) {
    styles = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (['pending', 'preparing', 'new', 'in progress'].includes(s)) {
    styles = "bg-amber-50 text-amber-700 border-amber-200";
  } else if (['cancelled', 'hidden', 'false'].includes(s)) {
    styles = "bg-red-50 text-red-700 border-red-200";
  } else if (['ready'].includes(s)) {
    styles = "bg-blue-50 text-blue-700 border-blue-200";
  }
  return styles;
};

const StatusBadge = ({ status }) => {
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeStyles(status)}`}>
      {status === 'true' ? 'Active' : status === 'false' ? 'Inactive' : status}
    </span>
  );
};

const EmptyState = ({ icon: Icon, title, message }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center text-ink-muted mb-4">
      <Icon size={24} />
    </div>
    <h3 className="text-espresso font-semibold mb-1 text-lg">{title}</h3>
    <p className="text-sm text-ink-muted max-w-sm">{message}</p>
  </div>
);

const Pagination = ({ total, itemsPerPage, currentPage, onPageChange }) => {
  const pages = Math.ceil(total / itemsPerPage);
  if (pages <= 1) return null;
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-line bg-gray-50/50 gap-4">
      <span className="text-xs text-ink-muted font-medium">
        Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, total)} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className="px-3 py-1.5 border border-line rounded-lg text-xs font-semibold disabled:opacity-50 hover:bg-cream transition">Previous</button>
        {Array.from({ length: pages }).map((_, i) => (
          <button key={i} onClick={() => onPageChange(i + 1)} className={`px-3 py-1.5 border rounded-lg text-xs font-semibold transition ${currentPage === i + 1 ? 'bg-espresso text-white border-espresso shadow-sm' : 'border-line hover:bg-cream text-espresso'}`}>{i + 1}</button>
        ))}
        <button disabled={currentPage === pages} onClick={() => onPageChange(currentPage + 1)} className="px-3 py-1.5 border border-line rounded-lg text-xs font-semibold disabled:opacity-50 hover:bg-cream transition">Next</button>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  
  // UI States
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // Data States
  const [stats, setStats] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [birthdayOffers, setBirthdayOffers] = useState([]);

  // Modal States
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [menuForm, setMenuForm] = useState({
    name: '', description: '', price: '', category: 'coffee', image: '/assets/hero-cafe.jpg', badge: '', available: true, featured: false,
  });
  const [addAdminModalOpen, setAddAdminModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [adminForm, setAdminForm] = useState({ name: '', email: '', password: '', role: 'admin' });
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Birthday Offers Modal State
  const [birthdayModalOpen, setBirthdayModalOpen] = useState(false);
  const [editingBirthdayOffer, setEditingBirthdayOffer] = useState(null);
  const [birthdayForm, setBirthdayForm] = useState({
    title: '',
    description: '',
    category: 'combo',
    image: '/assets/pastry-breakfast.jpg',
    originalPrice: '',
    discountedPrice: '',
    discountPercentage: '',
    specialReward: '',
    validity: '',
    terms: '',
    badge: '',
    highlights: '',
    isActive: true,
  });

  // Tab Filtering/Pagination States
  const [ordersState, setOrdersState] = useState({ search: '', status: 'all', type: 'all', page: 1 });
  const [resState, setResState] = useState({ search: '', status: 'all', page: 1 });
  const [menuState, setMenuState] = useState({ search: '', category: 'all', page: 1 });
  const [inqState, setInqState] = useState({ search: '', page: 1 });
  const [subState, setSubState] = useState({ search: '', page: 1 });
  const [revState, setRevState] = useState({ search: '', status: 'all', page: 1 });
  const [bdayState, setBdayState] = useState({ search: '', status: 'all', page: 1 });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, menuRes, ordersRes, reservationsRes, contactRes, newsRes, testRes, catRes, bdayRes] = await Promise.all([
        adminAPI.getStats(), menuAPI.getAll(), orderAPI.getAll(), reservationAPI.getAll(), contactAPI.getAll(), newsletterAPI.getAll(), testimonialAPI.getAll(true), categoryAPI.getAll(), birthdayOfferAPI.getAll(true),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (menuRes.data.success) setMenuItems(menuRes.data.data);
      if (ordersRes.data.success) setOrders(ordersRes.data.data.reverse()); // latest first
      if (reservationsRes.data.success) setReservations(reservationsRes.data.data.reverse());
      if (contactRes.data.success) setContactMessages(contactRes.data.data.reverse());
      if (newsRes.data.success) setSubscribers(newsRes.data.data.reverse());
      if (testRes.data.success) setTestimonials(testRes.data.data.reverse());
      if (catRes.data.success) setCategories(catRes.data.data);
      if (bdayRes.data?.success) setBirthdayOffers(bdayRes.data.data);

      if (user?.role === 'superadmin') {
        try {
          const superadminStatsRes = await fetch('/api/superadmin/dashboard', { headers: { Authorization: `Bearer ${localStorage.getItem('cafe_aroma_token')}` } });
          const superStats = await superadminStatsRes.json();
          if (superStats.success) {
            setStats(prev => ({ ...prev, ...superStats.data }));
          }

          const adminsRes = await fetch('/api/superadmin/admins', { headers: { Authorization: `Bearer ${localStorage.getItem('cafe_aroma_token')}` } });
          const adminsData = await adminsRes.json();
          if (adminsData.success) {
            setAdmins(adminsData.data);
          }
        } catch (superErr) {
          console.error('Failed to load superadmin data:', superErr);
        }
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
      showNotification('Unable to load some dashboard data. Please try refreshing.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const showNotification = (msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleSaveAdmin = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const url = editingAdmin ? `/api/superadmin/admins/${editingAdmin._id}` : '/api/superadmin/admins';
      const method = editingAdmin ? 'PUT' : 'POST';
      const payload = { ...adminForm };
      if (editingAdmin && !payload.password) delete payload.password; // don't send empty password

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('cafe_aroma_token')}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showNotification(`${editingAdmin ? 'Updated' : 'Created'} admin "${data.data.name}"`);
        setAddAdminModalOpen(false);
        fetchDashboardData();
      } else {
        alert(data.message || 'Error saving admin');
      }
    } catch (err) {
      alert('Error saving admin');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOpenAddAdmin = () => {
    setEditingAdmin(null);
    setAdminForm({ name: '', email: '', password: '', role: 'admin' });
    setAddAdminModalOpen(true);
  };

  const handleOpenEditAdmin = (admin) => {
    setEditingAdmin(admin);
    setAdminForm({ name: admin.name, email: admin.email, password: '', role: admin.role });
    setAddAdminModalOpen(true);
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setMenuForm({ name: '', description: '', price: '', category: 'coffee', image: '/assets/barista-pour.jpg', badge: '', available: true, featured: false });
    setMenuModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setMenuForm({ name: item.name, description: item.description, price: item.price, category: item.category, image: item.image, badge: item.badge || '', available: item.available, featured: item.featured || false });
    setMenuModalOpen(true);
  };

  const handleSaveMenuItem = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      if (editingItem) {
        const res = await menuAPI.update(editingItem._id, menuForm);
        if (res.data.success) showNotification(`Updated "${res.data.data.name}"`);
      } else {
        const res = await menuAPI.create(menuForm);
        if (res.data.success) showNotification(`Created "${res.data.data.name}"`);
      }
      setMenuModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving menu item');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleAvailable = async (item) => {
    try {
      await menuAPI.update(item._id, { available: !item.available });
      setMenuItems((prev) => prev.map((i) => (i._id === item._id ? { ...i, available: !i.available } : i)));
      showNotification(`Availability updated for ${item.name}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMenuItem = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await menuAPI.delete(id);
      setMenuItems((prev) => prev.filter((i) => i._id !== id));
      showNotification(`Deleted "${name}"`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
      showNotification(`Order status updated to "${newStatus}"`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateReservationStatus = async (resId, newStatus) => {
    try {
      await reservationAPI.updateStatus(resId, newStatus);
      setReservations((prev) => prev.map((r) => (r._id === resId ? { ...r, status: newStatus } : r)));
      showNotification(`Reservation status updated to "${newStatus}"`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteReservation = async (id) => {
    if (!window.confirm('Delete this reservation?')) return;
    try {
      await reservationAPI.delete(id);
      setReservations((prev) => prev.filter((r) => r._id !== id));
      showNotification('Reservation removed');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTestimonial = async (t) => {
    try {
      await testimonialAPI.updateStatus(t._id, !t.approved);
      setTestimonials((prev) => prev.map((item) => (item._id === t._id ? { ...item, approved: !item.approved } : item)));
      showNotification('Review status updated');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAdminStatus = async (adminId, currentStatus) => {
    try {
      const res = await fetch(`/api/superadmin/admins/${adminId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('cafe_aroma_token')}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        setAdmins(prev => prev.map(a => a._id === adminId ? { ...a, isActive: !currentStatus } : a));
        showNotification('Admin status updated');
      } else {
        showNotification(data.message, 'error');
      }
    } catch (err) {
      console.error(err);
      showNotification('Failed to update admin status', 'error');
    }
  };

  const handleSaveBirthdayOffer = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const payload = {
        ...birthdayForm,
        originalPrice: birthdayForm.originalPrice ? Number(birthdayForm.originalPrice) : null,
        discountedPrice: birthdayForm.discountedPrice !== '' ? Number(birthdayForm.discountedPrice) : null,
      };

      if (editingBirthdayOffer) {
        const res = await birthdayOfferAPI.update(editingBirthdayOffer._id, payload);
        if (res.data.success) {
          showNotification(`Updated offer "${res.data.data.title}"`);
        }
      } else {
        const res = await birthdayOfferAPI.create(payload);
        if (res.data.success) {
          showNotification(`Created offer "${res.data.data.title}"`);
        }
      }
      setBirthdayModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving birthday offer');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleOpenAddBirthdayOffer = () => {
    setEditingBirthdayOffer(null);
    setBirthdayForm({
      title: '',
      description: '',
      category: 'combo',
      image: '/assets/pastry-breakfast.jpg',
      originalPrice: '',
      discountedPrice: '',
      discountPercentage: '',
      specialReward: '',
      validity: '',
      terms: '',
      badge: '',
      highlights: '',
      isActive: true,
    });
    setBirthdayModalOpen(true);
  };

  const handleOpenEditBirthdayOffer = (offer) => {
    setEditingBirthdayOffer(offer);
    setBirthdayForm({
      title: offer.title || '',
      description: offer.description || '',
      category: offer.category || 'combo',
      image: offer.image || '/assets/pastry-breakfast.jpg',
      originalPrice: offer.originalPrice ?? '',
      discountedPrice: offer.discountedPrice ?? '',
      discountPercentage: offer.discountPercentage || '',
      specialReward: offer.specialReward || '',
      validity: offer.validity || '',
      terms: Array.isArray(offer.terms) ? offer.terms.join(', ') : (offer.terms || ''),
      badge: offer.badge || '',
      highlights: Array.isArray(offer.highlights) ? offer.highlights.join(', ') : (offer.highlights || ''),
      isActive: offer.isActive !== undefined ? offer.isActive : true,
    });
    setBirthdayModalOpen(true);
  };

  const handleToggleBirthdayOffer = async (offer) => {
    try {
      await birthdayOfferAPI.toggleStatus(offer._id);
      setBirthdayOffers((prev) =>
        prev.map((o) => (o._id === offer._id ? { ...o, isActive: !o.isActive } : o))
      );
      showNotification(`Offer status updated for "${offer.title}"`);
    } catch (err) {
      console.error(err);
      showNotification('Failed to toggle offer status', 'error');
    }
  };

  const handleDeleteBirthdayOffer = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await birthdayOfferAPI.delete(id);
      setBirthdayOffers((prev) => prev.filter((o) => o._id !== id));
      showNotification(`Deleted offer "${title}"`);
    } catch (err) {
      console.error(err);
      showNotification('Failed to delete offer', 'error');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'reservations', label: 'Reservations', icon: CalendarCheck },
    { id: 'birthday', label: 'Birthday Offers', icon: Gift },
    { id: 'messages', label: 'Inquiries', icon: MessageSquare },
    { id: 'newsletter', label: 'Subscribers', icon: Mail },
    { id: 'testimonials', label: 'Reviews', icon: Quote },
  ];

  if (user?.role === 'superadmin') {
    tabs.push({ id: 'admins', label: 'Admin Management', icon: ShieldCheck });
  }

  const getPageTitle = () => tabs.find(t => t.id === activeTab)?.label || 'Dashboard';

  // --- Render Functions ---

  const renderAdmins = () => {
    return (
      <div className="bg-white rounded-xl border border-line shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-5 border-b border-line bg-gray-50/50 flex justify-between items-center">
          <h3 className="font-display text-lg font-semibold text-espresso">Admin Management</h3>
          <button 
            onClick={handleOpenAddAdmin}
            className="flex items-center justify-center gap-2 px-5 py-2 bg-espresso text-white rounded-lg text-sm font-bold hover:bg-caramel transition shadow-sm hover:shadow"
          >
             <Plus size={16} /> Add Admin
          </button>
        </div>
        <div className="flex-1 overflow-x-auto min-h-[400px]">
          {admins.length === 0 ? (
            <EmptyState icon={ShieldCheck} title="No admins found" message="No administrators available." />
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white text-ink-muted uppercase text-[10px] tracking-widest font-bold border-b border-line">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {admins.map(admin => (
                  <tr key={admin._id} className="hover:bg-cream/30 transition group">
                    <td className="px-6 py-4 font-semibold text-espresso">{admin.name}</td>
                    <td className="px-6 py-4 text-ink-muted">{admin.email}</td>
                    <td className="px-6 py-4 text-ink-muted capitalize">{admin.role}</td>
                    <td className="px-6 py-4"><StatusBadge status={admin.isActive ? 'Active' : 'Inactive'} /></td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenEditAdmin(admin)}
                          className="p-2 text-ink-muted hover:bg-cream hover:text-espresso rounded-lg transition" title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleToggleAdminStatus(admin._id, admin.isActive)}
                          className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${admin.isActive ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'}`}
                        >
                          <ToggleLeft size={14} />
                          {admin.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  const renderOverview = () => {
    const dineInCount = orders.filter(o => o.customerDetails?.orderType === 'dine-in').length;
    const takeawayCount = orders.filter(o => o.customerDetails?.orderType === 'takeaway').length;
    const totalCalc = dineInCount + takeawayCount || 1;

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-xl border border-line shadow-sm flex items-center gap-4 transition hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp size={22} />
            </div>
            <div>
              <span className="text-[10px] text-ink-muted uppercase tracking-wider font-bold block mb-0.5">Total Revenue</span>
              <strong className="font-display text-2xl text-espresso">₹{stats?.totalRevenue?.toLocaleString() || 0}</strong>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-line shadow-sm flex items-center gap-4 transition hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <ShoppingBag size={22} />
            </div>
            <div>
              <span className="text-[10px] text-ink-muted uppercase tracking-wider font-bold block mb-0.5">Total Orders</span>
              <strong className="font-display text-2xl text-espresso">{stats?.totalOrders || 0}</strong>
              <p className="text-[10px] text-amber-600 font-semibold mt-0.5">{stats?.pendingOrders || 0} pending</p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-line shadow-sm flex items-center gap-4 transition hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CalendarCheck size={22} />
            </div>
            <div>
              <span className="text-[10px] text-ink-muted uppercase tracking-wider font-bold block mb-0.5">Reservations</span>
              <strong className="font-display text-2xl text-espresso">{stats?.totalReservations || 0}</strong>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-line shadow-sm flex items-center gap-4 transition hover:shadow-md">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Mail size={22} />
            </div>
            <div>
              <span className="text-[10px] text-ink-muted uppercase tracking-wider font-bold block mb-0.5">Subscribers</span>
              <strong className="font-display text-2xl text-espresso">{stats?.totalSubscribers || 0}</strong>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-line shadow-sm p-6">
            <h3 className="font-display text-lg font-semibold text-espresso mb-4">Revenue Overview</h3>
            <div className="h-56 bg-cream/30 border-2 border-dashed border-line rounded-xl flex items-center justify-center">
              <p className="text-sm text-ink-muted font-medium flex items-center gap-2">
                <TrendingUp size={16} /> Timeseries data visualization placeholder
              </p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-line shadow-sm p-6">
            <h3 className="font-display text-lg font-semibold text-espresso mb-6">Order Types</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2 font-semibold">
                  <span className="text-espresso">Dine-in</span>
                  <span className="text-ink-muted">{dineInCount}</span>
                </div>
                <div className="w-full bg-cream rounded-full h-2.5 overflow-hidden">
                  <div className="bg-caramel h-full rounded-full transition-all" style={{ width: `${(dineInCount/totalCalc)*100}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2 font-semibold">
                  <span className="text-espresso">Takeaway</span>
                  <span className="text-ink-muted">{takeawayCount}</span>
                </div>
                <div className="w-full bg-cream rounded-full h-2.5 overflow-hidden">
                  <div className="bg-espresso h-full rounded-full transition-all" style={{ width: `${(takeawayCount/totalCalc)*100}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-line shadow-sm overflow-hidden">
          <div className="p-5 border-b border-line flex justify-between items-center bg-gray-50/30">
            <h3 className="font-display text-lg font-semibold text-espresso">Recent Orders</h3>
            <button onClick={() => setActiveTab('orders')} className="text-xs text-caramel font-bold hover:underline px-3 py-1.5 rounded hover:bg-cream">View All Orders</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white text-ink-muted uppercase text-[10px] tracking-widest font-bold border-b border-line">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {orders.slice(0, 5).map(order => (
                  <tr key={order._id} className="hover:bg-cream/30 transition">
                    <td className="px-6 py-4 font-mono text-xs text-ink-muted">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4 font-semibold text-espresso">{order.customerDetails?.name}</td>
                    <td className="px-6 py-4 text-espresso">{order.items?.length || 0}</td>
                    <td className="px-6 py-4 font-bold text-espresso">₹{order.totalAmount}</td>
                    <td className="px-6 py-4 capitalize text-ink-muted font-medium">{order.customerDetails?.orderType}</td>
                    <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                    <td className="px-6 py-4 text-right text-xs text-ink-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan="7" className="text-center py-8 text-ink-muted text-sm">No recent orders to display.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderOrders = () => {
    const filtered = orders.filter(o => {
      const matchSearch = o._id.includes(ordersState.search) || o.customerDetails?.name.toLowerCase().includes(ordersState.search.toLowerCase());
      const matchStatus = ordersState.status === 'all' || o.status === ordersState.status;
      const matchType = ordersState.type === 'all' || o.customerDetails?.orderType?.toLowerCase() === ordersState.type.toLowerCase();
      return matchSearch && matchStatus && matchType;
    });
    const paginated = filtered.slice((ordersState.page - 1) * 10, ordersState.page * 10);

    return (
      <div className="bg-white rounded-xl border border-line shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-5 border-b border-line bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input type="text" placeholder="Search orders..." value={ordersState.search} onChange={e => setOrdersState({...ordersState, search: e.target.value, page: 1})} className="w-full pl-9 pr-3 py-2 rounded-lg border border-line text-sm focus:outline-none focus:border-caramel focus:ring-1 focus:ring-caramel transition" />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <select value={ordersState.status} onChange={e => setOrdersState({...ordersState, status: e.target.value, page: 1})} className="w-full sm:w-auto px-3 py-2 rounded-lg border border-line text-sm font-medium text-espresso focus:outline-none focus:border-caramel">
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select value={ordersState.type} onChange={e => setOrdersState({...ordersState, type: e.target.value, page: 1})} className="w-full sm:w-auto px-3 py-2 rounded-lg border border-line text-sm font-medium text-espresso focus:outline-none focus:border-caramel">
              <option value="all">All Types</option>
              <option value="dine-in">Dine-in</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
            </select>
          </div>
        </div>
        
        <div className="flex-1 overflow-x-auto min-h-[400px]">
          {filtered.length === 0 ? (
            <EmptyState icon={ShoppingBag} title="No orders found" message="Try adjusting your filters or search criteria." />
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white text-ink-muted uppercase text-[10px] tracking-widest font-bold border-b border-line">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 max-w-[200px]">Delivery Info</th>
                  <th className="px-6 py-4">Distance</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {paginated.map(order => (
                  <tr key={order._id} className="hover:bg-cream/30 transition group">
                    <td className="px-6 py-4 font-mono text-xs text-ink-muted">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-espresso">{order.customerDetails?.name}</div>
                      <div className="text-xs text-ink-muted mt-0.5">{order.customerDetails?.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[11px] font-bold uppercase tracking-wider border ${
                        order.customerDetails?.orderType === 'dine-in' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                        order.customerDetails?.orderType === 'delivery' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-orange-50 text-orange-700 border-orange-200'
                      }`}>
                        {order.customerDetails?.orderType}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate text-xs text-ink-muted">
                      {order.customerDetails?.orderType === 'delivery' 
                        ? (order.customerDetails?.deliveryLocation?.formattedAddress || order.customerDetails?.deliveryAddress || 'Address not provided')
                        : '-'}
                    </td>
                    <td className="px-6 py-4 font-medium text-espresso">
                      {order.customerDetails?.orderType === 'delivery' && order.customerDetails?.deliveryDistanceKm != null
                        ? `${order.customerDetails.deliveryDistanceKm.toFixed(1)} km`
                        : '-'}
                    </td>
                    <td className="px-6 py-4 font-bold text-espresso">₹{order.totalAmount}</td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select 
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className={`px-3 py-1.5 pr-7 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer appearance-none focus:outline-none focus:ring-1 focus:ring-caramel transition-colors ${getStatusBadgeStyles(order.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-70">
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-ink-muted">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedOrder(order)} 
                        className="px-3 py-1.5 border border-line rounded-lg text-xs font-semibold bg-white hover:bg-cream text-espresso transition shadow-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <Pagination total={filtered.length} itemsPerPage={10} currentPage={ordersState.page} onPageChange={p => setOrdersState({...ordersState, page: p})} />
      </div>
    );
  };

  const renderReservations = () => {
    const filtered = reservations.filter(r => {
      const matchSearch = r.name.toLowerCase().includes(resState.search.toLowerCase()) || r.email.toLowerCase().includes(resState.search.toLowerCase()) || r._id.includes(resState.search);
      const matchStatus = resState.status === 'all' || r.status === resState.status;
      return matchSearch && matchStatus;
    });
    const paginated = filtered.slice((resState.page - 1) * 10, resState.page * 10);

    return (
      <div className="bg-white rounded-xl border border-line shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-5 border-b border-line bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
           <div className="relative w-full sm:w-64">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
             <input type="text" placeholder="Search reservations..." value={resState.search} onChange={e => setResState({...resState, search: e.target.value, page: 1})} className="w-full pl-9 pr-3 py-2 rounded-lg border border-line text-sm focus:outline-none focus:border-caramel focus:ring-1 focus:ring-caramel transition" />
           </div>
           <select value={resState.status} onChange={e => setResState({...resState, status: e.target.value, page: 1})} className="w-full sm:w-auto px-3 py-2 rounded-lg border border-line text-sm font-medium text-espresso focus:outline-none focus:border-caramel">
             <option value="all">All Statuses</option>
             <option value="pending">Pending</option>
             <option value="confirmed">Confirmed</option>
             <option value="seated">Seated</option>
             <option value="completed">Completed</option>
             <option value="cancelled">Cancelled</option>
           </select>
        </div>
        <div className="flex-1 overflow-x-auto min-h-[400px]">
          {filtered.length === 0 ? (
            <EmptyState icon={CalendarCheck} title="No reservations found" message="No table bookings match your search criteria." />
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="bg-white text-ink-muted uppercase text-[10px] tracking-widest font-bold border-b border-line">
                 <tr>
                   <th className="px-6 py-4">Res ID</th>
                   <th className="px-6 py-4">Customer</th>
                   <th className="px-6 py-4">Date & Time</th>
                   <th className="px-6 py-4">Guests</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-line">
                 {paginated.map(res => (
                   <tr key={res._id} className="hover:bg-cream/30 transition group">
                     <td className="px-6 py-4 font-mono text-xs text-ink-muted">#{res._id.slice(-6).toUpperCase()}</td>
                     <td className="px-6 py-4">
                       <div className="font-semibold text-espresso">{res.name}</div>
                       <div className="text-xs text-ink-muted mt-0.5">{res.phone}</div>
                     </td>
                     <td className="px-6 py-4">
                       <div className="font-medium text-espresso">{new Date(res.date).toLocaleDateString()}</div>
                       <div className="text-xs font-bold text-caramel mt-0.5">{res.time}</div>
                     </td>
                     <td className="px-6 py-4 font-semibold text-espresso">{res.guests}</td>
                     <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select 
                          value={res.status}
                          onChange={(e) => handleUpdateReservationStatus(res._id, e.target.value)}
                          className={`px-3 py-1.5 pr-7 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer appearance-none focus:outline-none focus:ring-1 focus:ring-caramel transition-colors ${getStatusBadgeStyles(res.status)}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="seated">Seated</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-70">
                          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                        </div>
                      </div>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleDeleteReservation(res._id)} className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition shadow-sm" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
          )}
        </div>
        <Pagination total={filtered.length} itemsPerPage={10} currentPage={resState.page} onPageChange={p => setResState({...resState, page: p})} />
      </div>
    );
  };

  const renderMenu = () => {
    const filtered = menuItems.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(menuState.search.toLowerCase());
      const matchCat = menuState.category === 'all' || m.category.toLowerCase() === menuState.category.toLowerCase();
      return matchSearch && matchCat;
    });
    const paginated = filtered.slice((menuState.page - 1) * 10, menuState.page * 10);

    return (
      <div className="bg-white rounded-xl border border-line shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-5 border-b border-line bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
             <div className="relative w-full sm:w-64">
               <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
               <input type="text" placeholder="Search menu..." value={menuState.search} onChange={e => setMenuState({...menuState, search: e.target.value, page: 1})} className="w-full pl-9 pr-3 py-2 rounded-lg border border-line text-sm focus:outline-none focus:border-caramel focus:ring-1 focus:ring-caramel transition" />
             </div>
             <select value={menuState.category} onChange={e => setMenuState({...menuState, category: e.target.value, page: 1})} className="w-full sm:w-auto px-3 py-2 rounded-lg border border-line text-sm font-medium text-espresso focus:outline-none focus:border-caramel">
               <option value="all">All Categories</option>
               {categories.length > 0 ? categories.map(c => <option key={c._id} value={c.name.toLowerCase()}>{c.name}</option>) : (
                 <>
                   <option value="coffee">Coffee</option>
                   <option value="tea">Tea</option>
                   <option value="breakfast">Breakfast</option>
                   <option value="desserts">Desserts</option>
                   <option value="specials">Specials</option>
                 </>
               )}
             </select>
          </div>
          <button onClick={handleOpenAddModal} className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-espresso text-white rounded-lg text-sm font-bold hover:bg-caramel transition shadow-sm hover:shadow">
             <Plus size={16} /> Add Menu Item
          </button>
        </div>

        <div className="flex-1 overflow-x-auto min-h-[400px]">
          {filtered.length === 0 ? (
            <EmptyState icon={UtensilsCrossed} title="No menu items" message="No menu items found. Add a new item to get started." />
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="bg-white text-ink-muted uppercase text-[10px] tracking-widest font-bold border-b border-line">
                 <tr>
                   <th className="px-6 py-4">Item Details</th>
                   <th className="px-6 py-4">Category</th>
                   <th className="px-6 py-4">Price</th>
                   <th className="px-6 py-4">Availability</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-line">
                 {paginated.map(item => (
                   <tr key={item._id} className="hover:bg-cream/30 transition group">
                     <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-beige shadow-sm border border-line" />
                          <div>
                            <div className="font-semibold text-espresso flex items-center gap-2">
                              {item.name}
                              {item.badge && <span className="px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold bg-caramel/10 text-caramel border border-caramel/20">{item.badge}</span>}
                            </div>
                            <div className="text-xs text-ink-muted max-w-xs truncate mt-0.5" title={item.description}>{item.description}</div>
                          </div>
                        </div>
                     </td>
                     <td className="px-6 py-4 capitalize font-medium text-ink-muted">{item.category}</td>
                     <td className="px-6 py-4 font-bold text-espresso">₹{item.price}</td>
                     <td className="px-6 py-4">
                        <button onClick={() => handleToggleAvailable(item)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${item.available ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'}`}>
                           {item.available ? <CheckCircle size={14} /> : <XCircle size={14} />}
                           {item.available ? 'In Stock' : 'Sold Out'}
                        </button>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenEditModal(item)} className="p-2 text-ink-muted hover:bg-cream hover:text-espresso rounded-lg transition" title="Edit">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDeleteMenuItem(item._id, item.name)} className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition" title="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
          )}
        </div>
        <Pagination total={filtered.length} itemsPerPage={10} currentPage={menuState.page} onPageChange={p => setMenuState({...menuState, page: p})} />
      </div>
    );
  };

  const renderInquiries = () => {
    const filtered = contactMessages.filter(m => m.name.toLowerCase().includes(inqState.search.toLowerCase()) || m.email.toLowerCase().includes(inqState.search.toLowerCase()));
    const paginated = filtered.slice((inqState.page - 1) * 10, inqState.page * 10);

    return (
      <div className="bg-white rounded-xl border border-line shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-5 border-b border-line bg-gray-50/50">
           <div className="relative w-full sm:w-72">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
             <input type="text" placeholder="Search by name or email..." value={inqState.search} onChange={e => setInqState({...inqState, search: e.target.value, page: 1})} className="w-full pl-9 pr-3 py-2 rounded-lg border border-line text-sm focus:outline-none focus:border-caramel focus:ring-1 focus:ring-caramel transition" />
           </div>
        </div>
        <div className="flex-1 overflow-x-auto min-h-[400px]">
          {filtered.length === 0 ? (
            <EmptyState icon={MessageSquare} title="No inquiries" message="There are no contact inquiries matching your search." />
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="bg-white text-ink-muted uppercase text-[10px] tracking-widest font-bold border-b border-line">
                 <tr>
                   <th className="px-6 py-4">ID</th>
                   <th className="px-6 py-4">Customer</th>
                   <th className="px-6 py-4">Message Details</th>
                   <th className="px-6 py-4">Date</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-line">
                 {paginated.map(msg => (
                   <tr key={msg._id} className="hover:bg-cream/30 transition group">
                     <td className="px-6 py-4 font-mono text-xs text-ink-muted">#{msg._id.slice(-6).toUpperCase()}</td>
                     <td className="px-6 py-4">
                       <div className="font-semibold text-espresso">{msg.name}</div>
                       <div className="text-xs text-ink-muted mt-0.5">{msg.email} {msg.phone ? `· ${msg.phone}` : ''}</div>
                     </td>
                     <td className="px-6 py-4">
                       <div className="text-sm text-espresso max-w-sm truncate" title={msg.message}>
                         {msg.message}
                       </div>
                     </td>
                     <td className="px-6 py-4 text-xs text-ink-muted">{new Date(msg.createdAt).toLocaleDateString()}</td>
                     <td className="px-6 py-4 text-right">
                        <button className="px-3 py-1.5 border border-line rounded-lg text-xs font-semibold bg-white hover:bg-cream text-espresso transition opacity-0 group-hover:opacity-100" onClick={() => alert(`Message from ${msg.name}:\n\n${msg.message}`)}>View</button>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
          )}
        </div>
        <Pagination total={filtered.length} itemsPerPage={10} currentPage={inqState.page} onPageChange={p => setInqState({...inqState, page: p})} />
      </div>
    );
  };

  const renderSubscribers = () => {
    const filtered = subscribers.filter(s => s.email.toLowerCase().includes(subState.search.toLowerCase()));
    const paginated = filtered.slice((subState.page - 1) * 10, subState.page * 10);

    return (
      <div className="bg-white rounded-xl border border-line shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-5 border-b border-line bg-gray-50/50">
           <div className="relative w-full sm:w-72">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
             <input type="text" placeholder="Search emails..." value={subState.search} onChange={e => setSubState({...subState, search: e.target.value, page: 1})} className="w-full pl-9 pr-3 py-2 rounded-lg border border-line text-sm focus:outline-none focus:border-caramel focus:ring-1 focus:ring-caramel transition" />
           </div>
        </div>
        <div className="flex-1 overflow-x-auto min-h-[400px]">
          {filtered.length === 0 ? (
            <EmptyState icon={Mail} title="No subscribers" message="No newsletter subscribers found." />
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="bg-white text-ink-muted uppercase text-[10px] tracking-widest font-bold border-b border-line">
                 <tr>
                   <th className="px-6 py-4 w-24">ID</th>
                   <th className="px-6 py-4">Email Address</th>
                   <th className="px-6 py-4">Subscription Date</th>
                   <th className="px-6 py-4">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-line">
                 {paginated.map(sub => (
                   <tr key={sub._id} className="hover:bg-cream/30 transition">
                     <td className="px-6 py-4 font-mono text-xs text-ink-muted">#{sub._id.slice(-6).toUpperCase()}</td>
                     <td className="px-6 py-4">
                       <div className="font-semibold text-espresso flex items-center gap-2">
                         <Mail size={14} className="text-caramel" />
                         {sub.email}
                       </div>
                     </td>
                     <td className="px-6 py-4 text-xs font-medium text-ink-muted">{new Date(sub.createdAt).toLocaleDateString()}</td>
                     <td className="px-6 py-4"><StatusBadge status="Active" /></td>
                   </tr>
                 ))}
               </tbody>
            </table>
          )}
        </div>
        <Pagination total={filtered.length} itemsPerPage={10} currentPage={subState.page} onPageChange={p => setSubState({...subState, page: p})} />
      </div>
    );
  };

  const renderReviews = () => {
    const filtered = testimonials.filter(t => t.name.toLowerCase().includes(revState.search.toLowerCase()) && (revState.status === 'all' || (revState.status === 'published' ? t.approved : !t.approved)));
    const paginated = filtered.slice((revState.page - 1) * 10, revState.page * 10);

    return (
      <div className="bg-white rounded-xl border border-line shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-5 border-b border-line bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
           <div className="relative w-full sm:w-64">
             <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
             <input type="text" placeholder="Search reviews..." value={revState.search} onChange={e => setRevState({...revState, search: e.target.value, page: 1})} className="w-full pl-9 pr-3 py-2 rounded-lg border border-line text-sm focus:outline-none focus:border-caramel focus:ring-1 focus:ring-caramel transition" />
           </div>
           <select value={revState.status} onChange={e => setRevState({...revState, status: e.target.value, page: 1})} className="w-full sm:w-auto px-3 py-2 rounded-lg border border-line text-sm font-medium text-espresso focus:outline-none focus:border-caramel">
             <option value="all">All Statuses</option>
             <option value="published">Published</option>
             <option value="hidden">Hidden</option>
           </select>
        </div>
        <div className="flex-1 overflow-x-auto min-h-[400px]">
          {filtered.length === 0 ? (
            <EmptyState icon={Quote} title="No reviews found" message="There are no reviews matching your filters." />
          ) : (
            <table className="w-full text-left text-sm whitespace-nowrap">
               <thead className="bg-white text-ink-muted uppercase text-[10px] tracking-widest font-bold border-b border-line">
                 <tr>
                   <th className="px-6 py-4">ID</th>
                   <th className="px-6 py-4">Customer</th>
                   <th className="px-6 py-4">Rating</th>
                   <th className="px-6 py-4">Review</th>
                   <th className="px-6 py-4">Status</th>
                   <th className="px-6 py-4 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-line">
                 {paginated.map(t => (
                   <tr key={t._id} className="hover:bg-cream/30 transition group">
                     <td className="px-6 py-4 font-mono text-xs text-ink-muted">#{t._id.slice(-6).toUpperCase()}</td>
                     <td className="px-6 py-4">
                       <div className="font-semibold text-espresso">{t.name}</div>
                       <div className="text-xs text-ink-muted mt-0.5">{t.role}</div>
                     </td>
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-1 text-amber-500">
                         {Array.from({length: 5}).map((_, i) => <Star key={i} size={14} className={i < t.rating ? 'fill-current' : 'text-gray-300'} />)}
                         <span className="text-xs font-bold text-espresso ml-1">{t.rating}.0</span>
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       <div className="text-sm text-espresso italic max-w-xs truncate" title={t.message}>
                         "{t.message}"
                       </div>
                     </td>
                     <td className="px-6 py-4"><StatusBadge status={t.approved ? 'Published' : 'Hidden'} /></td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => alert(`Full Review:\n\n"${t.message}"`)} className="px-3 py-1.5 border border-line rounded-lg text-xs font-semibold bg-white hover:bg-cream text-espresso transition">View</button>
                          <button onClick={() => handleToggleTestimonial(t)} className="px-3 py-1.5 border border-line rounded-lg text-xs font-semibold bg-white hover:bg-cream text-espresso transition">
                            {t.approved ? 'Hide' : 'Publish'}
                          </button>
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
          )}
        </div>
        <Pagination total={filtered.length} itemsPerPage={10} currentPage={revState.page} onPageChange={p => setRevState({...revState, page: p})} />
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-cream/30 font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-espresso/80 z-40 md:hidden backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* LEFT SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-espresso text-cream transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 border-r border-dark-coffee flex flex-col ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-20 flex items-center justify-between px-6 border-b border-dark-coffee">
          <h2 className="font-display text-xl font-bold text-gold tracking-wide">Café Aroma</h2>
          <button className="md:hidden text-ink-muted hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 no-scrollbar">
          <div className="text-[10px] uppercase tracking-widest font-bold text-ink-muted/50 mb-3 px-3">Management</div>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-caramel/20 text-gold shadow-sm'
                    : 'text-cream/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} className={active ? 'text-gold' : 'opacity-70'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-dark-coffee">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-cream/70 hover:bg-red-500/10 hover:text-red-400 transition-all">
            <LogOut size={18} className="opacity-70" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-line px-4 sm:px-8 flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 -ml-2 text-espresso hover:bg-cream rounded-lg transition" onClick={() => setMobileMenuOpen(true)}>
              <MenuIcon size={24} />
            </button>
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-espresso">{getPageTitle()}</h1>
              <p className="text-[11px] sm:text-xs text-ink-muted font-medium hidden sm:block">Control Panel · {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-6">
            <button 
              onClick={fetchDashboardData} 
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-white border border-line text-espresso text-xs font-bold hover:border-caramel hover:text-caramel transition shadow-sm disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            
            <div className="w-px h-8 bg-line hidden sm:block"></div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-espresso">{user?.name || 'Admin User'}</span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-caramel">Administrator</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-espresso text-gold flex items-center justify-center font-display text-lg font-bold shadow-sm border border-line">
                {(user?.name || 'A').charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Global Feedback Banner */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300">
          {feedback && (
            <div className={`px-4 py-2.5 rounded-lg shadow-lg font-semibold text-xs flex items-center gap-2.5 border animate-fade-in ${feedback.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-espresso text-gold border-dark-coffee'}`}>
              {feedback.type === 'error' ? <XCircle size={16} /> : <CheckCircle size={16} />}
              <span>{feedback.msg}</span>
            </div>
          )}
        </div>

        {/* Scrollable Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative">
          
          {loading && !stats ? (
            <div className="space-y-6 animate-pulse">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white rounded-xl border border-line shadow-sm"></div>)}
              </div>
              <div className="h-[400px] bg-white rounded-xl border border-line shadow-sm"></div>
            </div>
          ) : (
            <div className="h-full">
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'orders' && renderOrders()}
              {activeTab === 'reservations' && renderReservations()}
              {activeTab === 'menu' && renderMenu()}
              {activeTab === 'messages' && renderInquiries()}
              {activeTab === 'newsletter' && renderSubscribers()}
              {activeTab === 'testimonials' && renderReviews()}
              {activeTab === 'admins' && renderAdmins()}
            </div>
          )}
        </div>
      </main>

      {/* MODAL: ORDER DETAILS */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-coffee/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-line relative animate-fade-in max-h-[90vh] overflow-y-auto">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-5 right-5 text-ink-muted hover:text-espresso p-1 rounded-lg hover:bg-cream transition">
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <h3 className="font-display text-2xl font-bold text-espresso">
                Order Details
              </h3>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeStyles(selectedOrder.status)}`}>
                {selectedOrder.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 bg-cream/30 rounded-xl border border-line">
                <h4 className="text-[11px] uppercase tracking-widest font-bold text-ink-muted mb-3">Customer Information</h4>
                <p className="font-semibold text-espresso">{selectedOrder.customerDetails?.name}</p>
                <p className="text-sm text-ink-muted mt-1">{selectedOrder.customerDetails?.phone}</p>
                {selectedOrder.customerDetails?.email && <p className="text-sm text-ink-muted mt-1">{selectedOrder.customerDetails?.email}</p>}
              </div>
              <div className="p-4 bg-cream/30 rounded-xl border border-line">
                <h4 className="text-[11px] uppercase tracking-widest font-bold text-ink-muted mb-3">Order Information</h4>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-ink-muted">Order ID</span>
                  <span className="text-sm font-mono font-medium text-espresso">#{selectedOrder._id.slice(-6).toUpperCase()}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-ink-muted">Type</span>
                  <span className="text-sm font-medium text-espresso capitalize">{selectedOrder.customerDetails?.orderType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-ink-muted">Date</span>
                  <span className="text-sm font-medium text-espresso">{new Date(selectedOrder.createdAt).toLocaleString()}</span>
                </div>
                {selectedOrder.customerDetails?.orderType === 'delivery' && (
                  <>
                    <div className="mt-3 pt-3 border-t border-line/60">
                      <span className="text-sm text-ink-muted block mb-1">Delivery Address</span>
                      <span className="text-sm font-medium text-espresso block">
                        {selectedOrder.customerDetails?.deliveryLocation?.formattedAddress || selectedOrder.customerDetails?.deliveryAddress || 'Address not provided'}
                      </span>
                    </div>
                    {selectedOrder.customerDetails?.deliveryDistanceKm != null && (
                      <div className="flex justify-between mt-2">
                        <span className="text-sm text-ink-muted">Distance</span>
                        <span className="text-sm font-medium text-espresso">{selectedOrder.customerDetails.deliveryDistanceKm.toFixed(1)} km</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <h4 className="text-[11px] uppercase tracking-widest font-bold text-ink-muted mb-3">Order Items</h4>
            <div className="bg-white border border-line rounded-xl overflow-hidden mb-6">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-ink-muted uppercase text-[10px] tracking-widest font-bold border-b border-line">
                  <tr>
                    <th className="px-4 py-3">Item</th>
                    <th className="px-4 py-3 text-center">Qty</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {selectedOrder.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-espresso">{item.menuItem?.name || 'Unknown Item'}</div>
                      </td>
                      <td className="px-4 py-3 text-center font-medium text-espresso">{item.quantity}</td>
                      <td className="px-4 py-3 text-right text-ink-muted">₹{item.price}</td>
                      <td className="px-4 py-3 text-right font-semibold text-espresso">₹{(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bg-cream/30 p-4 border-t border-line flex justify-end">
                <div className="w-48">
                  <div className="flex justify-between border-t border-line pt-2 mt-2">
                    <span className="text-sm font-bold text-espresso">Total</span>
                    <span className="text-sm font-bold text-espresso">₹{selectedOrder.totalAmount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setSelectedOrder(null)} className="px-6 py-2.5 rounded-lg text-sm font-bold bg-espresso text-white hover:bg-caramel transition shadow-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT MENU ITEM */}
      {menuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-coffee/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-line relative animate-fade-in">
            <button onClick={() => setMenuModalOpen(false)} className="absolute top-5 right-5 text-ink-muted hover:text-espresso p-1 rounded-lg hover:bg-cream transition">
              <X size={20} />
            </button>

            <h3 className="font-display text-2xl font-bold text-espresso mb-1">
              {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </h3>
            <p className="text-xs text-ink-muted font-medium mb-6">
              Update details for this menu record in the database.
            </p>

            <form onSubmit={handleSaveMenuItem} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-widest font-bold text-ink-muted mb-1.5">Item Name *</label>
                <input type="text" required placeholder="e.g. Vanilla Flat White" value={menuForm.name} onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-line text-sm font-medium text-espresso focus:outline-none focus:border-caramel focus:ring-1 focus:ring-caramel transition" />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-widest font-bold text-ink-muted mb-1.5">Description *</label>
                <textarea rows="2" required placeholder="Double shot · velvety foam · Madagascar vanilla" value={menuForm.description} onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-line text-sm font-medium text-espresso focus:outline-none focus:border-caramel focus:ring-1 focus:ring-caramel transition resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest font-bold text-ink-muted mb-1.5">Price (₹) *</label>
                  <input type="number" required min="1" placeholder="180" value={menuForm.price} onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-line text-sm font-medium text-espresso focus:outline-none focus:border-caramel focus:ring-1 focus:ring-caramel transition" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest font-bold text-ink-muted mb-1.5">Category *</label>
                  <select value={menuForm.category} onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-line text-sm font-medium text-espresso focus:outline-none focus:border-caramel focus:ring-1 focus:ring-caramel transition">
                    <option value="coffee">Coffee</option>
                    <option value="tea">Tea</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="desserts">Desserts</option>
                    <option value="specials">Specials</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-widest font-bold text-ink-muted mb-1.5">Image Asset Path *</label>
                  <select value={menuForm.image} onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-line text-sm font-medium text-espresso focus:outline-none focus:border-caramel focus:ring-1 focus:ring-caramel transition">
                    <option value="/assets/barista-pour.jpg">Barista Pour</option>
                    <option value="/assets/hero-cafe.jpg">Hero Cafe</option>
                    <option value="/assets/special-latte.jpg">Special Latte</option>
                    <option value="/assets/coffee-beans.jpg">Coffee Beans</option>
                    <option value="/assets/pastry-breakfast.jpg">Pastry & Breakfast</option>
                    <option value="/assets/cafe-interior.jpg">Cafe Interior</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest font-bold text-ink-muted mb-1.5">Badge (Optional)</label>
                  <input type="text" placeholder="e.g. Guest favourite" value={menuForm.badge} onChange={(e) => setMenuForm({ ...menuForm, badge: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-line text-sm font-medium text-espresso focus:outline-none focus:border-caramel focus:ring-1 focus:ring-caramel transition" />
                </div>
              </div>

              <div className="flex items-center gap-8 pt-2 pb-2">
                <label className="flex items-center gap-2.5 text-sm font-bold text-espresso cursor-pointer">
                  <input type="checkbox" checked={menuForm.available} onChange={(e) => setMenuForm({ ...menuForm, available: e.target.checked })} className="w-4 h-4 rounded text-caramel focus:ring-caramel border-line" />
                  <span>Available / In Stock</span>
                </label>
                <label className="flex items-center gap-2.5 text-sm font-bold text-espresso cursor-pointer">
                  <input type="checkbox" checked={menuForm.featured} onChange={(e) => setMenuForm({ ...menuForm, featured: e.target.checked })} className="w-4 h-4 rounded text-caramel focus:ring-caramel border-line" />
                  <span>Featured Item</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-5 border-t border-line">
                <button type="button" onClick={() => setMenuModalOpen(false)} className="px-5 py-2.5 rounded-lg text-sm font-bold text-ink-muted hover:bg-cream hover:text-espresso transition">
                  Cancel
                </button>
                <button type="submit" disabled={formSubmitting} className="flex items-center gap-2 bg-espresso text-white hover:bg-caramel transition shadow-sm text-sm font-bold px-6 py-2.5 rounded-lg disabled:opacity-70">
                  {formSubmitting ? <Loader2 size={16} className="animate-spin" /> : (editingItem ? 'Save Changes' : 'Create Item')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD ADMIN */}
      {addAdminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-coffee/80 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-line relative animate-fade-in">
            <button onClick={() => setAddAdminModalOpen(false)} className="absolute top-5 right-5 text-ink-muted hover:text-espresso p-1 rounded-lg hover:bg-cream transition">
              <X size={20} />
            </button>

            <h3 className="font-display text-xl font-bold text-espresso mb-1">
              {editingAdmin ? 'Edit Admin' : 'Add New Admin'}
            </h3>
            <p className="text-xs text-ink-muted font-medium mb-6">
              {editingAdmin ? 'Update administrator details.' : 'Create a new administrator account.'}
            </p>

            <form onSubmit={handleSaveAdmin} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-widest font-bold text-ink-muted mb-1.5">Name *</label>
                <input type="text" required placeholder="Full Name" value={adminForm.name} onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-line text-sm font-medium text-espresso focus:outline-none focus:border-caramel focus:ring-1 focus:ring-caramel transition" />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest font-bold text-ink-muted mb-1.5">Email *</label>
                <input type="email" required placeholder="admin@example.com" value={adminForm.email} onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-line text-sm font-medium text-espresso focus:outline-none focus:border-caramel focus:ring-1 focus:ring-caramel transition" />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest font-bold text-ink-muted mb-1.5">Password {editingAdmin ? '(Leave blank to keep current)' : '*'}</label>
                <input type="password" required={!editingAdmin} placeholder="••••••••" value={adminForm.password} onChange={(e) => setAdminForm({ ...adminForm, password: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-line text-sm font-medium text-espresso focus:outline-none focus:border-caramel focus:ring-1 focus:ring-caramel transition" />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest font-bold text-ink-muted mb-1.5">Role *</label>
                <select value={adminForm.role} onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-line text-sm font-medium text-espresso focus:outline-none focus:border-caramel focus:ring-1 focus:ring-caramel transition">
                  <option value="admin">Admin</option>
                  <option value="superadmin">Superadmin</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-5 border-t border-line mt-6">
                <button type="button" onClick={() => setAddAdminModalOpen(false)} className="px-5 py-2.5 rounded-lg text-sm font-bold text-ink-muted hover:bg-cream hover:text-espresso transition">Cancel</button>
                <button type="submit" disabled={formSubmitting} className="flex items-center gap-2 bg-espresso text-white hover:bg-caramel transition shadow-sm text-sm font-bold px-6 py-2.5 rounded-lg disabled:opacity-70">
                  {formSubmitting ? <Loader2 size={16} className="animate-spin" /> : (editingAdmin ? 'Save Changes' : 'Create Admin')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
