import React, { useContext, useMemo, useState } from 'react';
import Link from 'next/link';
import { CartContext } from '../context/CartContext';
import { LanguageContext } from '../context/LanguageContext';

const formatPrice = (value, t) => {
  if (value === 0) return t('Free');
  return `PKR ${Number(value).toLocaleString('en-PK')}`;
};

const CheckoutPage = () => {
  const { t } = useContext(LanguageContext);
  const { items, updateQuantity, clearCart } = useContext(CartContext);
  const [deliveryNote, setDeliveryNote] = useState('');
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    city: '',
    area: '',
    street: '',
    postalCode: '',
  });
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => sum + Number(item.product.price || 0) * item.quantity, 0),
    [items]
  );

  const shippingFee = deliveryMethod === 'express' ? 650 : deliveryMethod === 'pickup' ? 0 : 250;
  const total = subtotal + shippingFee;

  const handleChange = (field) => (event) => {
    setAddress((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handlePlaceOrder = () => {
    const required = ['fullName', 'phone', 'city', 'area', 'street'];
    const missing = required.filter((key) => !address[key].trim());
    if (items.length === 0) {
      setStatus({ type: 'error', message: t('Your cart is empty.') });
      return;
    }
    if (missing.length > 0) {
      setStatus({ type: 'error', message: t('Please fill in your delivery details.') });
      return;
    }
    setStatus({ type: 'success', message: t('Order placed! We will confirm shortly.') });
    clearCart();
  };

  return (
    <div className="checkout-page">
      <header className="checkout-page__header">
        <div>
          <h1>{t('Checkout')}</h1>
          <p>{t('Confirm delivery details, payment method, and item quantities.')}</p>
        </div>
        <Link className="checkout-page__back" href="/cart">
          {t('Back to cart')}
        </Link>
      </header>

      <div className="checkout-page__content">
        <div className="checkout-main">
          <section className="checkout-panel">
            <h2>{t('Items in your order')}</h2>
            {items.map((item) => (
              <div key={item.product.id} className="checkout-item">
                <img src={item.product.image} alt={item.product.title} />
                <div className="checkout-item__info">
                  <h3>{item.product.title}</h3>
                  <span>{formatPrice(item.product.price, t)}</span>
                  <span className="checkout-item__meta">{item.product.location}</span>
                  <span className="checkout-item__meta">
                    {t('Delivery')}: {item.product.delivery || t('Seller pickup')}
                  </span>
                </div>
                <div className="checkout-item__qty">
                  <label htmlFor={`checkout-qty-${item.product.id}`}>{t('Qty')}</label>
                  <input
                    id={`checkout-qty-${item.product.id}`}
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) =>
                      updateQuantity(item.product.id, Math.max(1, Number(event.target.value)))
                    }
                  />
                </div>
                <div className="checkout-item__total">
                  {formatPrice(item.product.price * item.quantity, t)}
                </div>
              </div>
            ))}
          </section>

          <section className="checkout-panel">
            <h2>{t('Delivery address')}</h2>
            <div className="checkout-form__grid">
              <div className="checkout-form__group">
                <label htmlFor="checkout-name">{t('Full name')} *</label>
                <input
                  id="checkout-name"
                  value={address.fullName}
                  onChange={handleChange('fullName')}
                  placeholder={t('Enter full name')}
                />
              </div>
              <div className="checkout-form__group">
                <label htmlFor="checkout-phone">{t('Phone number')} *</label>
                <input
                  id="checkout-phone"
                  value={address.phone}
                  onChange={handleChange('phone')}
                  placeholder={t('03XX-XXXXXXX')}
                />
              </div>
              <div className="checkout-form__group">
                <label htmlFor="checkout-city">{t('City')} *</label>
                <input
                  id="checkout-city"
                  value={address.city}
                  onChange={handleChange('city')}
                  placeholder={t('City')}
                />
              </div>
              <div className="checkout-form__group">
                <label htmlFor="checkout-area">{t('Area')} *</label>
                <input
                  id="checkout-area"
                  value={address.area}
                  onChange={handleChange('area')}
                  placeholder={t('Area or sector')}
                />
              </div>
              <div className="checkout-form__group checkout-form__group--full">
                <label htmlFor="checkout-street">{t('Street / House / Landmark')} *</label>
                <input
                  id="checkout-street"
                  value={address.street}
                  onChange={handleChange('street')}
                  placeholder={t('Street, house, and landmark details')}
                />
              </div>
              <div className="checkout-form__group">
                <label htmlFor="checkout-postal">{t('Postal code')}</label>
                <input
                  id="checkout-postal"
                  value={address.postalCode}
                  onChange={handleChange('postalCode')}
                  placeholder={t('Optional')}
                />
              </div>
              <div className="checkout-form__group checkout-form__group--full">
                <label htmlFor="checkout-note">{t('Delivery note')}</label>
                <textarea
                  id="checkout-note"
                  rows="3"
                  value={deliveryNote}
                  onChange={(event) => setDeliveryNote(event.target.value)}
                  placeholder={t('Any delivery instructions for the rider')}
                />
              </div>
            </div>
          </section>

          <section className="checkout-panel">
            <h2>{t('Delivery options')}</h2>
            <div className="checkout-options">
              <label className={`checkout-option ${deliveryMethod === 'standard' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="delivery"
                  value="standard"
                  checked={deliveryMethod === 'standard'}
                  onChange={() => setDeliveryMethod('standard')}
                />
                <div>
                  <strong>{t('Standard delivery')}</strong>
                  <span>{t('2-4 days · PKR 250')}</span>
                </div>
              </label>
              <label className={`checkout-option ${deliveryMethod === 'express' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="delivery"
                  value="express"
                  checked={deliveryMethod === 'express'}
                  onChange={() => setDeliveryMethod('express')}
                />
                <div>
                  <strong>{t('Express delivery')}</strong>
                  <span>{t('Next day · PKR 650')}</span>
                </div>
              </label>
              <label className={`checkout-option ${deliveryMethod === 'pickup' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="delivery"
                  value="pickup"
                  checked={deliveryMethod === 'pickup'}
                  onChange={() => setDeliveryMethod('pickup')}
                />
                <div>
                  <strong>{t('Pickup from seller')}</strong>
                  <span>{t('Free · Arrange directly')}</span>
                </div>
              </label>
            </div>
          </section>

          <section className="checkout-panel">
            <h2>{t('Payment method')}</h2>
            <div className="checkout-options">
              <label className={`checkout-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <div>
                  <strong>{t('Cash on delivery')}</strong>
                  <span>{t('Pay when you receive the order')}</span>
                </div>
              </label>
              <label className={`checkout-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                />
                <div>
                  <strong>{t('Debit / Credit card')}</strong>
                  <span>{t('Add card at payment gateway')}</span>
                </div>
              </label>
              <label className={`checkout-option ${paymentMethod === 'wallet' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="wallet"
                  checked={paymentMethod === 'wallet'}
                  onChange={() => setPaymentMethod('wallet')}
                />
                <div>
                  <strong>{t('Wallet / Bank transfer')}</strong>
                  <span>{t('Use your preferred wallet')}</span>
                </div>
              </label>
            </div>
          </section>
        </div>

        <aside className="checkout-summary">
          <h2>{t('Order summary')}</h2>
          <div className="checkout-summary__row">
            <span>{t('Subtotal')}</span>
            <strong>{formatPrice(subtotal, t)}</strong>
          </div>
          <div className="checkout-summary__row">
            <span>{t('Delivery')}</span>
            <strong>{formatPrice(shippingFee, t)}</strong>
          </div>
          <div className="checkout-summary__row checkout-summary__total">
            <span>{t('Total')}</span>
            <strong>{formatPrice(total, t)}</strong>
          </div>
          <button type="button" className="checkout-summary__cta" onClick={handlePlaceOrder}>
            {t('Place order')}
          </button>
          {status.type !== 'idle' && (
            <div className={`checkout-summary__status checkout-summary__status--${status.type}`}>
              {status.message}
            </div>
          )}
          <p className="checkout-summary__note">
            {t('By placing your order, you agree to the marketplace policies.')}
          </p>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
