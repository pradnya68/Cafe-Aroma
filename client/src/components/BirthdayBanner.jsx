import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Gift, ArrowRight, PartyPopper, Check } from 'lucide-react';
import BirthdayBlastSection from './BirthdayBlastSection';

const BirthdayBanner = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenCelebration = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <section className="bday-banner-section" id="birthday-specials" aria-labelledby="bday-banner-title">
        <div className="bday-banner-pattern" aria-hidden="true" />
        <div className="bday-banner-glow bday-banner-glow--left" aria-hidden="true" />
        <div className="bday-banner-glow bday-banner-glow--right" aria-hidden="true" />

        <div className="container relative z-10">
          <div className="bday-banner-card">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Copy & CTA Column */}
              <div className="lg:col-span-7 space-y-5 text-white">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-bold uppercase tracking-widest shadow-sm">
                  <PartyPopper size={14} className="text-gold" />
                  <span>Exclusive Celebrations</span>
                </div>

                <h2 id="bday-banner-title" className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-white">
                  A Special Birthday Surprise <br />
                  <span className="text-gold italic font-normal">Awaits You!</span>
                </h2>

                <p className="text-cream/80 text-sm sm:text-base leading-relaxed max-w-xl">
                  Celebrating your birthday or planning a surprise for a loved one? Unlock complimentary handcrafted desserts, artisanal cake &amp; specialty coffee combos, and VIP party packages designed just for you.
                </p>

                {/* Highlights List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-cream/90 font-medium">
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>100% Free Birthday Dessert on order</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-cream/90 font-medium">
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>Artisan Cakes &amp; Pour-over Combos</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-cream/90 font-medium">
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>Warm Fairy-Light Table &amp; Balloons</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-cream/90 font-medium">
                    <span className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center shrink-0">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span>Personalized Birthday Celebration Music</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={handleOpenCelebration}
                    className="px-7 py-3.5 rounded-full bg-gold hover:bg-[#d8a86a] text-dark-coffee font-bold text-sm shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2.5 active:scale-95 group cursor-pointer"
                  >
                    <Gift size={18} className="transition-transform group-hover:rotate-12" />
                    <span>Surprise Me!</span>
                    <Sparkles size={16} className="text-dark-coffee animate-pulse" />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/birthday')}
                    className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-cream font-bold text-sm border border-gold/30 transition-all flex items-center gap-2"
                  >
                    <span>View All Offers</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>

              {/* Animated 3D Gift Box & Balloons Visual Column */}
              <div className="lg:col-span-5 relative flex items-center justify-center py-6">
                {/* Floating Balloons */}
                <div
                  className="bday-balloon w-12 h-16 bg-gradient-to-tr from-amber-600 to-yellow-300 text-yellow-500 -left-2 top-2"
                  style={{ animationDelay: '0s' }}
                >
                  <div className="bday-balloon-string" />
                </div>
                <div
                  className="bday-balloon w-14 h-18 bg-gradient-to-tr from-rose-700 to-red-400 text-red-500 right-2 top-4"
                  style={{ animationDelay: '1.4s' }}
                >
                  <div className="bday-balloon-string" />
                </div>
                <div
                  className="bday-balloon w-10 h-14 bg-gradient-to-tr from-orange-500 to-amber-200 text-amber-400 right-10 bottom-6"
                  style={{ animationDelay: '0.7s' }}
                >
                  <div className="bday-balloon-string" />
                </div>

                {/* 3D Birthday Gift Box - Clicking it also triggers the Surprise! */}
                <div
                  className="bday-giftbox-stage cursor-pointer group"
                  onClick={handleOpenCelebration}
                  title="Click to open your birthday surprise!"
                >
                  <div className="bday-giftbox-3d group-hover:scale-105">
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

                      {/* 3D Bow */}
                      <div className="bday-bow">
                        <div className="bday-bow-loop bday-bow-loop--left" />
                        <div className="bday-bow-loop bday-bow-loop--right" />
                        <div className="bday-bow-center" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating "Click to Open" Cue */}
                <div className="absolute -bottom-2 text-center pointer-events-none">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold text-gold bg-black/60 border border-gold/30 backdrop-blur-sm">
                    ✨ Click Gift to Unbox
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Full-Screen Interactive Celebration Modal (when launched from Home banner) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-dark-coffee/95 backdrop-blur-lg animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          {/* Top Sticky Close Bar */}
          <div className="sticky top-0 z-50 bg-dark-coffee/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-line/40">
            <div className="flex items-center gap-2">
              <span className="brand-mark text-gold">☕</span>
              <span className="font-display font-bold text-gold tracking-wide">Café Aroma Birthday Surprise</span>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-cream text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>✕ Close Experience</span>
            </button>
          </div>

          {/* Embedded 3-Second Gift Blast & Offers */}
          <BirthdayBlastSection autoStart={true} />
        </div>
      )}
    </>
  );
};

export default BirthdayBanner;
