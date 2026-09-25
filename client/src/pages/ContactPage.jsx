import React from 'react';
import ContactSection from '../components/ContactSection';

const ContactPage = () => {
  return (
    <div className="pt-24 pb-20 bg-cream min-h-screen">
      <section className="bg-dark-coffee text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-caramel/15 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <span className="eyebrow eyebrow--light mb-3">Get In Touch</span>
          <h1 className="font-display text-4xl sm:text-5xl font-medium mb-4">
            Visit <em className="text-gold">Café Aroma.</em>
          </h1>
          <p className="text-cream/80 text-sm sm:text-base max-w-lg mx-auto">
            Find us in Koregaon Park, call ahead for inquiries, or send our hospitality team a message anytime.
          </p>
        </div>
      </section>

      <ContactSection showForm={true} />
    </div>
  );
};

export default ContactPage;
