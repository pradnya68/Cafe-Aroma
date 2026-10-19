import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import SvgSprite from './components/SvgSprite';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import MenuPage from './pages/MenuPage';
import GalleryPage from './pages/GalleryPage';
import SpecialtiesPage from './pages/SpecialtiesPage';
import ContactPage from './pages/ContactPage';
import ReservationPage from './pages/ReservationPage';
import OrderPage from './pages/OrderPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BirthdayPage from './pages/BirthdayPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const { pathname } = useLocation();
  const { totalItems, setIsCartOpen } = useCart();
  const { isAdmin } = useAuth();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/superadmin');

  // Initialize is-ready state for hero animations and scroll listener
  useEffect(() => {
    // Add is-ready class to body after short delay (exact match to reference script)
    const timer = setTimeout(() => {
      document.body.classList.add('is-ready');
    }, 60);

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const percent = Math.min((scrollY / scrollable) * 100, 100);

      setScrollProgress(percent);
      setShowBackToTop(scrollY > 650);

      // Hero media parallax - exact match to reference
      const heroMedia = document.querySelector('.hero__media');
      if (heroMedia && scrollY < window.innerHeight * 1.2) {
        heroMedia.style.transform = `scale(1.07) translate3d(0, ${Math.min(scrollY * 0.11, 82)}px, 0)`;
      }

      // Reveal elements on scroll
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.9) {
          el.classList.add('is-visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Custom Cursor tracking (matching reference site exactly)
  useEffect(() => {
    const supportsFinePointer = window.matchMedia('(pointer: fine)').matches && window.innerWidth > 760;
    if (!supportsFinePointer) return;

    const dot = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    if (!dot || !ring) return;

    document.body.classList.add('custom-cursor');
    let ringX = -100;
    let ringY = -100;
    let targetX = -100;
    let targetY = -100;
    let animId;

    const moveRing = () => {
      ringX += (targetX - ringX) * 0.18;
      ringY += (targetY - ringY) * 0.18;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      animId = window.requestAnimationFrame(moveRing);
    };

    const handleMouseMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      dot.style.left = `${targetX}px`;
      dot.style.top = `${targetY}px`;
    };

    const interactive = 'a, button, input, select, textarea, .gallery-item, .menu-card';
    const handlePointerOver = (event) => {
      if (event.target.closest && event.target.closest(interactive)) {
        document.body.classList.add('cursor-hover');
      }
    };

    const handlePointerOut = (event) => {
      if (!event.relatedTarget || !event.relatedTarget.closest || !event.relatedTarget.closest(interactive)) {
        document.body.classList.remove('cursor-hover');
      }
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('pointerover', handlePointerOver);
    document.addEventListener('pointerout', handlePointerOut);
    animId = window.requestAnimationFrame(moveRing);

    return () => {
      document.body.classList.remove('custom-cursor');
      document.body.classList.remove('cursor-hover');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerout', handlePointerOut);
      if (animId) window.cancelAnimationFrame(animId);
    };
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const reveals = document.querySelectorAll('.reveal');
      reveals.forEach((el) => el.classList.add('is-visible'));
    }, 100);
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* SVG Sprite with all symbols */}
      <SvgSprite />

      {/* Skip link */}
      <a className="skip-link" href="#main-content">Skip to content</a>

      {/* Custom Cursor Ring & Dot */}
      <div className="cursor-dot" aria-hidden="true"></div>
      <div className="cursor-ring" aria-hidden="true"></div>

      {/* Scroll Progress Bar */}
      <div className="scroll-progress" aria-hidden="true">
        <span id="scrollProgress" style={{ width: `${scrollProgress}%` }}></span>
      </div>

      {/* Header / Navbar */}
      {!isAdminRoute && <Navbar />}

      {/* Main Content Pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/specialties" element={<SpecialtiesPage />} />
        <Route path="/birthday" element={<BirthdayPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/reservation" element={<ReservationPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superadmin/dashboard"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Footer */}
      {!isAdminRoute && <Footer />}

      {/* Back to Top Button */}
      <button
        className={`back-to-top ${showBackToTop ? 'is-visible' : ''}`}
        id="backToTop"
        type="button"
        aria-label="Back to top"
        onClick={scrollToTop}
      >
        <svg><use href="#icon-arrow-up"></use></svg>
      </button>

      {/* Floating Cart Button for MERN stack (shows when items are in cart) */}
      {!isAdminRoute && totalItems > 0 && (
        <button
          type="button"
          className="floating-cart-btn"
          onClick={() => setIsCartOpen(true)}
          aria-label="Open Cart"
        >
          <span className="floating-cart-badge">{totalItems}</span>
          <span>View Order</span>
        </button>
      )}

      {/* Admin Floating Badge if logged in as Admin */}
      {!isAdminRoute && isAdmin && (
        <Link
          to="/admin"
          className="nav-user-pill"
          style={{
            position: 'fixed',
            bottom: '25px',
            right: showBackToTop ? '80px' : '25px',
            zIndex: 1500,
            background: 'rgba(36, 19, 14, 0.95)',
            border: '1px solid var(--gold)',
            color: 'var(--gold)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.4)',
            cursor: 'pointer'
          }}
        >
          <span>Admin Panel ⚙</span>
        </Link>
      )}

      {/* Cart Drawer */}
      {!isAdminRoute && <CartDrawer />}

      {/* Toast Notification */}
      <Toast />
    </>
  );
}

export default App;
