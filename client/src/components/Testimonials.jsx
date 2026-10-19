import React, { useState, useEffect } from 'react';
import { testimonialAPI } from '../services/api';

const defaultQuotes = [
  {
    quote: 'Absolutely beautiful café. The coffee was incredible and the atmosphere was even better. I could have stayed all afternoon.',
    initials: 'RM',
    name: 'Rahul M.',
    role: 'Sunday regular',
    rating: 5,
  },
  {
    quote: 'One of my favourite places to spend a Sunday morning. The team remembers my order and the light is just perfect.',
    initials: 'PS',
    name: 'Priya S.',
    role: 'Neighbourhood guest',
    rating: 5,
  },
  {
    quote: 'The caramel latte is absolutely fantastic. You can taste the care in every single detail, from the beans to the last sip.',
    initials: 'AK',
    name: 'Aditya K.',
    role: 'Coffee enthusiast',
    rating: 5,
  },
  {
    quote: 'A rare café that feels polished without ever feeling precious. Great for a meeting, a book, or absolutely nothing at all.',
    initials: 'NG',
    name: 'Nisha G.',
    role: 'First-time guest',
    rating: 5,
  },
];

const Testimonials = () => {
  const [reviews, setReviews] = useState(defaultQuotes);
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isFading, setIsFading] = useState(false);

  // Fetch reviews from API with fallback to defaultQuotes
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await testimonialAPI.getAll();
        if (res.data.success && res.data.data.length > 0) {
          setReviews(
            res.data.data.map((r) => ({
              quote: r.message,
              initials: r.initials || (r.name ? r.name.substring(0, 2).toUpperCase() : 'CA'),
              name: r.name || 'Café Guest',
              role: r.role || 'Guest',
              rating: r.rating || 5,
            }))
          );
        }
      } catch (err) {
        console.error('Using default testimonials:', err);
      }
    };
    fetchReviews();
  }, []);

  const currentReview = reviews[activeIndex] || reviews[0] || defaultQuotes[0];

  // Typewriter effect + 2-second pause + automatic slide to next review
  useEffect(() => {
    if (!currentReview || !currentReview.quote) return;

    const fullText = currentReview.quote;
    let charIndex = 0;
    setDisplayedText('');
    setIsFading(false);

    let typeInterval = null;
    let pauseTimeout = null;
    let fadeTimeout = null;

    // Type character by character in real-time
    typeInterval = setInterval(() => {
      charIndex++;
      setDisplayedText(fullText.slice(0, charIndex));

      if (charIndex >= fullText.length) {
        clearInterval(typeInterval);

        // Pause 2 seconds after review is completely typed
        pauseTimeout = setTimeout(() => {
          setIsFading(true);

          // Smooth transition to next review
          fadeTimeout = setTimeout(() => {
            setActiveIndex((prev) => (prev + 1) % reviews.length);
          }, 350);
        }, 2000);
      }
    }, 28);

    // Lifecycle cleanup
    return () => {
      if (typeInterval) clearInterval(typeInterval);
      if (pauseTimeout) clearTimeout(pauseTimeout);
      if (fadeTimeout) clearTimeout(fadeTimeout);
    };
  }, [activeIndex, reviews]);

  const handleDotClick = (idx) => {
    if (idx === activeIndex) return;
    setIsFading(true);
    setTimeout(() => {
      setActiveIndex(idx);
    }, 200);
  };

  return (
    <section className="section testimonials-section" id="testimonials" aria-labelledby="testimonials-title">
      <div className="container testimonials-layout">
        <div className="testimonials-copy reveal reveal--left">
          <p className="eyebrow">Kind words <span></span></p>
          <h2 id="testimonials-title" className="section-title">What our<br /><em>guests say.</em></h2>
          <p>There is nothing we love more than making a small part of someone's day feel special.</p>
          <div className="testimonial-rating">
            <span>4.9</span>
            <span className="stars">★★★★★</span>
            <small>average guest rating</small>
          </div>
        </div>

        <div className="testimonial-carousel reveal reveal--right" id="testimonialCarousel">
          <div className="testimonial-viewport" aria-live="polite">
            <article className={`testimonial-card ${isFading ? 'is-fading' : 'is-active'}`}>
              <div className="testimonial-card-header">
                <span className="quote-mark" aria-hidden="true">“</span>
                <div
                  className="testimonial-card-stars"
                  aria-label={`${currentReview.rating || 5} out of 5 stars`}
                >
                  {[...Array(currentReview.rating || 5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
              </div>

              {/* Zero-shift quote area: invisible sizer reserves exact space */}
              <div className="testimonial-quote-box">
                <p className="testimonial-quote-sizer" aria-hidden="true">
                  {currentReview.quote}
                </p>
                <blockquote className="testimonial-quote-typed">
                  {displayedText}
                  <span className="typewriter-cursor" aria-hidden="true">|</span>
                </blockquote>
              </div>

              <div className="testimonial-author">
                <span className="author-avatar">{currentReview.initials}</span>
                <div className="author-meta">
                  <strong>{currentReview.name}</strong>
                  <small>{currentReview.role}</small>
                </div>
              </div>
            </article>
          </div>

          {/* Navigation Dots Only (Arrows Removed) */}
          <div className="carousel-controls carousel-controls--center">
            <div className="carousel-dots" role="tablist" aria-label="Testimonial slides">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  className={`carousel-dot ${idx === activeIndex ? 'is-active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={idx === activeIndex}
                  aria-label={`Show testimonial ${idx + 1}`}
                  onClick={() => handleDotClick(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
