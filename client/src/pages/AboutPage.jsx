import React from 'react';
import { Link } from 'react-router-dom';
import StatsSection from '../components/StatsSection';
import FeaturesSection from '../components/FeaturesSection';
import { Leaf, Award, Heart, Coffee, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="pt-24 pb-20 bg-cream">
      {/* Page Header */}
      <section className="bg-dark-coffee text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-caramel/15 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-8 max-w-5xl text-center relative z-10">
          <span className="eyebrow eyebrow--light mb-3">Our Story &amp; Heritage</span>
          <h1 className="font-display text-4xl sm:text-6xl font-medium mb-6">
            A quiet sanctuary for<br />
            <em className="text-gold">thoughtful coffee.</em>
          </h1>
          <p className="text-cream/80 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Since 2016, Café Aroma has been Pune’s beloved neighborhood corner for freshly roasted beans, flaky pastries, and warm conversations.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <span className="eyebrow">The Aroma Ritual</span>
              <h2 className="section-title">
                Slow mornings,<br />
                <em>honest craftsmanship.</em>
              </h2>
              <p className="text-ink-muted text-base sm:text-lg leading-relaxed">
                Coffee is not just a daily routine to rush through; it is an invitation to pause. Every bag of beans at Café Aroma is roasted in small micro-batches right here in Maharashtra.
              </p>
              <p className="text-ink-muted text-sm sm:text-base leading-relaxed">
                We work directly with passionate coffee planters in Chikmagalur and Coorg, ensuring ethical compensation and the purest cherry harvests. From precision water temperature to delicate grind profiles, our baristas pour each cup with intention.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="p-4 bg-white rounded-xl border border-line shadow-sm">
                  <div className="text-caramel font-display text-2xl font-bold mb-1">100%</div>
                  <p className="text-xs uppercase tracking-wider text-espresso font-semibold">Specialty Arabica</p>
                </div>
                <div className="p-4 bg-white rounded-xl border border-line shadow-sm">
                  <div className="text-caramel font-display text-2xl font-bold mb-1">Small Batch</div>
                  <p className="text-xs uppercase tracking-wider text-espresso font-semibold">Freshly Roasted</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-espresso aspect-[4/3]">
                <img
                  src="/assets/barista-pour.jpg"
                  alt="Barista brewing coffee"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Features Component */}
      <FeaturesSection />

      {/* Call to Action Banner */}
      <section className="py-16 bg-cream border-t border-line text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="font-display text-3xl sm:text-4xl text-espresso mb-4">
            Experience Café Aroma in Person
          </h2>
          <p className="text-ink-muted text-sm sm:text-base mb-8">
            Whether you are looking for a tranquil spot to read, a productive morning work session, or an evening gathering with friends, our tables are ready.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/reservation" className="btn-cafe btn-primary text-xs tracking-widest font-bold">
              Reserve a table
            </Link>
            <Link to="/menu" className="btn-cafe btn-dark text-xs tracking-widest font-bold">
              View full menu
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
