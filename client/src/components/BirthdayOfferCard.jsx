import React, { useRef } from 'react';
import { Sparkles, Calendar, Check, Gift, ArrowRight } from 'lucide-react';
import { playCardSelectPop } from '../utils/celebrationSound';

const BirthdayOfferCard = ({ offer, index, onView, onBook, onCardClickBurst }) => {
  const cardRef = useRef(null);

  const handleClick = (e) => {
    playCardSelectPop();
    if (onCardClickBurst && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const clickX = e.clientX || rect.left + rect.width / 2;
      const clickY = e.clientY || rect.top + rect.height / 2;
      onCardClickBurst(clickX, clickY);
    }
  };

  const isFree = offer.discountedPrice === 0;
  const hasDiscount = offer.originalPrice && offer.discountedPrice !== null && offer.discountedPrice < offer.originalPrice;

  return (
    <div
      ref={cardRef}
      className="bday-offer-card fly-in group"
      style={{ animationDelay: `${index * 120}ms` }}
      onClick={handleClick}
    >
      {/* Card Header Media */}
      <div className="relative h-52 sm:h-56 overflow-hidden bg-dark-coffee/20">
        <img
          src={offer.image || '/assets/pastry-breakfast.jpg'}
          alt={offer.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-coffee/80 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {offer.badge ? (
            <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-espresso/90 text-gold border border-gold/40 backdrop-blur-md shadow-md flex items-center gap-1.5">
              <Sparkles size={12} className="text-gold" />
              {offer.badge}
            </span>
          ) : <span />}

          {offer.discountPercentage && (
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-md ${
              isFree 
                ? 'bg-emerald-600 text-white animate-pulse' 
                : 'bg-caramel text-white border border-white/20'
            }`}>
              {offer.discountPercentage}
            </span>
          )}
        </div>

        {/* Category Pill on bottom image */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-widest uppercase bg-black/60 text-cream/90 backdrop-blur-sm border border-white/10">
            {offer.category}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="font-display text-xl font-bold text-espresso group-hover:text-caramel transition-colors line-clamp-2 mb-2">
            {offer.title}
          </h3>

          {/* Description */}
          <p className="text-ink-muted text-sm line-clamp-3 mb-4 leading-relaxed">
            {offer.description}
          </p>

          {/* Inclusions Highlights (up to 3) */}
          {offer.highlights && offer.highlights.length > 0 && (
            <ul className="mb-4 space-y-1.5">
              {offer.highlights.slice(0, 3).map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-espresso font-medium">
                  <span className="w-4 h-4 rounded-full bg-cream border border-caramel/30 flex items-center justify-center shrink-0 mt-0.5 text-caramel">
                    <Check size={10} strokeWidth={3} />
                  </span>
                  <span className="line-clamp-1">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pricing & Validity Section */}
        <div className="pt-4 border-t border-line/60">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              {isFree ? (
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl font-bold text-emerald-700">FREE</span>
                  {offer.originalPrice && (
                    <span className="text-xs text-ink-muted/70 line-through">₹{offer.originalPrice}</span>
                  )}
                </div>
              ) : offer.discountedPrice !== null ? (
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-2xl font-bold text-espresso">
                    ₹{offer.discountedPrice}
                  </span>
                  {hasDiscount && (
                    <span className="text-xs text-ink-muted/70 line-through">₹{offer.originalPrice}</span>
                  )}
                </div>
              ) : (
                <span className="text-sm font-bold text-espresso">Exclusive Reward</span>
              )}
            </div>

            {offer.specialReward && (
              <span className="text-[11px] font-semibold text-caramel flex items-center gap-1 text-right max-w-[140px] truncate" title={offer.specialReward}>
                <Gift size={12} className="shrink-0" />
                {offer.specialReward}
              </span>
            )}
          </div>

          {/* Validity snippet */}
          <div className="flex items-center gap-1.5 text-[11px] text-ink-muted mb-5">
            <Calendar size={12} className="shrink-0 text-caramel" />
            <span className="truncate">{offer.validity}</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onView(offer);
              }}
              className="w-full py-2.5 px-3 rounded-xl border border-line bg-cream/40 hover:bg-cream text-espresso text-xs font-bold transition shadow-sm hover:border-caramel flex items-center justify-center gap-1"
            >
              View Offer
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onBook(offer);
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-espresso hover:bg-caramel text-white text-xs font-bold transition shadow-md hover:shadow-lg flex items-center justify-center gap-1.5 group/btn"
            >
              <span>Book Now</span>
              <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BirthdayOfferCard;
