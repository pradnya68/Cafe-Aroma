import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <a className="brand brand--footer" href="#home" onClick={isHome ? scrollToTop : undefined}>
            <span className="brand-mark">
              <svg><use href="#icon-cup"></use></svg>
            </span>
            <span className="brand-name">CAFÉ <b>AROMA</b></span>
          </a>
          <p>Good coffee, made slowly.<br />Come as you are.</p>
          <div className="social-links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <svg><use href="#icon-instagram"></use></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg><use href="#icon-facebook"></use></svg>
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">
              <svg><use href="#icon-x"></use></svg>
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          {isHome ? (
            <>
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#menu">Menu</a>
              <a href="#gallery">Gallery</a>
            </>
          ) : (
            <>
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/menu">Menu</Link>
              <Link to="/gallery">Gallery</Link>
            </>
          )}
        </div>

        <div className="footer-column">
          <h3>Information</h3>
          {isHome ? (
            <>
              <a href="#contact">Contact</a>
              <a href="#reservations">Reservations</a>
              <a href="#contact">Privacy policy</a>
              <a href="#contact">Terms</a>
            </>
          ) : (
            <>
              <Link to="/contact">Contact</Link>
              <Link to="/reservation">Reservations</Link>
              <Link to="/contact">Privacy policy</Link>
              <Link to="/contact">Terms</Link>
            </>
          )}
        </div>

        <div className="footer-newsletter">
          <p className="eyebrow eyebrow--light">A note from Aroma <span></span></p>
          <h3>Something good is<br />always brewing.</h3>
          <p>Join our circle for seasonal pours, new bakes, and the occasional good excuse to visit.</p>
          <a
            className="text-link text-link--light"
            href="mailto:hello@cafe-aroma.com?subject=Join%20the%20Aroma%20circle"
          >
            Join the circle <svg><use href="#icon-arrow"></use></svg>
          </a>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 Café Aroma. All rights reserved.</span>
        <span>Designed for slow moments <i>✦</i></span>
        <a href="#home" onClick={scrollToTop}>
          Back to top <svg><use href="#icon-arrow-up"></use></svg>
        </a>
      </div>
    </footer>
  );
};

export default Footer;
