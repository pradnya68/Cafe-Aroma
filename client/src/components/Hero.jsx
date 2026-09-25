import React from 'react';

const Hero = () => {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero__media" aria-hidden="true"></div>
      <div className="hero__veil" aria-hidden="true"></div>
      <div className="hero__grain" aria-hidden="true"></div>
      
      <span className="bean bean--one" aria-hidden="true"></span>
      <span className="bean bean--two" aria-hidden="true"></span>
      <span className="bean bean--three" aria-hidden="true"></span>
      <span className="bean bean--four" aria-hidden="true"></span>

      <div className="container hero__content">
        <p className="eyebrow eyebrow--light hero__eyebrow">
          Welcome to Café Aroma <span></span>
        </p>

        <h1 id="hero-title" className="hero__title">
          <span className="hero__title-line">Where every sip</span>
          <span className="hero__title-line hero__title-line--accent">tells a story.</span>
        </h1>

        <p className="hero__intro">
          Freshly brewed coffee, handcrafted flavors, and moments worth remembering.
        </p>

        <div className="hero__actions">
          <a className="button button--primary" href="#menu">
            Explore our menu <svg><use href="#icon-arrow"></use></svg>
          </a>
          <a className="button button--ghost" href="#reservations">
            Book a table <svg><use href="#icon-arrow"></use></svg>
          </a>
        </div>

        <div className="hero__meta">
          <span><i></i> Specialty coffee &amp; slow mornings</span>
          <span className="hero__location">
            <svg><use href="#icon-pin"></use></svg> Pune · Maharashtra
          </span>
        </div>
      </div>

      <a className="scroll-cue" href="#about" aria-label="Scroll to our story">
        <span>Scroll to explore</span>
        <i></i>
      </a>
    </section>
  );
};

export default Hero;
