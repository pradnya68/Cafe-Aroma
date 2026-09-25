import React from 'react';
import { useCart } from '../context/CartContext';

const SpecialSection = () => {
  const { addItem } = useCart();

  const handleOrderNow = () => {
    addItem({
      name: 'Caramel Cinnamon Latte',
      price: 199,
      image: '/assets/special-latte.jpg',
      category: 'specials',
    });
  };

  return (
    <section className="special-section" id="specialties" aria-labelledby="special-title">
      <div className="special-section__glow" aria-hidden="true"></div>
      <span className="bean bean--special-one" aria-hidden="true"></span>
      <span className="bean bean--special-two" aria-hidden="true"></span>

      <div className="container special-grid">
        <div className="special-copy reveal reveal--left">
          <p className="eyebrow eyebrow--light">Today's special <span></span></p>
          <p className="special-kicker">A little extra warmth</p>
          <h2 id="special-title" className="section-title section-title--light">
            Caramel<br /><em>cinnamon latte</em>
          </h2>
          <p>
            Smooth espresso blended with steamed milk, caramel and cinnamon. A little sweet, a little spiced, and exactly right for the season.
          </p>
          <div className="special-price">
            <span>₹199</span>
            <small>12 oz · served warm</small>
          </div>
          <button
            className="button button--gold"
            type="button"
            data-order="Caramel Cinnamon Latte"
            onClick={handleOrderNow}
          >
            Order now <svg><use href="#icon-arrow"></use></svg>
          </button>
        </div>

        <div className="special-visual reveal reveal--right">
          <div className="special-visual__ring"></div>
          <img src="/assets/special-latte.jpg" alt="Caramel cinnamon latte with cinnamon sticks" loading="lazy" />
          <span className="special-visual__stamp">
            <b>AROMA</b>
            <small>seasonal<br />pour</small>
          </span>
        </div>
      </div>
    </section>
  );
};

export default SpecialSection;
