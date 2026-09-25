import React from 'react';
import Gallery from '../components/Gallery';

const GalleryPage = () => {
  return (
    <div className="pt-24 pb-20 bg-cream min-h-screen">
      <section className="bg-dark-coffee text-white py-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-caramel/15 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 max-w-4xl relative z-10">
          <span className="eyebrow eyebrow--light mb-3">Photo Showcase</span>
          <h1 className="font-display text-4xl sm:text-5xl font-medium mb-4">
            A glimpse <em className="text-gold">inside Aroma.</em>
          </h1>
          <p className="text-cream/80 text-sm sm:text-base max-w-lg mx-auto">
            Sunlit tables, small-batch roasts, and the cozy moments that bring our community together every single morning.
          </p>
        </div>
      </section>

      <Gallery showHeader={false} />
    </div>
  );
};

export default GalleryPage;
