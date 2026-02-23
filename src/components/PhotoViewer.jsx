import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './PhotoViewer.module.css';

const PhotoViewer = ({ open, photos = [], index = 0, onClose, onPrev, onNext }) => {
  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose?.();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onPrev?.();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        onNext?.();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose, onPrev, onNext]);

  if (!open || photos.length === 0 || typeof document === 'undefined') return null;

  return createPortal(
    <div className={styles['photo-viewer']} onClick={onClose}>
      <div
        className={styles['photo-viewer__content']}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles['photo-viewer__close']}
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {photos.length > 1 && (
          <button
            type="button"
            className={styles['photo-viewer__nav']}
            onClick={onPrev}
            aria-label="Previous photo"
          >
            &#8249;
          </button>
        )}
        <img src={photos[index]} alt="" className={styles['photo-viewer__image']} />
        {photos.length > 1 && (
          <button
            type="button"
            className={styles['photo-viewer__nav']}
            onClick={onNext}
            aria-label="Next photo"
          >
            &#8250;
          </button>
        )}
        {photos.length > 1 && (
          <div className={styles['photo-viewer__count']}>
            {index + 1} / {photos.length}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default PhotoViewer;
