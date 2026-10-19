import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled((window.scrollY || window.pageYOffset) > 36);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section observer to update active nav link on scroll (matching reference website)
  useEffect(() => {
    if (!isHome) return;

    const sections = ['home', 'about', 'menu', 'gallery', 'specialties', 'contact']
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!sections.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-35% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, [isHome]);

  const closeMobile = () => {
    setMobileOpen(false);
    document.body.classList.remove('menu-open');
  };

  const toggleMobile = () => {
    setMobileOpen((prev) => {
      const next = !prev;
      if (next) {
        document.body.classList.add('menu-open');
      } else {
        document.body.classList.remove('menu-open');
      }
      return next;
    });
  };

  return (
    <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`} id="siteHeader">
      <div className="container nav-shell">
        {/* Brand Mark & Title */}
        <a
          href="#home"
          className="brand"
          aria-label="Café Aroma home"
          onClick={(e) => {
            if (!isHome) return;
            closeMobile();
          }}
        >
          <span className="brand-mark">
            <svg><use href="#icon-cup"></use></svg>
          </span>
          <span className="brand-name">CAFÉ <b>AROMA</b></span>
        </a>

        {/* Desktop Navigation - Exact match to reference demo */}
        <nav className="desktop-nav" aria-label="Primary navigation">
          {isHome ? (
            <>
              <a className={`nav-link ${activeSection === 'home' ? 'is-active' : ''}`} href="#home">Home</a>
              <a className={`nav-link ${activeSection === 'about' ? 'is-active' : ''}`} href="#about">About</a>
              <a className={`nav-link ${activeSection === 'menu' ? 'is-active' : ''}`} href="#menu">Menu</a>
              <a className={`nav-link ${activeSection === 'gallery' ? 'is-active' : ''}`} href="#gallery">Gallery</a>
              <a className={`nav-link ${activeSection === 'specialties' ? 'is-active' : ''}`} href="#specialties">Specialties</a>
              <Link className="nav-link font-semibold text-gold hover:text-caramel flex items-center gap-1" to="/birthday" style={{ color: 'var(--gold)' }}>
                <span>🎂 Birthdays</span>
              </Link>
              <a className={`nav-link ${activeSection === 'contact' ? 'is-active' : ''}`} href="#contact">Contact</a>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/#home">Home</Link>
              <Link className="nav-link" to="/#about">About</Link>
              <Link className="nav-link" to="/#menu">Menu</Link>
              <Link className="nav-link" to="/#gallery">Gallery</Link>
              <Link className="nav-link" to="/#specialties">Specialties</Link>
              <Link className="nav-link font-semibold flex items-center gap-1" to="/birthday" style={{ color: 'var(--gold)' }}>
                <span>🎂 Birthdays</span>
              </Link>
              <Link className="nav-link" to="/#contact">Contact</Link>
            </>
          )}

          {/* Added Login/Register for Desktop */}
          <span style={{ color: 'var(--line)' }}>|</span>
          {!isAuthenticated ? (
            <Link className="nav-link font-semibold" to="/login" style={{ color: 'var(--caramel)' }}>Sign In / Register</Link>
          ) : (
            <a className="nav-link font-semibold" href="#logout" onClick={(e) => { e.preventDefault(); logout(); }} style={{ color: 'var(--caramel)' }}>
              Sign Out ({user?.name?.split(' ')[0]})
            </a>
          )}
        </nav>

        {/* Book a Table Action */}
        <a
          className="button button--small button--outline nav-cta"
          href={isHome ? '#reservations' : '/reservation'}
        >
          Book a table <svg><use href="#icon-arrow"></use></svg>
        </a>

        {/* Mobile Hamburger Toggle */}
        <button
          className={`menu-toggle ${mobileOpen ? 'is-open' : ''}`}
          id="menuToggle"
          type="button"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-controls="mobileMenu"
          aria-expanded={mobileOpen}
          onClick={toggleMobile}
        >
          <svg className="menu-icon"><use href="#icon-menu"></use></svg>
          <svg className="close-icon"><use href="#icon-close"></use></svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'is-open' : ''}`} id="mobileMenu" aria-hidden={!mobileOpen}>
        <nav aria-label="Mobile navigation">
          {isHome ? (
            <>
              <a href="#home" onClick={closeMobile}>Home <span>01</span></a>
              <a href="#about" onClick={closeMobile}>About <span>02</span></a>
              <a href="#menu" onClick={closeMobile}>Menu <span>03</span></a>
              <a href="#gallery" onClick={closeMobile}>Gallery <span>04</span></a>
              <a href="#specialties" onClick={closeMobile}>Specialties <span>05</span></a>
              <Link to="/birthday" onClick={closeMobile} style={{ color: 'var(--gold)' }}>🎂 Birthday Specials <span>★</span></Link>
              <a href="#contact" onClick={closeMobile}>Contact <span>06</span></a>
            </>
          ) : (
            <>
              <Link to="/#home" onClick={closeMobile}>Home <span>01</span></Link>
              <Link to="/#about" onClick={closeMobile}>About <span>02</span></Link>
              <Link to="/#menu" onClick={closeMobile}>Menu <span>03</span></Link>
              <Link to="/#gallery" onClick={closeMobile}>Gallery <span>04</span></Link>
              <Link to="/#specialties" onClick={closeMobile}>Specialties <span>05</span></Link>
              <Link to="/birthday" onClick={closeMobile} style={{ color: 'var(--gold)' }}>🎂 Birthday Specials <span>★</span></Link>
              <Link to="/#contact" onClick={closeMobile}>Contact <span>06</span></Link>
            </>
          )}

          {isAdmin && (
            <Link to="/admin" onClick={closeMobile} style={{ color: 'var(--gold)' }}>
              Admin Dashboard <span>07</span>
            </Link>
          )}

          {!isAuthenticated ? (
            <Link to="/login" onClick={closeMobile}>
              Sign In / Register <span>08</span>
            </Link>
          ) : (
            <a
              href="#logout"
              onClick={(e) => {
                e.preventDefault();
                logout();
                closeMobile();
              }}
            >
              Sign Out ({user?.name?.split(' ')[0]}) <span>08</span>
            </a>
          )}
        </nav>
        <a
          className="button button--primary mobile-menu__cta"
          href={isHome ? '#reservations' : '/reservation'}
          onClick={closeMobile}
        >
          Book a table <svg><use href="#icon-arrow"></use></svg>
        </a>
      </div>
    </header>
  );
};

export default Navbar;
