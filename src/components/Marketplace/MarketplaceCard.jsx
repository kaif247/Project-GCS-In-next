import React, { useContext, useMemo, useState } from 'react';
import Link from 'next/link';
import { LanguageContext } from '../../context/LanguageContext';

const formatPrice = (value, t) => {
  if (value === 0) return t('Free');
  return `PKR ${value.toLocaleString('en-PK')}`;
};

const MarketplaceCard = ({ product }) => {
  const { t } = useContext(LanguageContext);
  const images = useMemo(() => {
    const list = product.details?.images?.length ? product.details.images : [product.image];
    return list.filter(Boolean);
  }, [product.details?.images, product.image]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <Link href={`/marketplace/${product.id}`} className="marketplace-card-link">
      <article className="marketplace-card">
        <div className="marketplace-card__image-wrap">
          <img
            src={images[activeIndex]}
            alt={t(product.title)}
            className="marketplace-card__image"
          />
          {images.length > 1 && (
            <>
              <button
                type="button"
                className="marketplace-card__nav marketplace-card__nav--prev"
                onClick={handlePrev}
                aria-label={t('Previous image')}
              >
                ‹
              </button>
              <button
                type="button"
                className="marketplace-card__nav marketplace-card__nav--next"
                onClick={handleNext}
                aria-label={t('Next image')}
              >
                ›
              </button>
            </>
          )}
        </div>
        <div className="marketplace-card__body">
          <div className="marketplace-card__price">{formatPrice(product.price, t)}</div>
          <div className="marketplace-card__title">{t(product.title)}</div>
          <div className="marketplace-card__location">{t(product.location)}</div>
        </div>
      </article>
    </Link>
  );
};

export default MarketplaceCard;
