import React from 'react';
import SpecialSection from '../components/SpecialSection';
import MenuCard from '../components/MenuCard';

const signatureItems = [
  {
    _id: 'spec-1',
    name: 'Caramel Macchiato',
    description: 'Vanilla · caramel · espresso · warm spice',
    price: 220,
    category: 'specials',
    image: '/assets/special-latte.jpg',
    badge: 'Aroma special',
    available: true,
  },
  {
    _id: 'spec-2',
    name: 'Cold Brew Reserve',
    description: '18-hour steep · chilled · clean & bright finish',
    price: 200,
    category: 'coffee',
    image: '/assets/barista-pour.jpg',
    badge: 'Slow steeped',
    available: true,
  },
  {
    _id: 'spec-3',
    name: 'Chocolate Ganache Cake',
    description: '70% single origin cocoa · sea salt · soft ganache centre',
    price: 180,
    category: 'desserts',
    image: '/assets/pastry-breakfast.jpg',
    badge: 'Made in-house',
    available: true,
  },
];

const SpecialtiesPage = () => {
  return (
    <div className="pt-24 pb-20 bg-cream min-h-screen">
      <section className="bg-dark-coffee text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-caramel/15 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <span className="eyebrow eyebrow--light mb-3">House Signatures</span>
          <h1 className="font-display text-4xl sm:text-5xl font-medium mb-4">
            Aroma <em className="text-gold">specialties.</em>
          </h1>
          <p className="text-cream/80 text-sm sm:text-base max-w-lg mx-auto">
            Each specialty represents months of recipe refinement by our head baristas, pairing regional ingredients with timeless coffee traditions.
          </p>
        </div>
      </section>

      {/* Featured Special Pour - Auto-Rotating Horizontal Slider */}
      <SpecialSection />

      {/* Signature Items Showcase */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="eyebrow mb-2">Curated selection</span>
            <h2 className="section-title">Barista Favourites</h2>
            <p className="text-ink-muted text-sm mt-3">
              The dishes and drinks our regular guests order time and time again.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {signatureItems.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SpecialtiesPage;
