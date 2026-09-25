import React, { useEffect } from 'react';

const LightboxModal = ({ isOpen, currentIndex, items, onClose, onPrev, onNext }) => {
  useEffect(() => {
    if (!isOpen) {
      document.body.classList.remove('lightbox-open');
      return;
    }

    document.body.classList.add('lightbox-open');

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('lightbox-open');
    };
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || !items[currentIndex]) return null;

  const current = items[currentIndex];

  return (
    <div
      className={`lightbox ${isOpen ? 'is-open' : ''}`}
      id="lightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightboxTitle"
      aria-hidden={!isOpen}
    >
      <div className="lightbox__backdrop" onClick={onClose}></div>
      <div className="lightbox__panel">
        <button
          className="lightbox__close"
          id="lightboxClose"
          type="button"
          aria-label="Close image viewer"
          onClick={onClose}
        >
          <svg><use href="#icon-close"></use></svg>
        </button>
        <button
          className="lightbox__nav lightbox__nav--prev"
          id="lightboxPrev"
          type="button"
          aria-label="Previous image"
          onClick={onPrev}
        >
          <svg><use href="#icon-chevron-left"></use></svg>
        </button>
        <figure>
          <img id="lightboxImage" src={current.src} alt={current.title} />
          <figcaption>
            <span id="lightboxCaption">{current.caption}</span>
            <strong id="lightboxTitle">{current.title}</strong>
          </figcaption>
        </figure>
        <button
          className="lightbox__nav lightbox__nav--next"
          id="lightboxNext"
          type="button"
          aria-label="Next image"
          onClick={onNext}
        >
          <svg><use href="#icon-chevron-right"></use></svg>
        </button>
      </div>
    </div>
  );
};

export default LightboxModal;
