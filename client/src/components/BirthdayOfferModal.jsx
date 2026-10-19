import React, { useEffect } from 'react';
import { X, Sparkles, Check, Calendar, AlertCircle, ArrowRight, Gift } from 'lucide-react';

const BirthdayOfferModal = ({ offer, isOpen, onClose, onBook }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.classList.add('lightbox-open');
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.classList.remove('lightbox-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !offer) return null;

  const isFree = offer.discountedPrice === 0;
  const hasDiscount = offer.originalPrice && offer.discountedPrice !== null && offer.discountedPrice < offer.originalPrice;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-coffee/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="offer-modal-title"
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-line relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Hero Image */}
        <div className="relative h-60 sm:h-72 shrink-0 bg-dark-coffee overflow-hidden">
          <img
            src={offer.image || '/assets/pastry-breakfast.jpg'}
            alt={offer.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-coffee via-dark-coffee/40 to-transparent" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-dark-coffee/80 hover:bg-espresso text-cream flex items-center justify-center border border-white/20 transition-transform active:scale-95 shadow-lg z-10"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {offer.badge && (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-espresso text-gold border border-gold/40 shadow-lg flex items-center gap-1.5">
                <Sparkles size={13} className="text-gold" />
                {offer.badge}
              </span>
            )}
            {offer.discountPercentage && (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-caramel text-white shadow-lg">
                {offer.discountPercentage}
              </span>
            )}
          </div>

          {/* Title on Image overlay */}
          <div className="absolute bottom-5 left-6 right-6 text-white">
            <span className="text-[11px] font-bold uppercase tracking-widest text-gold block mb-1">
              Café Aroma Birthday Exclusive
            </span>
            <h2 id="offer-modal-title" className="font-display text-2xl sm:text-3xl font-bold leading-tight drop-shadow-md">
              {offer.title}
            </h2>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Price Bar */}
          <div className="p-4 rounded-2xl bg-cream/50 border border-line flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-ink-muted block mb-0.5">
                Special Birthday Pricing
              </span>
              <div className="flex items-baseline gap-2.5">
                {isFree ? (
                  <span className="font-display text-3xl font-bold text-emerald-700">100% FREE</span>
                ) : (
                  <span className="font-display text-3xl font-bold text-espresso">
                    ₹{offer.discountedPrice ?? offer.originalPrice}
                  </span>
                )}
                {hasDiscount && (
                  <span className="text-sm text-ink-muted line-through">
                    Standard Price: ₹{offer.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {offer.specialReward && (
              <div className="px-3.5 py-2 rounded-xl bg-gold/15 border border-gold/40 flex items-center gap-2 text-espresso text-xs font-semibold">
                <Gift size={16} className="text-caramel shrink-0" />
                <span>{offer.specialReward}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs uppercase font-bold tracking-widest text-ink-muted mb-2">About This Surprise</h3>
            <p className="text-espresso text-sm leading-relaxed">
              {offer.description}
            </p>
          </div>

          {/* Inclusions Highlights */}
          {offer.highlights && offer.highlights.length > 0 && (
            <div>
              <h3 className="text-xs uppercase font-bold tracking-widest text-ink-muted mb-3">Package Inclusions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {offer.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-cream/30 border border-line/60">
                    <span className="w-5 h-5 rounded-full bg-caramel/20 text-caramel flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className="text-xs font-semibold text-espresso">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validity & Terms */}
          <div className="space-y-3 pt-2 border-t border-line">
            <div className="flex items-start gap-2.5 text-xs text-espresso">
              <Calendar size={16} className="text-caramel shrink-0 mt-0.5" />
              <div>
                <strong className="block text-espresso">Validity & Timeline:</strong>
                <span className="text-ink-muted">{offer.validity}</span>
              </div>
            </div>

            {offer.terms && offer.terms.length > 0 && (
              <div className="flex items-start gap-2.5 text-xs text-espresso pt-2">
                <AlertCircle size={16} className="text-caramel shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-espresso">Important Terms & Conditions:</strong>
                  <ul className="list-disc pl-4 mt-1 space-y-1 text-ink-muted">
                    {offer.terms.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-5 sm:p-6 bg-cream/40 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-ink-muted hover:text-espresso transition"
          >
            Back to Offers
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onBook(offer);
            }}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-espresso hover:bg-caramel text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
          >
            <span>Book This Birthday Celebration</span>
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BirthdayOfferModal;
