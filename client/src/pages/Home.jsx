import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import StatsSection from '../components/StatsSection';
import MenuSection from '../components/MenuSection';
import SpecialSection from '../components/SpecialSection';
import FeaturesSection from '../components/FeaturesSection';
import Gallery from '../components/Gallery';
import Testimonials from '../components/Testimonials';
import ReservationForm from '../components/ReservationForm';
import ContactSection from '../components/ContactSection';

const Home = () => {
  return (
    <main id="main-content" className="flex-1">
      <Hero />
      <About />
      <StatsSection />
      <MenuSection />
      <SpecialSection />
      <FeaturesSection />
      <Gallery />
      <Testimonials />
      <ReservationForm />
      <ContactSection />
    </main>
  );
};

export default Home;
