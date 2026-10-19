import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

// Rotating coffee offers for the Specialties section
const ROTATING_OFFERS = [
  {
    _id: 'spec-offer-caramel-latte',
    name: 'Caramel Cinnamon Latte',
    eyebrow: "Today's special",
    kicker: 'A little extra warmth',
    titleLine1: 'Caramel',
    titleLine2: 'cinnamon latte',
    description:
      'Smooth espresso blended with steamed milk, caramel and cinnamon. A little sweet, a little spiced, and exactly right for the season.',
    price: 199,
    serving: '12 oz · served warm',
    image: '/assets/special-latte.jpg',
    badgeBrand: 'AROMA',
    badgeLine1: 'seasonal',
    badgeLine2: 'pour',
    category: 'specials',
  },
  {
    _id: 'spec-offer-classic-cappuccino',
    name: 'Classic Cappuccino',
    eyebrow: 'Barista signature',
    kicker: 'Velvety microfoam perfection',
    titleLine1: 'Classic',
    titleLine2: 'cappuccino',
    description:
      'Rich double espresso crowned with dense, silky textured microfoam and finished with a dusting of single-origin dark cocoa.',
    price: 160,
    serving: '8 oz · served hot',
    image: '/assets/hero-cafe.jpg',
    badgeBrand: 'AROMA',
    badgeLine1: 'guest',
    badgeLine2: 'favourite',
    category: 'coffee',
  },
  {
    _id: 'spec-offer-mocha-delight',
    name: 'Mocha Delight',
    eyebrow: 'House specialty',
    kicker: 'Decadent chocolate indulgence',
    titleLine1: 'Mocha',
    titleLine2: 'delight',
    description:
      'Artisanal dark chocolate ganache melted into intense espresso and velvety milk, topped with whipped chocolate drizzle.',
    price: 190,
    serving: '12 oz · served warm',
    image: '/assets/coffee-beans.jpg',
    badgeBrand: 'AROMA',
    badgeLine1: 'artisan',
    badgeLine2: 'blend',
    category: 'coffee',
  },
  {
    _id: 'spec-offer-hazelnut-cold-coffee',
    name: 'Hazelnut Cold Coffee',
    eyebrow: 'Chilled reserve',
    kicker: 'Crisp & refreshing roast',
    titleLine1: 'Hazelnut',
    titleLine2: 'cold coffee',
    description:
      'Slow-steeped cold brew infusion paired with toasted hazelnut praline syrup and chilled whole milk over crystal ice spheres.',
    price: 210,
    serving: '16 oz · served iced',
    image: '/assets/barista-pour.jpg',
    badgeBrand: 'AROMA',
    badgeLine1: 'cold',
    badgeLine2: 'steeped',
    category: 'specials',
  },
];

// 4 offers + 1 clone of first offer for seamless forward infinite loop
const SLIDES = [
  ...ROTATING_OFFERS,
  { ...ROTATING_OFFERS[0], _id: 'spec-offer-caramel-latte-clone' },
];

const SpecialSection = () => {
  const { addItem } = useCart();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Preload images
  useEffect(() => {
    ROTATING_OFFERS.forEach((offer) => {
      const img = new Image();
      img.src = offer.image;
    });
  }, []);

  // Automatic 5-second horizontal sliding timer
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Seamless snapback when reaching the cloned slide
  useEffect(() => {
    if (currentIndex === ROTATING_OFFERS.length) {
      // 850ms matches the CSS transition duration
      const resetTimer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(0);
      }, 850);

      return () => clearTimeout(resetTimer);
    } else if (currentIndex === 0 && !isTransitioning) {
      // Re-enable transition for the next slide after snapback
      const reenableTimer = setTimeout(() => {
        setIsTransitioning(true);
      }, 60);

      return () => clearTimeout(reenableTimer);
    }
  }, [currentIndex, isTransitioning]);

  const handleOrderNow = (offer) => {
    addItem({
      _id: offer._id.replace('-clone', ''),
      name: offer.name,
      price: offer.price,
      image: offer.image,
      category: offer.category,
    });
  };

  return (
    <section
      className="special-section special-slider-section"
      id="specialties"
      aria-labelledby="special-title"
    >
      <div className="special-section__glow" aria-hidden="true"></div>
      <span className="bean bean--special-one" aria-hidden="true"></span>
      <span className="bean bean--special-two" aria-hidden="true"></span>

      <div className="special-slider-viewport">
        <div
          className="special-slider-track"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isTransitioning
              ? 'transform 0.85s cubic-bezier(0.25, 1, 0.5, 1)'
              : 'none',
          }}
        >
          {SLIDES.map((offer, idx) => (
            <div className="special-slide-item" key={`${offer._id}-${idx}`}>
              <div className="container special-grid">
                {/* Copy Side */}
                <div className="special-copy reveal reveal--left is-visible">
                  <p className="eyebrow eyebrow--light">
                    {offer.eyebrow} <span></span>
                  </p>
                  <p className="special-kicker">{offer.kicker}</p>
                  <h2
                    id={idx === currentIndex % ROTATING_OFFERS.length ? 'special-title' : undefined}
                    className="section-title section-title--light"
                  >
                    {offer.titleLine1}
                    <br />
                    <em>{offer.titleLine2}</em>
                  </h2>
                  <p>{offer.description}</p>
                  <div className="special-price">
                    <span>₹{offer.price}</span>
                    <small>{offer.serving}</small>
                  </div>
                  <button
                    className="button button--gold"
                    type="button"
                    data-order={offer.name}
                    onClick={() => handleOrderNow(offer)}
                  >
                    Order now <svg><use href="#icon-arrow"></use></svg>
                  </button>
                </div>

                {/* Visual Side */}
                <div className="special-visual reveal reveal--right is-visible">
                  <div className="special-visual__ring"></div>
                  <img
                    src={offer.image}
                    alt={`${offer.name} - Café Aroma Special Offer`}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                  <span className="special-visual__stamp">
                    <b>{offer.badgeBrand}</b>
                    <small>
                      {offer.badgeLine1}
                      <br />
                      {offer.badgeLine2}
                    </small>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scoped CSS for Horizontal Infinite Slider */}
      <style>{`
        .special-slider-section {
          position: relative;
          overflow: hidden;
        }
        .special-slider-viewport {
          width: 100%;
          overflow: hidden;
          position: relative;
          z-index: 1;
        }
        .special-slider-track {
          display: flex;
          width: 100%;
          will-change: transform;
        }
        .special-slide-item {
          flex: 0 0 100%;
          width: 100%;
          min-width: 100%;
          box-sizing: border-box;
        }
      `}</style>
    </section>
  );
};

export default SpecialSection;
