import React from 'react';

const FeaturesSection = () => {
  return (
    <section className="section features-section" aria-labelledby="features-title">
      <div className="container">
        <div className="section-heading section-heading--center reveal">
          <p className="eyebrow">The Aroma way <span></span></p>
          <h2 id="features-title" className="section-title">
            Good coffee is just<br /><em>the beginning.</em>
          </h2>
        </div>

        <div className="features-grid">
          <article className="feature-card reveal">
            <span className="feature-card__number">01</span>
            <span className="feature-card__icon"><svg><use href="#icon-cup"></use></svg></span>
            <h3>Premium coffee</h3>
            <p>Carefully selected and freshly roasted beans, brewed with patience.</p>
            <a href="#menu" aria-label="Explore premium coffee menu"><svg><use href="#icon-arrow"></use></svg></a>
          </article>

          <article className="feature-card reveal reveal--delay-1">
            <span className="feature-card__number">02</span>
            <span className="feature-card__icon"><svg><use href="#icon-leaf"></use></svg></span>
            <h3>Fresh ingredients</h3>
            <p>Thoughtful produce, local bakes, and ingredients that taste like themselves.</p>
            <a href="#menu" aria-label="Explore fresh menu items"><svg><use href="#icon-arrow"></use></svg></a>
          </article>

          <article className="feature-card reveal reveal--delay-2">
            <span className="feature-card__number">03</span>
            <span className="feature-card__icon"><svg><use href="#icon-star"></use></svg></span>
            <h3>Expert baristas</h3>
            <p>Crafted by passionate coffee professionals who care about every detail.</p>
            <a href="#about" aria-label="Read our story"><svg><use href="#icon-arrow"></use></svg></a>
          </article>

          <article className="feature-card reveal reveal--delay-3">
            <span className="feature-card__number">04</span>
            <span className="feature-card__icon"><svg><use href="#icon-heart"></use></svg></span>
            <h3>Cozy atmosphere</h3>
            <p>A considered space to slow down, work awhile, and connect.</p>
            <a href="#contact" aria-label="Visit Café Aroma"><svg><use href="#icon-arrow"></use></svg></a>
          </article>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
