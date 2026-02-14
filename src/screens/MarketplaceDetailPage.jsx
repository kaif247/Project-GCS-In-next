import React, { useContext, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LanguageContext } from '../context/LanguageContext';
import { MarketplaceContext } from '../context/MarketplaceContext';
import { CartContext } from '../context/CartContext';

const formatPrice = (value, t) => {
  if (value === 0) return t('Free');
  if (value === undefined || value === null) return t('Price');
  return `PKR ${Number(value).toLocaleString('en-PK')}`;
};

const fallback = (value, t) => (value && value !== '' ? value : t('Not provided'));

const MarketplaceDetailPage = () => {
  const { t } = useContext(LanguageContext);
  const { products } = useContext(MarketplaceContext);
  const { addToCart } = useContext(CartContext);
  const router = useRouter();
  const { id } = router.query;
  const [status, setStatus] = useState('');

  const product = useMemo(() => {
    if (!id) return null;
    const numericId = Number(id);
    if (Number.isNaN(numericId)) return null;
    return products.find((item) => Number(item.id) === numericId) || null;
  }, [id, products]);

  if (!product) {
    return (
      <div className="marketplace-detail">
        <div className="marketplace-detail__empty">
          <h2>{t('Product not found')}</h2>
          <p>{t('The listing you are looking for is not available.')}</p>
          <Link className="marketplace-detail__back" href="/marketplace">
            {t('Back to Marketplace')}
          </Link>
        </div>
      </div>
    );
  }

  const details = product.details || {};

  const handleAddToCart = () => {
    addToCart(product);
    setStatus(t('Added to cart'));
    setTimeout(() => setStatus(''), 2000);
  };

  return (
    <div className="marketplace-detail">
      <div className="marketplace-detail__header">
        <Link className="marketplace-detail__back" href="/marketplace">
          {t('Back to Marketplace')}
        </Link>
        <Link className="marketplace-detail__cart-link" href="/cart">
          {t('View Cart')}
        </Link>
      </div>

      <div className="marketplace-detail__content">
        <div className="marketplace-detail__media">
          <img src={product.image} alt={product.title} />
          <div className="marketplace-detail__thumbs">
            {(details.images || [product.image]).slice(0, 4).map((src, index) => (
              <img key={`${src}-${index}`} src={src} alt={product.title} />
            ))}
          </div>
        </div>

        <div className="marketplace-detail__info">
          <div className="marketplace-detail__price">{formatPrice(product.price, t)}</div>
          <h1>{product.title}</h1>
          <div className="marketplace-detail__meta">
            <span>{t(product.category)}</span>
            <span>{t(product.location)}</span>
            <span>{t(details.condition || 'Condition')}</span>
          </div>
          <p className="marketplace-detail__description">
            {details.description ? details.description : t('Seller did not add a description.')}
          </p>

          <div className="marketplace-detail__actions">
            <button type="button" className="marketplace-detail__cta" onClick={handleAddToCart}>
              {t('Add to cart')}
            </button>
            <button type="button" className="marketplace-detail__cta-outline">
              {t('Message seller')}
            </button>
          </div>
          {status && <div className="marketplace-detail__status">{status}</div>}

          <div className="marketplace-detail__section">
            <h3>{t('Listing details')}</h3>
            <div className="marketplace-detail__grid">
              <div>
                <span>{t('Brand')}</span>
                <strong>{fallback(details.brand, t)}</strong>
              </div>
              <div>
                <span>{t('Model')}</span>
                <strong>{fallback(details.model, t)}</strong>
              </div>
              <div>
                <span>{t('Year')}</span>
                <strong>{fallback(details.year, t)}</strong>
              </div>
              <div>
                <span>{t('Availability')}</span>
                <strong>{fallback(details.availability, t)}</strong>
              </div>
              <div>
                <span>{t('Quantity')}</span>
                <strong>{fallback(details.quantity, t)}</strong>
              </div>
              <div>
                <span>{t('Delivery')}</span>
                <strong>{fallback(details.delivery, t)}</strong>
              </div>
              <div>
                <span>{t('Shipping')}</span>
                <strong>{fallback(details.shippingCost, t)}</strong>
              </div>
              <div>
                <span>{t('Negotiable')}</span>
                <strong>{details.negotiable ? t('Yes') : t('No')}</strong>
              </div>
              <div>
                <span>{t('Warranty')}</span>
                <strong>{fallback(details.warranty, t)}</strong>
              </div>
              <div>
                <span>{t('Tags')}</span>
                <strong>{fallback(details.tags, t)}</strong>
              </div>
            </div>
          </div>

          <div className="marketplace-detail__section">
            <h3>{t('Seller information')}</h3>
            <div className="marketplace-detail__seller">
              <div>
                <span>{t('Name')}</span>
                <strong>{fallback(details.contactName, t)}</strong>
              </div>
              <div>
                <span>{t('Email')}</span>
                <strong>{fallback(details.contactEmail, t)}</strong>
              </div>
              <div>
                <span>{t('Phone')}</span>
                <strong>{fallback(details.contactPhone, t)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceDetailPage;
