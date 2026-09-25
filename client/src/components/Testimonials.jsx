import React, { useState, useEffect } from 'react';
import { testimonialAPI } from '../services/api';

const defaultQuotes = [
  {
    quote: 'Absolutely beautiful café. The coffee was incredible and the atmosphere was even better. I could have stayed all afternoon.',
    initials: 'RM',
    name: 'Rahul M.',
    role: 'Sunday regular',
  },
  {
    quote: 'One of my favourite places to spend a Sunday morning. The team remembers my order and the light is just perfect.',
    initials: 'PS',
    name: 'Priya S.',
    role: 'Neighbourhood guest',
  },
  {
    quote: 'The caramel latte is absolutely fantastic. You can taste the care in every single detail, from the beans to the last sip.',
    initials: 'AK',
    name: 'Aditya K.',
    role: 'Coffee enthusiast',
  },
  {
    quote: 'A rare café that feels polished without ever feeling precious. Great for a meeting, a book, or absolutely nothing at all.',
    initials: 'NG',
    name: 'Nisha G.',
    role: 'First-time guest',
  },
];

const Testimonials = () => {
  const [reviews, setReviews] = useState(defaultQuotes);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await testimonialAPI.getAll();
        if (res.data.success && res.data.data.length > 0) {
          setReviews(
            res.data.data.map((r) => ({
              quote: r.message,
              initials: r.initials || r.name.substring(0, 2).toUpperCase(),
              name: r.name,
              role: r.role || 'Guest',
            }))
          );
        }
      } catch (err) {
        console.error('Using default testimonials:', err);
      }
    };
    fetchReviews();
  }, []);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
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
            {reviews.map((rev, idx) => (
              <article
                key={idx}
                className={`testimonial-slide ${idx === activeIndex ? 'is-active' : ''}`}
                data-index={idx}
                aria-hidden={idx !== activeIndex}
              >
                <span className="quote-mark">“</span>
                <blockquote>{rev.quote}</blockquote>
                <div className="testimonial-author">
                  <span className="author-avatar">{rev.initials}</span>
                  <span>
                    <strong>{rev.name}</strong>
                    <small>{rev.role}</small>
                  </span>
                </div>
              </article>
            ))}
          </div>

          <div className="carousel-controls">
            <div className="carousel-dots" role="tablist" aria-label="Testimonial slides">
              {reviews.map((_, idx) => (
                <button
                  key={idx}
                  className={`carousel-dot ${idx === activeIndex ? 'is-active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={idx === activeIndex}
                  aria-label={`Show testimonial ${idx + 1}`}
                  onClick={() => setActiveIndex(idx)}
                ></button>
              ))}
            </div>

            <div className="carousel-arrows">
              <button
                className="round-button"
                type="button"
                id="testimonialPrev"
                aria-label="Previous testimonial"
                onClick={handlePrev}
              >
                <svg><use href="#icon-chevron-left"></use></svg>
              </button>
              <button
                className="round-button"
                type="button"
                id="testimonialNext"
                aria-label="Next testimonial"
                onClick={handleNext}
              >
                <svg><use href="#icon-chevron-right"></use></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
