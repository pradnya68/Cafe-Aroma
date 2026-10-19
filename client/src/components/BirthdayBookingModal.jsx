import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Users, Gift, CheckCircle, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { reservationAPI } from '../services/api';
import { playCelebrationFanfare } from '../utils/celebrationSound';

const BirthdayBookingModal = ({ offer, isOpen, onClose, onBookingSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '18:00',
    guests: '4 guests',
    cakeFlavor: 'Belgian Dark Chocolate Truffle',
    cakeMessage: '',
    specialRequest: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [confirmedData, setConfirmedData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Lock body scroll and set default date to tomorrow
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('lightbox-open');
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      setFormData((prev) => ({
        ...prev,
        date: prev.date || `${yyyy}-${mm}-${dd}`,
      }));
      setSubmitted(false);
      setErrorMsg('');
    } else {
      document.body.classList.remove('lightbox-open');
    }
    return () => {
      document.body.classList.remove('lightbox-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter customer full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }
    if (!formData.date) {
      setErrorMsg('Please select a celebration date.');
      return;
    }

    setLoading(true);

    try {
      // Build combined notes with cake details and offer specifications
      const notes = [
        `🎂 BIRTHDAY CELEBRATION PACKAGE: ${offer?.title || 'Custom Birthday Celebration'}`,
        formData.cakeFlavor ? `Cake Selection: ${formData.cakeFlavor}` : null,
        formData.cakeMessage ? `Cake Message: "${formData.cakeMessage}"` : null,
        formData.specialRequest ? `Special Notes: ${formData.specialRequest}` : null,
      ]
        .filter(Boolean)
        .join(' | ');

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        date: formData.date,
        time: formData.time,
        guests: formData.guests,
        specialRequest: notes,
        isBirthdayBooking: true,
        offerTitle: offer?.title || 'Birthday Special',
        offerId: offer?._id || null,
      };

      const res = await reservationAPI.create(payload);

      if (res.data.success) {
        setConfirmedData(res.data.data);
        setSubmitted(true);
        playCelebrationFanfare();
        if (onBookingSuccess) onBookingSuccess(res.data.data);
      } else {
        setErrorMsg(res.data.message || 'Unable to complete booking. Please try again.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Server error. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-coffee/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-line relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-espresso text-cream p-6 relative border-b border-gold/30 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-cream flex items-center justify-center transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-widest mb-1">
            <Sparkles size={14} />
            <span>Café Aroma Celebrations</span>
          </div>
          <h2 id="booking-modal-title" className="font-display text-2xl font-bold text-white">
            {submitted ? 'Celebration Confirmed! 🎉' : 'Book Birthday Celebration'}
          </h2>

          {offer && !submitted && (
            <div className="mt-3 p-3 rounded-xl bg-dark-coffee/70 border border-gold/30 flex items-center gap-3">
              <img
                src={offer.image || '/assets/pastry-breakfast.jpg'}
                alt={offer.title}
                className="w-12 h-12 rounded-lg object-cover shrink-0 border border-gold/40"
              />
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-gold block truncate">{offer.title}</span>
                <span className="text-[11px] text-cream/70 block">
                  {offer.discountedPrice === 0 ? 'Complimentary Birthday Treat' : `Special Rate: ₹${offer.discountedPrice ?? offer.originalPrice}`}
                  {offer.specialReward && ` · ${offer.specialReward}`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {submitted ? (
            /* Booking Confirmation Screen */
            <div className="text-center py-4 space-y-5 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle size={44} />
              </div>

              <div>
                <h3 className="font-display text-2xl font-bold text-espresso mb-1">
                  We Can't Wait to Celebrate with You!
                </h3>
                <p className="text-sm text-ink-muted max-w-md mx-auto">
                  A table reservation has been reserved for <strong className="text-espresso">{formData.name}</strong> at Café Aroma Kharadi.
                </p>
              </div>

              <div className="p-5 bg-cream/40 rounded-2xl border border-line text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-ink-muted">Booking Reference</span>
                  <span className="font-mono font-bold text-espresso">
                    #{confirmedData?._id ? confirmedData._id.slice(-6).toUpperCase() : 'BDAY-OK'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-ink-muted">Celebration Package</span>
                  <span className="font-semibold text-espresso">{offer?.title || 'Birthday Experience'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-ink-muted">Date & Time</span>
                  <span className="font-semibold text-espresso">{formData.date} at {formData.time}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-line/60">
                  <span className="text-ink-muted">Guest Count</span>
                  <span className="font-semibold text-espresso">{formData.guests}</span>
                </div>
                {formData.cakeMessage && (
                  <div className="flex justify-between py-1">
                    <span className="text-ink-muted">Cake Plaque Message</span>
                    <span className="font-semibold text-caramel italic">"{formData.cakeMessage}"</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left flex items-start gap-2.5">
                <Sparkles size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Friendly Reminder:</strong> Please present valid government or photo ID showing your birth date to our friendly barista upon arrival to redeem your surprise offer.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-espresso hover:bg-caramel text-white font-bold text-sm transition shadow-md"
              >
                Done & Return to Menu
              </button>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Requirement 5: Collect Customer Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-espresso mb-1">
                  Customer Name <span className="text-caramel">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sarah Jenkins"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-line bg-cream/20 text-espresso text-sm focus:outline-none focus:border-caramel focus:ring-1 focus:ring-caramel transition"
                />
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-espresso mb-1">
                    Email Address <span className="text-caramel">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="sarah@example.com"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-cream/20 text-espresso text-sm focus:outline-none focus:border-caramel focus:ring-1 focus:ring-caramel transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-espresso mb-1">
                    Phone Number <span className="text-caramel">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-line bg-cream/20 text-espresso text-sm focus:outline-none focus:border-caramel focus:ring-1 focus:ring-caramel transition"
                  />
                </div>
              </div>

              {/* Date, Time & Guests Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-espresso mb-1 flex items-center gap-1">
                    <Calendar size={13} className="text-caramel" />
                    <span>Date <span className="text-caramel">*</span></span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-3 py-2.5 rounded-xl border border-line bg-cream/20 text-espresso text-sm focus:outline-none focus:border-caramel transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-espresso mb-1 flex items-center gap-1">
                    <Clock size={13} className="text-caramel" />
                    <span>Time Slot <span className="text-caramel">*</span></span>
                  </label>
                  <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-line bg-cream/20 text-espresso text-sm focus:outline-none focus:border-caramel transition"
                  >
                    <option value="10:00 AM">10:00 AM (Morning Brew)</option>
                    <option value="12:00 PM">12:00 PM (Noon Lunch)</option>
                    <option value="2:30 PM">2:30 PM (Afternoon Tea)</option>
                    <option value="5:00 PM">5:00 PM (Sunset Coffee)</option>
                    <option value="7:00 PM">7:00 PM (Evening Party)</option>
                    <option value="8:30 PM">8:30 PM (Dinner & Dessert)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-espresso mb-1 flex items-center gap-1">
                    <Users size={13} className="text-caramel" />
                    <span>Guests <span className="text-caramel">*</span></span>
                  </label>
                  <select
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-line bg-cream/20 text-espresso text-sm focus:outline-none focus:border-caramel transition"
                  >
                    <option value="2 guests">2 guests (Cozy Duo)</option>
                    <option value="4 guests">4 guests (Family/Friends)</option>
                    <option value="6 guests">6 guests (Celebration Table)</option>
                    <option value="8 guests">8 guests (Squad Party)</option>
                    <option value="10+ guests">10+ guests (VIP Lounge)</option>
                  </select>
                </div>
              </div>

              {/* Cake Preference & Message */}
              <div className="p-4 rounded-2xl bg-cream/30 border border-line/70 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-espresso uppercase tracking-wider">
                  <Gift size={14} className="text-caramel" />
                  <span>Birthday Cake Customisation</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                      Cake Flavor / Preference
                    </label>
                    <select
                      name="cakeFlavor"
                      value={formData.cakeFlavor}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-line bg-white text-xs text-espresso focus:outline-none focus:border-caramel transition"
                    >
                      <option value="Belgian Dark Chocolate Truffle">Belgian Dark Chocolate Truffle</option>
                      <option value="Classic Italian Tiramisu">Classic Italian Tiramisu</option>
                      <option value="Red Velvet Cream Cheese">Red Velvet Cream Cheese</option>
                      <option value="Blueberry New York Cheesecake">Blueberry New York Cheesecake</option>
                      <option value="No Cake (Beverages Only)">No Cake (Beverages & Platters Only)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-ink-muted mb-1">
                      Name / Message on Cake
                    </label>
                    <input
                      type="text"
                      name="cakeMessage"
                      value={formData.cakeMessage}
                      onChange={handleChange}
                      placeholder="e.g. Happy Birthday Sarah!"
                      className="w-full px-3 py-2 rounded-lg border border-line bg-white text-xs text-espresso focus:outline-none focus:border-caramel transition"
                    />
                  </div>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-espresso mb-1">
                  Special Requests / Dietary Notes
                </label>
                <textarea
                  name="specialRequest"
                  rows="2"
                  value={formData.specialRequest}
                  onChange={handleChange}
                  placeholder="e.g. Window corner table requested, eggless pastry, balloon color preference..."
                  className="w-full px-4 py-2 rounded-xl border border-line bg-cream/20 text-espresso text-xs focus:outline-none focus:border-caramel transition resize-none"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-espresso hover:bg-caramel text-white font-bold text-sm transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Reserving Birthday Table...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} className="text-gold" />
                    <span>Confirm Birthday Celebration Booking</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BirthdayBookingModal;
