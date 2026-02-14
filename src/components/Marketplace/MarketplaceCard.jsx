import React, { useContext } from 'react';
import Link from 'next/link';
import { LanguageContext } from '../../context/LanguageContext';

const formatPrice = (value, t) => {
  if (value === 0) return t('Free');
  return `PKR ${value.toLocaleString('en-PK')}`;
};

const MarketplaceCard = ({ product }) => {
  const { t } = useContext(LanguageContext);
  return (
    <Link href={`/marketplace/${product.id}`} className="marketplace-card-link">
      <article className="marketplace-card">
        <div className="marketplace-card__image-wrap">
          <img src={product.image} alt={t(product.title)} className="marketplace-card__image" />
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
