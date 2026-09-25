import React, { useState } from 'react';

const galleryPhotos = [
  {
    src: '/assets/cafe-interior.jpg',
    className: 'gallery-item gallery-item--wide reveal',
    tag: '01 · The space',
    title: 'The morning light at Aroma',
    caption: 'Our sunlit coffee bar',
  },
  {
    src: '/assets/special-latte.jpg',
    className: 'gallery-item gallery-item--tall reveal reveal--delay-1',
    tag: '02 · The pour',
    title: 'A little sweetness',
    caption: 'Caramel cinnamon latte',
  },
  {
    src: '/assets/pastry-breakfast.jpg',
    className: 'gallery-item gallery-item--small reveal reveal--delay-2',
    tag: '03 · The bake',
    title: 'Baked this morning',
    caption: 'Fresh pastry counter',
  },
  {
    src: '/assets/barista-pour.jpg',
    className: 'gallery-item gallery-item--small reveal reveal--delay-3',
    tag: '04 · The craft',
    title: 'Made with intention',
    caption: 'The art of the pour',
  },
  {
    src: '/assets/coffee-beans.jpg',
    className: 'gallery-item gallery-item--wide gallery-item--bottom reveal',
    tag: '05 · The ritual',
    title: 'Before the first sip',
    caption: 'Small-batch roasted beans',
  },
  {
    src: '/assets/hero-cafe.jpg',
    className: 'gallery-item gallery-item--small gallery-item--bottom-right reveal reveal--delay-1',
    tag: '06 · The feeling',
    title: 'Take your time',
    caption: 'A table waiting for you',
  },
];

const Gallery = () => {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    document.body.classList.add('lightbox-open');
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.classList.remove('lightbox-open');
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === 0 ? galleryPhotos.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev === galleryPhotos.length - 1 ? 0 : prev + 1));
  };

  const currentPhoto = lightboxIndex !== null ? galleryPhotos[lightboxIndex] : null;

  return (
    <>
      <section className="section gallery-section" id="gallery" aria-labelledby="gallery-title">
        <div className="container">
          <div className="section-heading section-heading--split reveal">
            <div>
              <p className="eyebrow">A glimpse inside <span></span></p>
              <h2 id="gallery-title" className="section-title">
                Find your<br /><em>favourite corner.</em>
              </h2>
            </div>
            <p className="section-heading__description">
              Golden light, good company, and the quiet little details that make a place feel like yours.
            </p>
          </div>

          <div className="gallery-grid">
            {galleryPhotos.map((photo, idx) => (
              <button
                key={idx}
                className={photo.className}
                type="button"
                data-src={photo.src}
                data-title={photo.title}
                data-caption={photo.caption}
                aria-label={`View ${photo.title}`}
                onClick={() => openLightbox(idx)}
              >
                <img src={photo.src} alt={photo.title} loading="lazy" />
                <span className="gallery-item__overlay">
                  <small>{photo.tag}</small>
                  <strong>{photo.title}</strong>
                  <i>View <svg><use href="#icon-arrow"></use></svg></i>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && currentPhoto && (
        <div className="lightbox is-open" id="lightbox" role="dialog" aria-modal="true" aria-labelledby="lightboxTitle">
          <div className="lightbox__backdrop" onClick={closeLightbox}></div>
          <div className="lightbox__panel">
            <button className="lightbox__close" id="lightboxClose" type="button" aria-label="Close image viewer" onClick={closeLightbox}>
              <svg><use href="#icon-close"></use></svg>
            </button>
            <button className="lightbox__nav lightbox__nav--prev" id="lightboxPrev" type="button" aria-label="Previous image" onClick={handlePrev}>
              <svg><use href="#icon-chevron-left"></use></svg>
            </button>
            <figure>
              <img id="lightboxImage" src={currentPhoto.src} alt={currentPhoto.title} />
              <figcaption>
                <span id="lightboxCaption">{currentPhoto.caption}</span>
                <strong id="lightboxTitle">{currentPhoto.title}</strong>
              </figcaption>
            </figure>
            <button className="lightbox__nav lightbox__nav--next" id="lightboxNext" type="button" aria-label="Next image" onClick={handleNext}>
              <svg><use href="#icon-chevron-right"></use></svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Gallery;
