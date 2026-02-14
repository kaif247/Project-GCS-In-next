import React, { useContext, useMemo } from 'react';
import Link from 'next/link';
import { CartContext } from '../context/CartContext';
import { LanguageContext } from '../context/LanguageContext';

const formatPrice = (value, t) => {
  if (value === 0) return t('Free');
  return `PKR ${Number(value).toLocaleString('en-PK')}`;
};

const CartPage = () => {
  const { t } = useContext(LanguageContext);
  const { items, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);

  const total = useMemo(
    () =>
      items.reduce((sum, item) => sum + Number(item.product.price || 0) * item.quantity, 0),
    [items]
  );

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-page__empty">
          <h2>{t('Your cart is empty')}</h2>
          <p>{t('Browse Marketplace to add products.')}</p>
          <Link className="cart-page__back" href="/marketplace">
            {t('Go to Marketplace')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page__header">
        <div>
          <h1>{t('Cart')}</h1>
          <p>{t('Review your items before checkout.')}</p>
        </div>
        <button type="button" className="cart-page__clear" onClick={clearCart}>
          {t('Clear cart')}
        </button>
      </div>

      <div className="cart-page__content">
        <div className="cart-list">
          {items.map((item) => (
            <div key={item.product.id} className="cart-item">
              <img src={item.product.image} alt={item.product.title} />
              <div className="cart-item__info">
                <h3>{item.product.title}</h3>
                <span>{formatPrice(item.product.price, t)}</span>
                <span className="cart-item__location">{item.product.location}</span>
              </div>
              <div className="cart-item__quantity">
                <label htmlFor={`qty-${item.product.id}`}>{t('Qty')}</label>
                <input
                  id={`qty-${item.product.id}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(event) =>
                    updateQuantity(item.product.id, Math.max(1, Number(event.target.value)))
                  }
                />
              </div>
              <div className="cart-item__total">
                {formatPrice(item.product.price * item.quantity, t)}
              </div>
              <button
                type="button"
                className="cart-item__remove"
                onClick={() => removeFromCart(item.product.id)}
              >
                {t('Remove')}
              </button>
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>{t('Order summary')}</h2>
          <div className="cart-summary__row">
            <span>{t('Subtotal')}</span>
            <strong>{formatPrice(total, t)}</strong>
          </div>
          <div className="cart-summary__row">
            <span>{t('Shipping')}</span>
            <strong>{t('Calculated at checkout')}</strong>
          </div>
          <div className="cart-summary__row cart-summary__total">
            <span>{t('Total')}</span>
            <strong>{formatPrice(total, t)}</strong>
          </div>
          <button type="button" className="cart-summary__cta">
            {t('Proceed to checkout')}
          </button>
          <Link className="cart-summary__back" href="/marketplace">
            {t('Continue shopping')}
          </Link>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
