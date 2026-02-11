import React, { useMemo, useState, useEffect, useContext } from 'react';
import MarketplaceSidebar from '../components/Marketplace/MarketplaceSidebar';
import MarketplaceGrid from '../components/Marketplace/MarketplaceGrid';
import { marketplaceProducts } from '../data/marketplaceProducts';
import ToggleButton from '../components/ToggleButton';
import { LanguageContext } from '../context/LanguageContext';

const categories = [
  'Vehicles',
  'Property for rent',
  'Classifieds',
  'Clothing',
  'Electronics',
  'Entertainment',
  'Family',
  'Free stuff',
];

const MarketplacePage = () => {
  const { t } = useContext(LanguageContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Browse all');
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
      if (mobile) setIsSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return marketplaceProducts.filter((product) => {
      const matchesSearch = term === '' || product.title.toLowerCase().includes(term);
      const matchesCategory =
        activeCategory === 'Browse all' || product.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  return (
    <div className="marketplace-page">
      {isMobile && (
        <ToggleButton
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
          label={t('Toggle marketplace sidebar')}
        />
      )}
      <div className={`marketplace-sidebar-wrap ${isSidebarOpen ? 'open' : ''}`}>
        <MarketplaceSidebar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </div>
      <MarketplaceGrid products={filteredProducts} />
    </div>
  );
};

export default MarketplacePage;
