import React, { useContext } from 'react';
import MarketplaceCard from './MarketplaceCard';
import { LanguageContext } from '../../context/LanguageContext';

const MarketplaceGrid = ({ products }) => {
  const { t } = useContext(LanguageContext);
  return (
    <section className="marketplace-grid">
      <h2 className="marketplace-grid__title">{t("Today's picks")}</h2>
      <div className="marketplace-grid__list">
        {products.map((product) => (
          <MarketplaceCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default MarketplaceGrid;

