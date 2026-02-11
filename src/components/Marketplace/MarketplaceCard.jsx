import React from 'react';

const formatPrice = (value) => {
  if (value === 0) return 'Free';
  return `PKR ${value.toLocaleString('en-PK')}`;
};

const MarketplaceCard = ({ product }) => {
  return (
    <article className="marketplace-card">
      <div className="marketplace-card__image-wrap">
        <img src={product.image} alt={product.title} className="marketplace-card__image" />
      </div>
      <div className="marketplace-card__body">
        <div className="marketplace-card__price">{formatPrice(product.price)}</div>
        <div className="marketplace-card__title">{product.title}</div>
        <div className="marketplace-card__location">{product.location}</div>
      </div>
    </article>
  );
};

export default MarketplaceCard;
