import React, { createContext, useCallback, useMemo, useState } from 'react';
import { marketplaceProducts } from '../data/marketplaceProducts';

export const MarketplaceContext = createContext({
  products: [],
  addProduct: () => {},
});

export const MarketplaceProvider = ({ children }) => {
  const [products, setProducts] = useState(marketplaceProducts);

  const addProduct = useCallback((product) => {
    setProducts((prev) => [product, ...prev]);
  }, []);

  const value = useMemo(
    () => ({
      products,
      addProduct,
    }),
    [products, addProduct]
  );

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
};
