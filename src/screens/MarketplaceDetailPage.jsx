import React, { useContext, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LanguageContext } from '../context/LanguageContext';
import { MarketplaceContext } from '../context/MarketplaceContext';
import { CartContext } from '../context/CartContext';
import MarketplaceChatWidget from '../components/Marketplace/MarketplaceChatWidget';

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
  const [activeImage, setActiveImage] = useState('');
  const [zoom, setZoom] = useState({ visible: false, x: 50, y: 50 });
  const [chatOpen, setChatOpen] = useState(false);

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

  const galleryImages = useMemo(() => {
    const list = details.images && details.images.length ? details.images : [product.image];
    return list.filter(Boolean);
  }, [details.images, product.image]);

  const mainIndex = Math.max(0, galleryImages.findIndex((img) => img === activeImage));
  const mainImage = activeImage || galleryImages[0] || product.image;

  const handleAddToCart = () => {
    addToCart(product);
    setStatus(t('Added to cart'));
    setTimeout(() => setStatus(''), 2000);
  };

  const handleZoomMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    const safeX = Math.max(0, Math.min(100, x));
    const safeY = Math.max(0, Math.min(100, y));
    setZoom({ visible: true, x: safeX, y: safeY });
  };

  const handleZoomLeave = () => {
    setZoom((prev) => ({ ...prev, visible: false }));
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
          <div
            className="marketplace-detail__main-image"
            onMouseMove={handleZoomMove}
            onMouseLeave={handleZoomLeave}
          >
            <img src={mainImage} alt={product.title} />
            <div
              className={`marketplace-detail__zoom-lens ${zoom.visible ? 'is-visible' : ''}`}
              style={{
                backgroundImage: `url(${mainImage})`,
                backgroundPosition: `${zoom.x}% ${zoom.y}%`,
              }}
            />
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  className="marketplace-detail__nav marketplace-detail__nav--prev"
                  onClick={() => {
                    const nextIndex = (mainIndex - 1 + galleryImages.length) % galleryImages.length;
                    setActiveImage(galleryImages[nextIndex]);
                  }}
                  aria-label={t('Previous image')}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="marketplace-detail__nav marketplace-detail__nav--next"
                  onClick={() => {
                    const nextIndex = (mainIndex + 1) % galleryImages.length;
                    setActiveImage(galleryImages[nextIndex]);
                  }}
                  aria-label={t('Next image')}
                >
                  ›
                </button>
              </>
            )}
          </div>
          <div className="marketplace-detail__thumbs">
            {galleryImages.map((src, index) => (
              <button
                type="button"
                key={`${src}-${index}`}
                className={`marketplace-detail__thumb ${
                  mainImage === src ? 'is-active' : ''
                }`}
                onClick={() => setActiveImage(src)}
              >
                <img src={src} alt={product.title} />
              </button>
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
            <button
              type="button"
              className="marketplace-detail__cta-outline"
              onClick={() => setChatOpen(true)}
            >
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

      <button
        type="button"
        className="marketplace-chat-fab"
        onClick={() => setChatOpen(true)}
        aria-label={t('Contact seller')}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <path
            d="M6 18l-2.5 2.5V6a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H9l-3 2z"
            fill="currentColor"
          />
        </svg>
      </button>

      <MarketplaceChatWidget
        product={product}
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </div>
  );
};

export default MarketplaceDetailPage;
