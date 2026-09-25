import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Clock,
  MapPin,
  Utensils,
  Package,
  AlertCircle,
  Loader2,
} from 'lucide-react';

const OrderPage = () => {
  const { items, totalItems, subtotal, updateQuantity, removeItem, clearCart } = useCart();
  const { user } = useAuth();

  const [customerDetails, setCustomerDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    orderType: 'dine-in', // 'dine-in' | 'takeaway' | 'delivery'
    tableNumber: 'Table 1',
    deliveryAddress: '',
    specialNotes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [placedOrder, setPlacedOrder] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!items.length) {
      setError('Your cart is empty. Please add items before placing an order.');
      return;
    }

    if (!customerDetails.name.trim() || !customerDetails.phone.trim()) {
      setError('Please provide your name and phone number for the order.');
      return;
    }

    if (customerDetails.orderType === 'delivery' && !customerDetails.deliveryAddress.trim()) {
      setError('Please provide a delivery address.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderPayload = {
        items: items.map((i) => ({
          menuItem: i._id.length === 24 ? i._id : null,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        totalAmount: subtotal,
        customerDetails,
      };

      const res = await orderAPI.create(orderPayload);
      if (res.data.success) {
        setPlacedOrder(res.data.data);
        clearCart();
      }
    } catch (err) {
      console.error('Failed to place order:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="pt-28 pb-20 bg-cream min-h-screen">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-line shadow-2xl text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={36} />
            </div>

            <span className="eyebrow mb-2">Order Confirmed</span>
            <h1 className="font-display text-3xl sm:text-4xl text-espresso mb-3 font-semibold">
              Thank you for your order!
            </h1>
            <p className="text-ink-muted text-sm max-w-md mx-auto mb-6">
              We have received your order and our baristas are preparing your freshly brewed selections.
            </p>

            <div className="p-4 bg-cream/50 rounded-xl border border-line text-left text-xs space-y-2 mb-8">
              <div className="flex justify-between">
                <span className="text-ink-muted">Order ID:</span>
                <span className="font-mono font-semibold text-espresso">{placedOrder._id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-muted">Order Type:</span>
                <span className="font-semibold text-espresso capitalize">{placedOrder.customerDetails.orderType}</span>
              </div>
              {placedOrder.customerDetails.tableNumber && (
                <div className="flex justify-between">
                  <span className="text-ink-muted">Table / Seating:</span>
                  <span className="font-semibold text-espresso">{placedOrder.customerDetails.tableNumber}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-ink-muted">Estimated Prep Time:</span>
                <span className="font-semibold text-caramel">10 – 15 minutes</span>
              </div>
              <div className="flex justify-between border-t border-line/60 pt-2 font-display text-sm font-bold">
                <span>Total Amount:</span>
                <span className="text-caramel">₹{placedOrder.totalAmount}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/menu" className="btn-cafe btn-primary text-xs tracking-wider font-bold">
                Order more items
              </Link>
              <Link to="/" className="btn-cafe btn-dark text-xs tracking-wider font-bold">
                Return home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 bg-cream min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="mb-8">
          <span className="eyebrow mb-2">Checkout</span>
          <h1 className="section-title">Complete Your Order</h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-line shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center text-caramel/50 mx-auto mb-4">
              <ShoppingBag size={32} />
            </div>
            <h2 className="font-display text-2xl text-espresso mb-2">Your cart is empty</h2>
            <p className="text-ink-muted text-sm mb-6">
              Looks like you haven't added any coffees or bakes yet.
            </p>
            <Link to="/menu" className="btn-cafe btn-primary text-xs tracking-wider font-bold">
              Explore Our Menu <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Customer Details Form */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-line shadow-md">
              <h2 className="font-display text-xl font-medium text-espresso mb-4">
                1. Order &amp; Contact Details
              </h2>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                {/* Order Type Selector */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-ink-muted mb-2">
                    Service Type
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'dine-in', label: 'Dine-In', icon: Utensils },
                      { id: 'takeaway', label: 'Takeaway', icon: Package },
                      { id: 'delivery', label: 'Delivery', icon: MapPin },
                    ].map((type) => {
                      const Icon = type.icon;
                      const selected = customerDetails.orderType === type.id;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setCustomerDetails({ ...customerDetails, orderType: type.id })}
                          className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-xs font-semibold ${
                            selected
                              ? 'border-caramel bg-espresso text-gold shadow-sm'
                              : 'border-line bg-cream/40 text-ink-muted hover:border-caramel/40'
                          }`}
                        >
                          <Icon size={16} />
                          <span>{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-ink-muted mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Your name"
                      value={customerDetails.name}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-cream/40 border border-line text-xs text-espresso focus:outline-none focus:border-caramel"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-ink-muted mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={customerDetails.phone}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-cream/40 border border-line text-xs text-espresso focus:outline-none focus:border-caramel"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-ink-muted mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={customerDetails.email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-cream/40 border border-line text-xs text-espresso focus:outline-none focus:border-caramel"
                  />
                </div>

                {/* Conditional Fields based on Service Type */}
                {customerDetails.orderType === 'dine-in' && (
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-ink-muted mb-1">
                      Table / Booth Number
                    </label>
                    <select
                      name="tableNumber"
                      value={customerDetails.tableNumber}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-cream/40 border border-line text-xs text-espresso focus:outline-none focus:border-caramel"
                    >
                      <option value="Table 1">Table 1 (Window)</option>
                      <option value="Table 2">Table 2 (Window)</option>
                      <option value="Table 3">Table 3 (Coffee Bar)</option>
                      <option value="Table 4">Table 4 (Center Lounge)</option>
                      <option value="Table 5">Table 5 (Garden Patio)</option>
                      <option value="Not seated yet">Not seated yet / Ordering at counter</option>
                    </select>
                  </div>
                )}

                {customerDetails.orderType === 'delivery' && (
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold text-ink-muted mb-1">
                      Delivery Address *
                    </label>
                    <textarea
                      name="deliveryAddress"
                      rows="2"
                      required
                      placeholder="Apartment, Street name, Pune locality, Landmark"
                      value={customerDetails.deliveryAddress}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-cream/40 border border-line text-xs text-espresso focus:outline-none focus:border-caramel"
                    />
                  </div>
                )}

                {/* Special Instructions */}
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-ink-muted mb-1">
                    Special Preparation Notes
                  </label>
                  <textarea
                    name="specialNotes"
                    rows="2"
                    placeholder="Oat milk preference, extra hot, less sugar, packaging notes..."
                    value={customerDetails.specialNotes}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-cream/40 border border-line text-xs text-espresso focus:outline-none focus:border-caramel"
                  />
                </div>

                {/* Place Order CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-cafe btn-primary text-xs py-3.5 tracking-widest font-bold shadow-lg flex items-center justify-center gap-2 mt-4"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending order to barista...</span>
                    </>
                  ) : (
                    <>
                      <span>Place Order • ₹{subtotal}</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Order Items Summary */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 border border-line shadow-md space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-line">
                <h2 className="font-display text-xl font-medium text-espresso">
                  2. Order Summary
                </h2>
                <span className="text-xs text-caramel font-semibold">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-3 items-center justify-between">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover bg-beige flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-espresso text-xs truncate">{item.name}</h4>
                      <p className="text-xs text-caramel font-semibold">₹{item.price}</p>
                    </div>

                    <div className="flex items-center border border-line rounded bg-cream/40">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="p-1 hover:text-espresso text-ink-muted"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="px-1.5 text-xs font-bold text-espresso">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="p-1 hover:text-espresso text-ink-muted"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item._id)}
                      className="text-ink-muted hover:text-red-600 transition p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Pricing breakdown */}
              <div className="border-t border-line pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-ink-muted">
                  <span>Subtotal</span>
                  <span className="font-semibold text-espresso">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-ink-muted">
                  <span>Taxes &amp; Service</span>
                  <span className="font-semibold text-emerald-700">Included</span>
                </div>
                <div className="border-t border-line/60 pt-3 flex justify-between font-display text-lg font-bold text-espresso">
                  <span>Total Amount</span>
                  <span className="text-caramel">₹{subtotal}</span>
                </div>
              </div>

              <div className="p-3 bg-cream/60 rounded-lg text-[11px] text-ink-muted flex items-center gap-2">
                <Clock size={14} className="text-caramel flex-shrink-0" />
                <span>Orders are fresh crafted immediately upon receipt.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderPage;
