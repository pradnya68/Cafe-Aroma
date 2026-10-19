import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Volume2, VolumeX, FastForward, RotateCcw, Gift, Calendar, ArrowRight, PartyPopper } from 'lucide-react';
import { birthdayOfferAPI } from '../services/api';
import BirthdayOfferCard from './BirthdayOfferCard';
import BirthdayOfferModal from './BirthdayOfferModal';
import BirthdayBookingModal from './BirthdayBookingModal';
import { createCelebrationConfetti } from '../utils/confetti';
import {
  playTickSound,
  playCelebrationFanfare,
  setSoundMuted,
  getSoundMuted,
} from '../utils/celebrationSound';

const BirthdayBlastSection = ({ autoStart = true, onOffersLoaded }) => {
  const [countdown, setCountdown] = useState(3);
  const [isBursting, setIsBursting] = useState(false);
  const [hasExploded, setHasExploded] = useState(false);
  const [isOffersRevealed, setIsOffersRevealed] = useState(false);
  const [isMuted, setIsMutedState] = useState(getSoundMuted());
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modals state
  const [viewOffer, setViewOffer] = useState(null);
  const [bookOffer, setBookOffer] = useState(null);

  // Floating burst elements
  const [floatingItems, setFloatingItems] = useState([]);

  // Canvas ref for confetti
  const canvasRef = useRef(null);
  const blastSectionRef = useRef(null);

  // Check accessibility reduced-motion
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // 1. Fetch dynamic active offers from backend database
  useEffect(() => {
    let isMounted = true;
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const res = await birthdayOfferAPI.getAll(false); // false = active only
        if (res.data?.success && isMounted) {
          setOffers(res.data.data || []);
          if (onOffersLoaded) onOffersLoaded(res.data.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch birthday offers:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchOffers();
    return () => { isMounted = false; };
  }, [onOffersLoaded]);

  // 2. Countdown Timer logic
  useEffect(() => {
    if (!autoStart || prefersReducedMotion) {
      // Instant reveal for reduced motion
      triggerExplosion(true);
      return;
    }

    let timer = null;
    if (countdown > 0) {
      playTickSound();
      if (countdown === 1) {
        setIsBursting(true);
      }
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && !hasExploded) {
      triggerExplosion(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, autoStart, prefersReducedMotion]);

  // Trigger explosion
  const triggerExplosion = (instant = false) => {
    setCountdown(0);
    setIsBursting(false);
    setHasExploded(true);

    if (!instant && !isMuted) {
      playCelebrationFanfare();
    }

    // Launch Confetti on Canvas
    if (canvasRef.current && !prefersReducedMotion) {
      const rect = canvasRef.current.getBoundingClientRect();
      createCelebrationConfetti(canvasRef.current, {
        count: 140,
        originX: rect.width / 2,
        originY: rect.height / 2 - 20,
      });
    }

    // Generate floating celebratory emojis
    if (!prefersReducedMotion && !instant) {
      const symbols = ['🎂', '☕', '✨', '🎁', '🧁', '🎉', '🎈', '🍾'];
      const items = symbols.map((emoji, idx) => {
        const angle = (idx / symbols.length) * (Math.PI * 2);
        const distance = 120 + Math.random() * 140;
        const tx = `${Math.cos(angle) * distance}px`;
        const ty = `${Math.sin(angle) * distance - 80}px`;
        const rot = `${(Math.random() - 0.5) * 60}deg`;
        return { emoji, tx, ty, rot, id: idx };
      });
      setFloatingItems(items);
    }

    // Reveal offers
    setTimeout(() => {
      setIsOffersRevealed(true);
    }, instant ? 100 : 700);
  };

  // Skip animation handler
  const handleSkipAnimation = () => {
    triggerExplosion(true);
  };

  // Replay animation handler
  const handleReplayAnimation = () => {
    setHasExploded(false);
    setIsBursting(false);
    setIsOffersRevealed(false);
    setFloatingItems([]);
    setCountdown(3);
  };

  // Toggle sound
  const handleToggleSound = () => {
    const nextMuted = !isMuted;
    setIsMutedState(nextMuted);
    setSoundMuted(nextMuted);
    if (!nextMuted) {
      playTickSound();
    }
  };

  // Trigger mini confetti burst on card click
  const handleCardClickBurst = (clientX, clientY) => {
    if (canvasRef.current && !prefersReducedMotion) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      createCelebrationConfetti(canvasRef.current, {
        count: 35,
        isMini: true,
        originX: x,
        originY: y,
      });
    }
  };

  // Filter offers by category
  const categories = [
    { id: 'all', label: 'All Specials' },
    { id: 'combo', label: 'Cake & Coffee Combos' },
    { id: 'dessert', label: 'Complimentary Desserts' },
    { id: 'package', label: 'VIP Packages' },
    { id: 'group', label: 'Group Feasts' },
    { id: 'decor', label: 'Decor & Celebrations' },
  ];

  const filteredOffers = categoryFilter === 'all'
    ? offers
    : offers.filter((o) => o.category === categoryFilter);

  return (
    <section
      ref={blastSectionRef}
      className="relative min-h-[700px] py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-dark-coffee via-[#1a0e0a] to-cream/20 overflow-hidden"
      id="birthday-celebration-section"
    >
      {/* Background Ambience & Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(#c99a5b18_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="bday-banner-glow bday-banner-glow--left" />
      <div className="bday-banner-glow bday-banner-glow--right" />

      {/* Floating Canvas for Confetti */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
      />

      {/* Top Floating Controls Bar */}
      <div className="relative max-w-7xl mx-auto flex items-center justify-between gap-4 mb-8 z-40">
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-espresso text-gold border border-gold/40 flex items-center gap-2 shadow-lg">
            <PartyPopper size={14} className="text-gold" />
            <span>Birthday Experience</span>
          </span>
          {prefersReducedMotion && (
            <span className="text-[11px] text-cream/70 italic hidden sm:inline">
              (Reduced-motion active)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="px-3.5 py-2 rounded-xl bg-espresso/80 hover:bg-espresso text-cream text-xs font-semibold border border-line/40 backdrop-blur-md transition flex items-center gap-2 shadow-md hover:border-gold/60"
            title={isMuted ? 'Unmute Celebration Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX size={15} className="text-ink-muted" /> : <Volume2 size={15} className="text-gold animate-pulse" />}
            <span className="hidden sm:inline">{isMuted ? 'Sound Muted' : 'Sound On'}</span>
          </button>

          {/* Skip Animation or Replay */}
          {!hasExploded ? (
            <button
              type="button"
              onClick={handleSkipAnimation}
              className="px-4 py-2 rounded-xl bg-gold hover:bg-[#d8a86a] text-dark-coffee text-xs font-bold transition shadow-md flex items-center gap-1.5"
            >
              <span>Skip Animation</span>
              <FastForward size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReplayAnimation}
              className="px-4 py-2 rounded-xl bg-cream/15 hover:bg-cream/25 text-cream text-xs font-bold border border-gold/30 transition flex items-center gap-1.5 backdrop-blur-md"
            >
              <RotateCcw size={14} />
              <span>Replay Blast</span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3-SECOND GIFT BLAST ANIMATION STAGE                      */}
      {/* ======================================================== */}
      {!hasExploded && (
        <div className="relative max-w-2xl mx-auto py-12 text-center z-20 animate-fade-in">
          {/* Headline Message */}
          <p className="text-gold text-xs font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
            <Sparkles size={14} />
            <span>Café Aroma Birthday Surprise</span>
            <Sparkles size={14} />
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-lg">
            A Special Birthday Surprise Awaits You!
          </h2>

          {/* Countdown Ring */}
          <div className="bday-countdown-ring" aria-live="polite">
            <span className="bday-countdown-number">{countdown}</span>
          </div>

          <p className="text-sm text-cream/80 max-w-md mx-auto mb-10">
            Hold on tight while we unwrap your personalized birthday offers, handcrafted desserts, and VIP celebration deals...
          </p>

          {/* 3D Gift Box Stage with Ribbons & Balloons */}
          <div className="relative py-6">
            {/* Balloons on left and right */}
            <div
              className="bday-balloon w-12 h-16 bg-gradient-to-tr from-amber-600 to-yellow-300 text-yellow-400 -left-6 top-0"
              style={{ animationDelay: '0s' }}
            >
              <div className="bday-balloon-string" />
            </div>
            <div
              className="bday-balloon w-14 h-18 bg-gradient-to-tr from-red-700 to-rose-400 text-rose-500 -right-8 top-6"
              style={{ animationDelay: '1.2s' }}
            >
              <div className="bday-balloon-string" />
            </div>

            {/* Center 3D Gift Box */}
            <div className="bday-giftbox-stage">
              <div className={`bday-giftbox-3d ${isBursting ? 'is-bursting' : ''}`}>
                <div className="bday-box-face bday-box-face--front" />
                <div className="bday-box-face bday-box-face--back" />
                <div className="bday-box-face bday-box-face--left" />
                <div className="bday-box-face bday-box-face--right" />
                <div className="bday-box-face bday-box-face--bottom" />

                {/* 3D Lid */}
                <div className="bday-box-lid">
                  <div className="bday-lid-top" />
                  <div className="bday-lid-front" />
                  <div className="bday-lid-left" />
                  <div className="bday-lid-right" />

                  {/* 3D Ribbon Bow */}
                  <div className="bday-bow">
                    <div className="bday-bow-loop bday-bow-loop--left" />
                    <div className="bday-bow-loop bday-bow-loop--right" />
                    <div className="bday-bow-center" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* POST-BLAST REVEAL: DYNAMIC OFFERS & CELEBRATION GRID     */}
      {/* ======================================================== */}
      {hasExploded && (
        <div className="relative max-w-7xl mx-auto z-20">
          {/* Shockwave effect */}
          <div className="bday-shockwave" />

          {/* Floating celebratory emojis */}
          {floatingItems.map((item) => (
            <div
              key={item.id}
              className="bday-floating-item"
              style={{
                top: '120px',
                left: '50%',
                '--tx': item.tx,
                '--ty': item.ty,
                '--rot': item.rot,
              }}
            >
              {item.emoji}
            </div>
          ))}

          {/* Post-blast Celebration Banner */}
          <div className="text-center mb-10 animate-fade-in">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles size={14} /> Happy Birthday From All of Us!
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3">
              Your Exclusive Birthday Celebration Offers
            </h2>
            <p className="text-cream/80 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Handpicked celebratory packages, complimentary desserts, and artisanal coffee pairings curated specially for your unforgettable day.
            </p>

            {/* Category Filter Pills */}
            {offers.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      categoryFilter === cat.id
                        ? 'bg-gold text-dark-coffee shadow-lg scale-105'
                        : 'bg-white/10 text-cream/80 hover:bg-white/20 hover:text-white border border-white/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic Offers Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-white/10 border border-white/15" />
              ))}
            </div>
          ) : filteredOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredOffers.map((offer, idx) => (
                <BirthdayOfferCard
                  key={offer._id || idx}
                  offer={offer}
                  index={idx}
                  onView={(item) => setViewOffer(item)}
                  onBook={(item) => setBookOffer(item)}
                  onCardClickBurst={handleCardClickBurst}
                />
              ))}
            </div>
          ) : (
            /* Beautiful Empty State as requested in Requirement 3:
               "If there are no active offers, show a beautiful empty state instead of fake promotions." */
            <div className="max-w-md mx-auto text-center py-16 px-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 shadow-2xl text-cream animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-gold/20 border border-gold/40 text-gold flex items-center justify-center mx-auto mb-5 shadow-inner">
                <Gift size={36} />
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                Fresh Birthday Treats Coming Soon!
              </h3>
              <p className="text-sm text-cream/75 leading-relaxed mb-6">
                Our pastry chefs and master baristas are currently curating the next seasonal collection of birthday surprises. Check back soon, or connect with our concierge to arrange a tailored private celebration.
              </p>
              <button
                type="button"
                onClick={() => setBookOffer({ title: 'Custom Birthday Celebration Experience', discountedPrice: null, originalPrice: null })}
                className="w-full py-3 px-5 rounded-xl bg-espresso hover:bg-caramel text-white text-xs font-bold border border-gold/40 shadow-lg transition flex items-center justify-center gap-2"
              >
                <span>Plan a Custom Celebration Table</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Details View Modal */}
      <BirthdayOfferModal
        offer={viewOffer}
        isOpen={Boolean(viewOffer)}
        onClose={() => setViewOffer(null)}
        onBook={(item) => {
          setViewOffer(null);
          setBookOffer(item);
        }}
      />

      {/* Booking Form Modal */}
      <BirthdayBookingModal
        offer={bookOffer}
        isOpen={Boolean(bookOffer)}
        onClose={() => setBookOffer(null)}
      />
    </section>
  );
};

export default BirthdayBlastSection;
