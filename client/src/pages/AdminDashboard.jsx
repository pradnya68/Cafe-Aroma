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
} from '../services/api';
import Loading from '../components/Loading';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBag,
  CalendarCheck,
  MessageSquare,
  Mail,
  Quote,
  TrendingUp,
  Clock,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Eye,
  RefreshCw,
  X,
  Loader2,
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Menu Modal State
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [menuForm, setMenuForm] = useState({
    name: '',
    description: '',
    price: '',
    category: 'coffee',
    image: '/assets/hero-cafe.jpg',
    badge: '',
    available: true,
    featured: false,
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        statsRes,
        menuRes,
        ordersRes,
        reservationsRes,
        contactRes,
        newsRes,
        testRes,
        catRes,
      ] = await Promise.all([
        adminAPI.getStats(),
        menuAPI.getAll(),
        orderAPI.getAll(),
        reservationAPI.getAll(),
        contactAPI.getAll(),
        newsletterAPI.getAll(),
        testimonialAPI.getAll(true),
        categoryAPI.getAll(),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.data);
      if (menuRes.data.success) setMenuItems(menuRes.data.data);
      if (ordersRes.data.success) setOrders(ordersRes.data.data);
      if (reservationsRes.data.success) setReservations(reservationsRes.data.data);
      if (contactRes.data.success) setContactMessages(contactRes.data.data);
      if (newsRes.data.success) setSubscribers(newsRes.data.data);
      if (testRes.data.success) setTestimonials(testRes.data.data);
      if (catRes.data.success) setCategories(catRes.data.data);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const showNotification = (msg) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  // Menu item actions
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setMenuForm({
      name: '',
      description: '',
      price: '',
      category: 'coffee',
      image: '/assets/barista-pour.jpg',
      badge: '',
      available: true,
      featured: false,
    });
    setMenuModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setMenuForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      badge: item.badge || '',
      available: item.available,
      featured: item.featured || false,
    });
    setMenuModalOpen(true);
  };

  const handleSaveMenuItem = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      if (editingItem) {
        const res = await menuAPI.update(editingItem._id, menuForm);
        if (res.data.success) {
          showNotification(`Updated "${res.data.data.name}"`);
        }
      } else {
        const res = await menuAPI.create(menuForm);
        if (res.data.success) {
          showNotification(`Created "${res.data.data.name}"`);
        }
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
      setMenuItems((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, available: !i.available } : i))
      );
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

  // Order status update
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderAPI.updateStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
      );
      showNotification(`Order status updated to "${newStatus}"`);
    } catch (err) {
      console.error(err);
    }
  };

  // Reservation actions
  const handleUpdateReservationStatus = async (resId, newStatus) => {
    try {
      await reservationAPI.updateStatus(resId, newStatus);
      setReservations((prev) =>
        prev.map((r) => (r._id === resId ? { ...r, status: newStatus } : r))
      );
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

  // Testimonial toggle
  const handleToggleTestimonial = async (t) => {
    try {
      await testimonialAPI.updateStatus(t._id, !t.approved);
      setTestimonials((prev) =>
        prev.map((item) => (item._id === t._id ? { ...item, approved: !item.approved } : item))
      );
      showNotification('Testimonial status updated');
    } catch (err) {
      console.error(err);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'menu', label: `Menu (${menuItems.length})`, icon: UtensilsCrossed },
    { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
    { id: 'reservations', label: `Reservations (${reservations.length})`, icon: CalendarCheck },
    { id: 'messages', label: `Inquiries (${contactMessages.length})`, icon: MessageSquare },
    { id: 'newsletter', label: `Subscribers (${subscribers.length})`, icon: Mail },
    { id: 'testimonials', label: `Reviews (${testimonials.length})`, icon: Quote },
  ];

  return (
    <div className="pt-24 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-line">
          <div>
            <span className="eyebrow mb-1">Administrative Portal</span>
            <h1 className="font-display text-3xl sm:text-4xl text-espresso font-semibold">
              Café Aroma Control
            </h1>
          </div>

          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-line hover:border-caramel text-espresso text-xs font-semibold shadow-sm transition"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <div className="mb-6 p-3 bg-dark-coffee text-gold text-xs font-semibold rounded-lg shadow-lg flex items-center gap-2">
            <CheckCircle size={15} />
            <span>{feedback}</span>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  active
                    ? 'bg-espresso text-gold shadow-md'
                    : 'bg-white text-ink-muted border border-line hover:text-espresso hover:border-caramel/40'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-5 rounded-2xl border border-line shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-caramel flex items-center justify-center font-display text-2xl font-bold">
                  ₹
                </div>
                <div>
                  <span className="text-[11px] text-ink-muted uppercase tracking-wider font-semibold block">
                    Total Revenue
                  </span>
                  <strong className="font-display text-2xl sm:text-3xl text-espresso">
                    ₹{stats?.totalRevenue || 0}
                  </strong>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-line shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <span className="text-[11px] text-ink-muted uppercase tracking-wider font-semibold block">
                    Orders ({stats?.pendingOrders || 0} pending)
                  </span>
                  <strong className="font-display text-2xl sm:text-3xl text-espresso">
                    {stats?.totalOrders || 0}
                  </strong>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-line shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CalendarCheck size={22} />
                </div>
                <div>
                  <span className="text-[11px] text-ink-muted uppercase tracking-wider font-semibold block">
                    Reservations
                  </span>
                  <strong className="font-display text-2xl sm:text-3xl text-espresso">
                    {stats?.totalReservations || 0}
                  </strong>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-line shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                  <Mail size={22} />
                </div>
                <div>
                  <span className="text-[11px] text-ink-muted uppercase tracking-wider font-semibold block">
                    Subscribers
                  </span>
                  <strong className="font-display text-2xl sm:text-3xl text-espresso">
                    {stats?.totalSubscribers || 0}
                  </strong>
                </div>
              </div>
            </div>

            {/* Quick Two Column: Recent Orders & Recent Reservations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Orders */}
              <div className="bg-white rounded-2xl p-6 border border-line shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-line">
                  <h3 className="font-display text-lg font-semibold text-espresso">Recent Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-caramel font-semibold hover:underline"
                  >
                    View all
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order._id}
                      className="p-3 bg-cream/40 rounded-xl border border-line/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-espresso">{order.customerDetails.name}</div>
                        <p className="text-ink-muted text-[11px]">
                          {order.items.length} items · ₹{order.totalAmount} · {order.customerDetails.orderType}
                        </p>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'preparing'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Reservations */}
              <div className="bg-white rounded-2xl p-6 border border-line shadow-sm">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-line">
                  <h3 className="font-display text-lg font-semibold text-espresso">Upcoming Reservations</h3>
                  <button
                    onClick={() => setActiveTab('reservations')}
                    className="text-xs text-caramel font-semibold hover:underline"
                  >
                    View all
                  </button>
                </div>

                <div className="space-y-3">
                  {reservations.slice(0, 5).map((res) => (
                    <div
                      key={res._id}
                      className="p-3 bg-cream/40 rounded-xl border border-line/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-espresso">{res.name}</div>
                        <p className="text-ink-muted text-[11px]">
                          {res.date} at {res.time} · {res.guests}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold/15 text-espresso border border-gold/30">
                        {res.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MENU ITEMS MANAGEMENT */}
        {activeTab === 'menu' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-line shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-line">
              <div>
                <h2 className="font-display text-xl font-semibold text-espresso">
                  Menu Items Database
                </h2>
                <p className="text-xs text-ink-muted mt-0.5">
                  Add, update price, toggle availability, or remove items.
                </p>
              </div>

              <button
                onClick={handleOpenAddModal}
                className="btn-cafe btn-primary text-xs py-2.5 px-4 font-bold flex items-center gap-1.5"
              >
                <Plus size={15} />
                <span>Add Menu Item</span>
              </button>
            </div>

            {/* Menu Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-espresso">
                <thead>
                  <tr className="border-b border-line text-[11px] uppercase tracking-wider text-ink-muted">
                    <th className="py-3 px-2">Item</th>
                    <th className="py-3 px-2">Category</th>
                    <th className="py-3 px-2">Price</th>
                    <th className="py-3 px-2">Badge</th>
                    <th className="py-3 px-2">Available</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {menuItems.map((item) => (
                    <tr key={item._id} className="hover:bg-cream/30 transition">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded bg-beige flex-shrink-0"
                          />
                          <div>
                            <strong className="block text-espresso text-xs font-semibold">
                              {item.name}
                            </strong>
                            <p className="text-[11px] text-ink-muted line-clamp-1 max-w-xs">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-2 uppercase text-[10px] font-bold text-caramel">
                        {item.category}
                      </td>
                      <td className="py-3 px-2 font-semibold">₹{item.price}</td>
                      <td className="py-3 px-2">
                        {item.badge ? (
                          <span className="px-2 py-0.5 rounded bg-dark-coffee text-gold text-[10px] font-semibold">
                            {item.badge}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="py-3 px-2">
                        <button
                          onClick={() => handleToggleAvailable(item)}
                          className="flex items-center gap-1 text-xs"
                          title="Toggle availability"
                        >
                          {item.available ? (
                            <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                              <CheckCircle size={15} /> In Stock
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center gap-1 font-semibold">
                              <XCircle size={15} /> Sold Out
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-2 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded hover:bg-cream text-espresso transition"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteMenuItem(item._id, item.name)}
                          className="p-1.5 rounded hover:bg-red-50 text-red-600 transition"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-line shadow-sm">
            <h2 className="font-display text-xl font-semibold text-espresso mb-1">
              Customer Orders
            </h2>
            <p className="text-xs text-ink-muted mb-6">
              Track real-time orders, manage statuses and fulfillment.
            </p>

            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-center py-8 text-ink-muted text-xs">No orders placed yet.</p>
              ) : (
                orders.map((order) => (
                  <div
                    key={order._id}
                    className="p-5 rounded-xl border border-line bg-cream/20 hover:border-caramel/40 transition space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line/60 pb-3">
                      <div>
                        <span className="font-mono text-[10px] text-ink-muted block">
                          ID: {order._id}
                        </span>
                        <h4 className="font-semibold text-espresso text-sm">
                          {order.customerDetails.name} · {order.customerDetails.phone}
                        </h4>
                        <span className="text-xs text-caramel uppercase tracking-wider font-semibold">
                          {order.customerDetails.orderType}
                          {order.customerDetails.tableNumber && ` (${order.customerDetails.tableNumber})`}
                        </span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-ink-muted">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                          className="px-3 py-1.5 rounded bg-white border border-line text-xs font-semibold text-espresso focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="ready">Ready</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="flex flex-wrap gap-2 text-xs">
                      {order.items.map((i, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-white border border-line text-espresso font-medium"
                        >
                          {i.quantity}x {i.name} (₹{i.price * i.quantity})
                        </span>
                      ))}
                    </div>

                    {/* Special notes & Total */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-ink-muted italic">
                        {order.customerDetails.specialNotes ? `Notes: "${order.customerDetails.specialNotes}"` : 'No special notes'}
                      </span>
                      <strong className="font-display text-base text-caramel">
                        Total: ₹{order.totalAmount}
                      </strong>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: RESERVATIONS */}
        {activeTab === 'reservations' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-line shadow-sm">
            <h2 className="font-display text-xl font-semibold text-espresso mb-1">
              Table Bookings
            </h2>
            <p className="text-xs text-ink-muted mb-6">
              Review guest bookings, update seating status, or manage cancellations.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-espresso">
                <thead>
                  <tr className="border-b border-line text-[11px] uppercase tracking-wider text-ink-muted">
                    <th className="py-3 px-2">Guest</th>
                    <th className="py-3 px-2">Date &amp; Time</th>
                    <th className="py-3 px-2">Party</th>
                    <th className="py-3 px-2">Special Request</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60">
                  {reservations.map((res) => (
                    <tr key={res._id} className="hover:bg-cream/30 transition">
                      <td className="py-3 px-2">
                        <strong className="block text-espresso">{res.name}</strong>
                        <span className="text-[11px] text-ink-muted">{res.email} · {res.phone}</span>
                      </td>
                      <td className="py-3 px-2 font-medium">
                        {res.date} <span className="text-caramel font-semibold">@ {res.time}</span>
                      </td>
                      <td className="py-3 px-2 font-semibold">{res.guests}</td>
                      <td className="py-3 px-2 text-ink-muted italic max-w-xs">
                        {res.specialRequest || 'None'}
                      </td>
                      <td className="py-3 px-2">
                        <select
                          value={res.status}
                          onChange={(e) => handleUpdateReservationStatus(res._id, e.target.value)}
                          className="px-2 py-1 rounded bg-cream/50 border border-line text-xs font-semibold focus:outline-none"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="seated">Seated</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => handleDeleteReservation(res._id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          title="Remove booking"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: INQUIRIES & CONTACT MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-line shadow-sm">
            <h2 className="font-display text-xl font-semibold text-espresso mb-1">
              Contact Inquiries
            </h2>
            <p className="text-xs text-ink-muted mb-6">
              Messages received through the website contact form.
            </p>

            <div className="space-y-4">
              {contactMessages.length === 0 ? (
                <p className="text-center py-8 text-ink-muted text-xs">No inquiries received yet.</p>
              ) : (
                contactMessages.map((msg) => (
                  <div key={msg._id} className="p-5 rounded-xl border border-line bg-cream/20 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <strong className="text-espresso text-sm">{msg.name}</strong>
                        <p className="text-xs text-ink-muted">{msg.email} {msg.phone ? `· ${msg.phone}` : ''}</p>
                      </div>
                      <span className="text-[10px] text-ink-muted">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-espresso leading-relaxed bg-white p-3 rounded-lg border border-line/60">
                      "{msg.message}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 6: NEWSLETTER SUBSCRIBERS */}
        {activeTab === 'newsletter' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-line shadow-sm">
            <h2 className="font-display text-xl font-semibold text-espresso mb-1">
              Newsletter Subscribers
            </h2>
            <p className="text-xs text-ink-muted mb-6">
              Guests who joined the Aroma circle email list.
            </p>

            <div className="divide-y divide-line/60">
              {subscribers.map((sub) => (
                <div key={sub._id} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <Mail size={15} className="text-caramel" />
                    <span className="font-medium text-espresso">{sub.email}</span>
                  </div>
                  <span className="text-ink-muted text-[11px]">
                    Subscribed on {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-line shadow-sm">
            <h2 className="font-display text-xl font-semibold text-espresso mb-1">
              Guest Testimonials
            </h2>
            <p className="text-xs text-ink-muted mb-6">
              Manage live guest reviews and reviews displayed on the home page.
            </p>

            <div className="space-y-4">
              {testimonials.map((t) => (
                <div
                  key={t._id}
                  className="p-4 rounded-xl border border-line flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-2 mb-1">
                      <strong className="text-espresso text-sm">{t.name}</strong>
                      <span className="text-xs text-caramel">({t.role})</span>
                      <span className="text-amber-500 font-bold text-xs">★ {t.rating}</span>
                    </div>
                    <p className="text-xs text-ink-muted italic">“{t.message}”</p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <button
                      onClick={() => handleToggleTestimonial(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                        t.approved
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {t.approved ? 'Live (Visible)' : 'Hidden'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT MENU ITEM */}
      {menuModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-coffee/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-line relative">
            <button
              onClick={() => setMenuModalOpen(false)}
              className="absolute top-5 right-5 text-ink-muted hover:text-espresso"
            >
              <X size={20} />
            </button>

            <h3 className="font-display text-xl font-semibold text-espresso mb-1">
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h3>
            <p className="text-xs text-ink-muted mb-6">
              Enter details for this menu record in the database.
            </p>

            <form onSubmit={handleSaveMenuItem} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1">
                  Item Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vanilla Flat White"
                  value={menuForm.name}
                  onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-cream/40 border border-line text-xs text-espresso focus:outline-none focus:border-caramel"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-muted mb-1">
                  Description *
                </label>
                <textarea
                  rows="2"
                  required
                  placeholder="Double shot · velvety foam · Madagascar vanilla"
                  value={menuForm.description}
                  onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded bg-cream/40 border border-line text-xs text-espresso focus:outline-none focus:border-caramel"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-ink-muted mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="180"
                    value={menuForm.price}
                    onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-cream/40 border border-line text-xs text-espresso focus:outline-none focus:border-caramel"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-muted mb-1">
                    Category *
                  </label>
                  <select
                    value={menuForm.category}
                    onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-cream/40 border border-line text-xs text-espresso focus:outline-none focus:border-caramel"
                  >
                    <option value="coffee">Coffee</option>
                    <option value="tea">Tea</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="desserts">Desserts</option>
                    <option value="specials">Specials</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-ink-muted mb-1">
                    Image Asset Path *
                  </label>
                  <select
                    value={menuForm.image}
                    onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-cream/40 border border-line text-xs text-espresso focus:outline-none focus:border-caramel"
                  >
                    <option value="/assets/barista-pour.jpg">Barista Pour</option>
                    <option value="/assets/hero-cafe.jpg">Hero Cafe</option>
                    <option value="/assets/special-latte.jpg">Special Latte</option>
                    <option value="/assets/coffee-beans.jpg">Coffee Beans</option>
                    <option value="/assets/pastry-breakfast.jpg">Pastry &amp; Breakfast</option>
                    <option value="/assets/cafe-interior.jpg">Cafe Interior</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-muted mb-1">
                    Badge Tag (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Guest favourite"
                    value={menuForm.badge}
                    onChange={(e) => setMenuForm({ ...menuForm, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded bg-cream/40 border border-line text-xs text-espresso focus:outline-none focus:border-caramel"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-espresso cursor-pointer">
                  <input
                    type="checkbox"
                    checked={menuForm.available}
                    onChange={(e) => setMenuForm({ ...menuForm, available: e.target.checked })}
                    className="rounded text-caramel focus:ring-caramel"
                  />
                  <span>Available / In Stock</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-espresso cursor-pointer">
                  <input
                    type="checkbox"
                    checked={menuForm.featured}
                    onChange={(e) => setMenuForm({ ...menuForm, featured: e.target.checked })}
                    className="rounded text-caramel focus:ring-caramel"
                  />
                  <span>Featured Item</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-line mt-4">
                <button
                  type="button"
                  onClick={() => setMenuModalOpen(false)}
                  className="px-4 py-2 rounded text-xs text-ink-muted hover:text-espresso"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="btn-cafe btn-primary text-xs py-2 px-5 font-bold"
                >
                  {formSubmitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : editingItem ? (
                    'Save Changes'
                  ) : (
                    'Create Item'
                  )}
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
