import React from 'react';
import ReservationForm from '../components/ReservationForm';

const ReservationPage = () => {
  return (
    <div className="pt-24 bg-dark-coffee min-h-screen">
      <section className="text-white py-12 text-center relative overflow-hidden border-b border-dark-line">
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          <span className="eyebrow eyebrow--light mb-3">Reservations</span>
          <h1 className="font-display text-4xl sm:text-5xl font-medium mb-3">
            Book your <em className="text-gold">coffee table.</em>
          </h1>
          <p className="text-cream/80 text-sm sm:text-base max-w-md mx-auto">
            Reserve ahead for slow morning breakfasts, business meetings, or relaxed weekend coffee rituals.
          </p>
        </div>
      </section>

      <ReservationForm />
    </div>
  );
};

export default ReservationPage;
