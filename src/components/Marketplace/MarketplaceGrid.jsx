import React from 'react';
import MarketplaceCard from './MarketplaceCard';

const MarketplaceGrid = ({ products }) => {
  return (
    <section className="marketplace-grid">
      <h2 className="marketplace-grid__title">Today&apos;s picks</h2>
      <div className="marketplace-grid__list">
        {products.map((product) => (
          <MarketplaceCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default MarketplaceGrid;
