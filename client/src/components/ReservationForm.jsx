import React, { useState } from 'react';
import { reservationAPI } from '../services/api';

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    specialRequest: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.fullName = 'Please enter your name.';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email.';
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      errs.phone = 'Please enter a valid phone number.';
    }
    if (!formData.date) errs.date = 'Please pick a date.';
    if (!formData.time) errs.time = 'Please select a time.';
    if (!formData.guests) errs.guests = 'Please choose guest count.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setSuccess(false);

    try {
      const res = await reservationAPI.create(formData);
      if (res.data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          guests: '',
          specialRequest: '',
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to complete your reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="reservation-section" id="reservations" aria-labelledby="reservation-title">
      <div className="reservation-section__pattern" aria-hidden="true"></div>
      <div className="container reservation-grid">
        <div className="reservation-copy reveal reveal--left">
          <p className="eyebrow eyebrow--light">Your table is waiting <span></span></p>
          <h2 id="reservation-title" className="section-title section-title--light">
            Reserve your<br /><em>coffee moment.</em>
          </h2>
          <p>
            Make your next coffee moment special. Tell us when you are coming, and we will take care of the rest.
          </p>
          <div className="reservation-details">
            <span><svg><use href="#icon-clock"></use></svg> Walk-ins welcome, always.</span>
            <span><svg><use href="#icon-heart"></use></svg> Groups of 8+? Give us a call.</span>
          </div>
        </div>

        <div className="reservation-card reveal reveal--right">
          <form id="reservationForm" noValidate onSubmit={handleSubmit}>
            <div className="form-heading">
              <span>01</span>
              <h3>Make a reservation</h3>
              <p>We will confirm your table by email.</p>
            </div>

            <div className="form-grid">
              <div className={`form-field form-field--full ${errors.fullName ? 'has-error' : ''}`}>
                <label htmlFor="fullName">Full name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.fullName) setErrors({ ...errors, fullName: null });
                  }}
                  required
                />
                {errors.fullName && <small className="field-error">{errors.fullName}</small>}
              </div>

              <div className={`form-field ${errors.email ? 'has-error' : ''}`}>
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) setErrors({ ...errors, email: null });
                  }}
                  required
                />
                {errors.email && <small className="field-error">{errors.email}</small>}
              </div>

              <div className={`form-field ${errors.phone ? 'has-error' : ''}`}>
                <label htmlFor="phone">Phone number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) setErrors({ ...errors, phone: null });
                  }}
                  required
                />
                {errors.phone && <small className="field-error">{errors.phone}</small>}
              </div>

              <div className={`form-field ${errors.date ? 'has-error' : ''}`}>
                <label htmlFor="date">Date</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => {
                    setFormData({ ...formData, date: e.target.value });
                    if (errors.date) setErrors({ ...errors, date: null });
                  }}
                  required
                />
                {errors.date && <small className="field-error">{errors.date}</small>}
              </div>

              <div className={`form-field ${errors.time ? 'has-error' : ''}`}>
                <label htmlFor="time">Time</label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={(e) => {
                    setFormData({ ...formData, time: e.target.value });
                    if (errors.time) setErrors({ ...errors, time: null });
                  }}
                  required
                >
                  <option value="">Choose a time</option>
                  <option>8:00 AM</option>
                  <option>9:30 AM</option>
                  <option>11:00 AM</option>
                  <option>1:00 PM</option>
                  <option>3:30 PM</option>
                  <option>6:00 PM</option>
                  <option>8:30 PM</option>
                </select>
                {errors.time && <small className="field-error">{errors.time}</small>}
              </div>

              <div className={`form-field ${errors.guests ? 'has-error' : ''}`}>
                <label htmlFor="guests">Number of guests</label>
                <select
                  id="guests"
                  name="guests"
                  value={formData.guests}
                  onChange={(e) => {
                    setFormData({ ...formData, guests: e.target.value });
                    if (errors.guests) setErrors({ ...errors, guests: null });
                  }}
                  required
                >
                  <option value="">Select guests</option>
                  <option>1 guest</option>
                  <option>2 guests</option>
                  <option>3 guests</option>
                  <option>4 guests</option>
                  <option>5+ guests</option>
                </select>
                {errors.guests && <small className="field-error">{errors.guests}</small>}
              </div>

              <div className="form-field form-field--full">
                <label htmlFor="request">Special request <span>Optional</span></label>
                <textarea
                  id="request"
                  name="request"
                  rows="3"
                  placeholder="Birthday, window seat, dietary note..."
                  value={formData.specialRequest}
                  onChange={(e) => setFormData({ ...formData, specialRequest: e.target.value })}
                ></textarea>
              </div>
            </div>

            <button className="button button--primary button--full" type="submit" disabled={loading}>
              {loading ? 'Reserving...' : (
                <>Reserve table <svg><use href="#icon-arrow"></use></svg></>
              )}
            </button>

            <p className="form-footnote">
              <svg><use href="#icon-heart"></use></svg> Your information stays private and is only used for this reservation.
            </p>

            {success && (
              <div className="success-message" role="status" aria-live="polite">
                <span className="success-message__icon">✓</span>
                <div>
                  <strong>Your table has been reserved successfully! ☕</strong>
                  <small>We look forward to welcoming you to Aroma.</small>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ReservationForm;
