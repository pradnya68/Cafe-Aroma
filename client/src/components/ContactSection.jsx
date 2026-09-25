import React from 'react';

const ContactSection = () => {
  return (
    <section className="section contact-section" id="contact" aria-labelledby="contact-title">
      <div className="container contact-grid">
        <div className="contact-copy reveal reveal--left">
          <p className="eyebrow">Come say hello <span></span></p>
          <h2 id="contact-title" className="section-title">Visit Café<br /><em>Aroma.</em></h2>
          <p className="lead-copy">A little corner for slow mornings, long conversations, and the best kind of pause.</p>
          <div className="contact-list">
            <a href="https://maps.google.com/?q=123+Coffee+Street+Pune" target="_blank" rel="noreferrer">
              <span className="contact-icon"><svg><use href="#icon-pin"></use></svg></span>
              <span><small>Find us</small>123 Coffee Street, Pune, Maharashtra</span>
            </a>
            <a href="tel:+919876543210">
              <span className="contact-icon"><svg><use href="#icon-phone"></use></svg></span>
              <span><small>Call us</small>+91 98765 43210</span>
            </a>
            <a href="mailto:hello@cafe-aroma.com">
              <span className="contact-icon"><svg><use href="#icon-mail"></use></svg></span>
              <span><small>Write to us</small>hello@cafe-aroma.com</span>
            </a>
          </div>
          <div className="opening-hours">
            <div><span>Monday – Friday</span><strong>8:00 AM – 10:00 PM</strong></div>
            <div><span>Saturday – Sunday</span><strong>9:00 AM – 11:30 PM</strong></div>
          </div>
        </div>

        <div className="map-card reveal reveal--right" aria-label="Map showing Café Aroma location">
          <div className="map-card__top">
            <span><i></i> Café Aroma</span>
            <span>Open today · 10:00 PM</span>
          </div>
          <div className="map-visual">
            <span className="map-road map-road--one"></span>
            <span className="map-road map-road--two"></span>
            <span className="map-road map-road--three"></span>
            <span className="map-road map-road--four"></span>
            <span className="map-block map-block--one"></span>
            <span className="map-block map-block--two"></span>
            <span className="map-block map-block--three"></span>
            <span className="map-block map-block--four"></span>
            <span className="map-block map-block--five"></span>
            <span className="map-pin">
              <svg><use href="#icon-pin"></use></svg>
              <b>AROMA</b>
            </span>
            <span className="map-label map-label--one">Koregaon Park</span>
            <span className="map-label map-label--two">Bund Garden Rd</span>
            <span className="map-label map-label--three">Mula-Mutha River</span>
          </div>
          <div className="map-card__bottom">
            <span><svg><use href="#icon-pin"></use></svg> 123 Coffee Street, Pune</span>
            <a href="https://maps.google.com/?q=123+Coffee+Street+Pune" target="_blank" rel="noreferrer">
              Get directions <svg><use href="#icon-arrow"></use></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
