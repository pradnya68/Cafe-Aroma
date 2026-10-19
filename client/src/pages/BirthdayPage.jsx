import React, { useState } from 'react';
import { Sparkles, Gift, Heart, Calendar, Clock, Star, HelpCircle, ChevronDown, Check } from 'lucide-react';
import BirthdayBlastSection from '../components/BirthdayBlastSection';

const BirthdayPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How do I redeem my complimentary birthday dessert?',
      a: 'Simply show valid government-issued photo ID (driver’s license, passport, Aadhaar, etc.) showing your birth date to our barista when dining in with an order of ₹400+. You will receive your choice of molten lava cake or signature tiramisu on the house!'
    },
    {
      q: 'Can we customize the text and design on the celebration cake?',
      a: 'Yes! When booking any of our birthday combo or VIP packages, you can specify your custom greeting message (up to 30 characters) during booking. Our pastry chefs will handwrite it in rich dark chocolate on a fondant plaque.'
    },
    {
      q: 'How far in advance should I reserve a birthday package?',
      a: 'For our VIP Lounge Experience and Group Feasts, we recommend booking at least 24 hours in advance so our baristas can reserve the best corner tables and prepare fresh floral arrangements and table fairy lights.'
    },
    {
      q: 'Are eggless or vegan cake options available?',
      a: 'Absolutely! All our signature chocolate truffle cakes and tiramisu recipes are available in 100% eggless options. Please mention your dietary preference in the booking notes.'
    },
    {
      q: 'Can I bring my own external decorations or balloons?',
      a: 'You are welcome to bring small table decor and balloons! However, our Fairy-Light Decor package already includes aesthetic balloon clusters, fairy-light table runners, and personalized welcome easel stands.'
    }
  ];

  return (
    <main className="flex-1 min-h-screen bg-cream/30 pt-24 pb-16">
      {/* Hero Intro Bar */}
      <div className="bg-espresso text-cream py-10 px-4 border-b border-dark-coffee">
        <div className="container max-w-5xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold/15 text-gold border border-gold/30 text-xs font-bold uppercase tracking-widest">
            <Sparkles size={14} />
            <span>Café Aroma Celebrations</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            Birthday Celebrations &amp; Surprise Offers
          </h1>
          <p className="text-cream/80 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Every birthday deserves artisanal treats, freshly roasted coffee aromas, and warm memories. Explore our handpicked birthday surprises below!
          </p>
        </div>
      </div>

      {/* 3-Second Gift Blast & Dynamic Active Offers */}
      <BirthdayBlastSection autoStart={true} />

      {/* Celebration Perks Featurettes */}
      <section className="py-16 bg-white border-y border-line">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="eyebrow eyebrow--light mb-2">The Café Aroma Difference</p>
            <h2 className="font-display text-3xl font-bold text-espresso">
              Why Celebrate With Us?
            </h2>
            <p className="text-ink-muted text-sm mt-2">
              From our specialty small-batch roasts to custom handcrafted pastries, we turn your birthday into a cherished sensory experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-cream/40 border border-line space-y-3">
              <div className="w-12 h-12 rounded-xl bg-espresso text-gold flex items-center justify-center font-display text-xl font-bold shadow-md">
                🎂
              </div>
              <h3 className="font-display text-xl font-bold text-espresso">Bespoke In-House Bakery</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Our artisanal cakes and pastries are baked fresh every morning using single-origin Belgian chocolate, Madagascar vanilla, and farm-fresh dairy.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cream/40 border border-line space-y-3">
              <div className="w-12 h-12 rounded-xl bg-espresso text-gold flex items-center justify-center font-display text-xl font-bold shadow-md">
                ☕
              </div>
              <h3 className="font-display text-xl font-bold text-espresso">Master Craft Coffees</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Enjoy velvety flat whites, aromatic pour-overs, and specialty cold brews expertly pulled by our passionate certified baristas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-cream/40 border border-line space-y-3">
              <div className="w-12 h-12 rounded-xl bg-espresso text-gold flex items-center justify-center font-display text-xl font-bold shadow-md">
                ✨
              </div>
              <h3 className="font-display text-xl font-bold text-espresso">Warm Ambient Vibe</h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Cozy leather seating, warm fairy-lights, and an intimate acoustic cafe playlist create the perfect backdrop for laughter and celebration photos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Birthday Celebration FAQs */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <p className="eyebrow eyebrow--light mb-2">Got Questions?</p>
          <h2 className="font-display text-3xl font-bold text-espresso">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-line overflow-hidden transition-shadow hover:shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-espresso text-sm hover:text-caramel transition"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle size={16} className="text-caramel shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-ink-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-ink-muted leading-relaxed border-t border-line/40 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default BirthdayPage;
