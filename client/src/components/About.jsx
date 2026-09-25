import React from 'react';

const About = () => {
  return (
    <section className="section about-section" id="about" aria-labelledby="about-title">
      <div className="container about-grid">
        <div className="about-visual reveal reveal--left">
          <div className="about-visual__frame"></div>
          <figure className="about-visual__image">
            <img src="/assets/cafe-interior.jpg" alt="Warm, light-filled Café Aroma interior with walnut coffee bar" loading="lazy" />
          </figure>
          <div className="experience-badge">
            <strong>10<span>+</span></strong>
            <span>years of craft</span>
          </div>
          <span className="about-visual__caption">Since 2016 <i></i> Pune, India</span>
        </div>
        <div className="about-copy reveal reveal--right">
          <p className="eyebrow">Our story <span></span></p>
          <h2 id="about-title" className="section-title">Crafted with passion,<br /><em>served with heart.</em></h2>
          <p className="lead-copy">Aroma began with a simple belief: a great cup of coffee has the power to slow time down. What started as a tiny bar in Koregaon Park has grown into a warm corner of the city where the day always starts a little better.</p>
          <p className="body-copy">We source seasonal beans from thoughtful growers, roast in small batches, and let every ingredient speak for itself. Pair that with a freshly baked pastry, a familiar face, and a little room to breathe — that is the Aroma ritual.</p>
          <div className="about-notes">
            <span><svg><use href="#icon-leaf"></use></svg> Thoughtfully sourced</span>
            <span><svg><use href="#icon-heart"></use></svg> Made with care</span>
          </div>
          <a className="text-link" href="#contact">Discover our story <svg><use href="#icon-arrow"></use></svg></a>
        </div>
      </div>
    </section>
  );
};

export default About;
