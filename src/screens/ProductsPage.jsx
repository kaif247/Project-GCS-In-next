import React, { useContext, useMemo, useState } from 'react';
import Link from 'next/link';
import { LanguageContext } from '../context/LanguageContext';
import { MarketplaceContext } from '../context/MarketplaceContext';

const categories = [
  'Electronics',
  'Vehicles',
  'Property for rent',
  'Classifieds',
  'Clothing',
  'Entertainment',
  'Family',
  'Free stuff',
];

const conditions = ['New', 'Like new', 'Good', 'Fair', 'For parts'];
const deliveryOptions = ['Pickup only', 'Delivery available', 'Shipping available'];
const availabilityOptions = ['In stock', 'Limited stock', 'Pre-order'];

const initialForm = {
  title: '',
  price: '',
  category: 'Electronics',
  condition: 'New',
  brand: '',
  model: '',
  year: '',
  location: '',
  description: '',
  quantity: 1,
  availability: 'In stock',
  delivery: 'Pickup only',
  shippingCost: '',
  negotiable: false,
  warranty: '',
  tags: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  images: ['', '', ''],
};

const formatPrice = (value, t) => {
  if (value === 0) return t('Free');
  if (!value && value !== 0) return t('Price');
  return `PKR ${Number(value).toLocaleString('en-PK')}`;
};

const ProductsPage = () => {
  const { t } = useContext(LanguageContext);
  const { addProduct } = useContext(MarketplaceContext);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  const uploadedImages = useMemo(
    () => form.images.filter((url) => url.trim() !== ''),
    [form.images]
  );

  const primaryImage = uploadedImages[0] || '';

  const preview = useMemo(() => {
    const priceValue = form.price === '' ? '' : Number(form.price);
    return {
      title: form.title.trim() || t('Your product title'),
      price: priceValue === '' ? '' : Number.isNaN(priceValue) ? '' : priceValue,
      category: form.category,
      condition: form.condition,
      brand: form.brand.trim() || t('Brand'),
      model: form.model.trim() || t('Model'),
      year: form.year.trim() || t('Year'),
      location: form.location.trim() || t('Location'),
      description: form.description.trim() || t('Add a clear description for buyers.'),
      quantity: form.quantity,
      availability: form.availability,
      delivery: form.delivery,
      shippingCost: form.shippingCost.trim() || t('Shipping cost'),
      negotiable: form.negotiable ? t('Yes') : t('No'),
      warranty: form.warranty.trim() || t('Warranty details'),
      tags: form.tags.trim() || t('Tags'),
      contactName: form.contactName.trim() || t('Your name'),
      contactEmail: form.contactEmail.trim() || t('Email'),
      contactPhone: form.contactPhone.trim() || t('Phone'),
      image: primaryImage,
    };
  }, [form, primaryImage, t]);

  const previewImages = useMemo(() => {
    if (uploadedImages.length > 0) return uploadedImages.slice(0, 4);
    return [];
  }, [uploadedImages, preview.image]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (index) => (event) => {
    const value = event.target.value;
    setForm((prev) => {
      const images = [...prev.images];
      images[index] = value;
      return { ...prev, images };
    });
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const readers = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((results) => {
      setForm((prev) => {
        const images = [...prev.images];
        results.forEach((result) => {
          const dataUrl = typeof result === 'string' ? result : '';
          const emptyIndex = images.findIndex((url) => url.trim() === '');
          if (emptyIndex >= 0) {
            images[emptyIndex] = dataUrl;
          } else {
            images.push(dataUrl);
          }
        });
        return { ...prev, images };
      });
    });
  };

  const canPublish = useMemo(() => {
    return (
      form.title.trim() !== '' &&
      form.location.trim() !== '' &&
      form.price !== '' &&
      !Number.isNaN(Number(form.price))
    );
  }, [form.title, form.location, form.price]);

  const handlePublish = () => {
    if (!canPublish) {
      setStatus({ type: 'error', message: t('Please fill the required fields to publish.') });
      return;
    }

    const priceValue = Number(form.price);
    const product = {
      id: Date.now(),
      title: form.title.trim(),
      price: Number.isNaN(priceValue) ? 0 : priceValue,
      location: form.location.trim(),
      image: primaryImage || preview.image,
      category: form.category,
      details: {
        condition: form.condition,
        brand: form.brand.trim(),
        model: form.model.trim(),
        year: form.year.trim(),
        description: form.description.trim(),
        quantity: form.quantity,
        availability: form.availability,
        delivery: form.delivery,
        shippingCost: form.shippingCost.trim(),
        negotiable: form.negotiable,
        warranty: form.warranty.trim(),
        tags: form.tags.trim(),
        contactName: form.contactName.trim(),
        contactEmail: form.contactEmail.trim(),
        contactPhone: form.contactPhone.trim(),
        images: form.images.filter((url) => url.trim() !== ''),
      },
    };

    addProduct(product);
    setForm(initialForm);
    setStatus({ type: 'success', message: t('Product published to Marketplace.') });
  };

  return (
    <div className="products-page">
      <header className="products-page__header">
        <div>
          <h1>{t('Create Product Listing')}</h1>
          <p>{t('Add product details on the left, preview appears on the right.')}</p>
        </div>
        <div className="products-page__header-actions">
          <Link className="products-page__marketplace-link" href="/marketplace">
            {t('Go to Marketplace')}
          </Link>
          <button
            type="button"
            className="products-page__publish"
            onClick={handlePublish}
            disabled={!canPublish}
          >
            {t('Publish to Marketplace')}
          </button>
        </div>
      </header>

      {status.message && (
        <div className={`products-page__status products-page__status--${status.type}`}>
          {status.message}
        </div>
      )}

      <div className="products-page__content">
        <aside className="products-form">
          <h2>{t('Listing details')}</h2>

          <div className="products-form__group">
            <label htmlFor="product-title">{t('Title')} *</label>
            <input
              id="product-title"
              type="text"
              value={form.title}
              onChange={handleChange('title')}
              placeholder={t('Example: iPhone 14 Pro 256GB')}
            />
          </div>

          <div className="products-form__row">
            <div className="products-form__group">
              <label htmlFor="product-price">{t('Price')} *</label>
              <input
                id="product-price"
                type="number"
                min="0"
                value={form.price}
                onChange={handleChange('price')}
                placeholder="PKR"
              />
            </div>
            <div className="products-form__group">
              <label htmlFor="product-category">{t('Category')}</label>
              <select
                id="product-category"
                value={form.category}
                onChange={handleChange('category')}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {t(category)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="products-form__row">
            <div className="products-form__group">
              <label htmlFor="product-condition">{t('Condition')}</label>
              <select
                id="product-condition"
                value={form.condition}
                onChange={handleChange('condition')}
              >
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {t(condition)}
                  </option>
                ))}
              </select>
            </div>
            <div className="products-form__group">
              <label htmlFor="product-location">{t('Location')} *</label>
              <input
                id="product-location"
                type="text"
                value={form.location}
                onChange={handleChange('location')}
                placeholder={t('City, Area')}
              />
            </div>
          </div>

          <div className="products-form__row">
            <div className="products-form__group">
              <label htmlFor="product-brand">{t('Brand')}</label>
              <input
                id="product-brand"
                type="text"
                value={form.brand}
                onChange={handleChange('brand')}
              />
            </div>
            <div className="products-form__group">
              <label htmlFor="product-model">{t('Model')}</label>
              <input
                id="product-model"
                type="text"
                value={form.model}
                onChange={handleChange('model')}
              />
            </div>
          </div>

          <div className="products-form__row">
            <div className="products-form__group">
              <label htmlFor="product-year">{t('Year')}</label>
              <input
                id="product-year"
                type="text"
                value={form.year}
                onChange={handleChange('year')}
              />
            </div>
            <div className="products-form__group">
              <label htmlFor="product-availability">{t('Availability')}</label>
              <select
                id="product-availability"
                value={form.availability}
                onChange={handleChange('availability')}
              >
                {availabilityOptions.map((option) => (
                  <option key={option} value={option}>
                    {t(option)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="products-form__row">
            <div className="products-form__group">
              <label htmlFor="product-quantity">{t('Quantity')}</label>
              <input
                id="product-quantity"
                type="number"
                min="1"
                value={form.quantity}
                onChange={handleChange('quantity')}
              />
            </div>
            <div className="products-form__group">
              <label htmlFor="product-delivery">{t('Delivery')}</label>
              <select
                id="product-delivery"
                value={form.delivery}
                onChange={handleChange('delivery')}
              >
                {deliveryOptions.map((option) => (
                  <option key={option} value={option}>
                    {t(option)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="products-form__row">
            <div className="products-form__group">
              <label htmlFor="product-shipping">{t('Shipping cost')}</label>
              <input
                id="product-shipping"
                type="text"
                value={form.shippingCost}
                onChange={handleChange('shippingCost')}
                placeholder={t('Free / PKR 500')}
              />
            </div>
            <div className="products-form__group">
              <label htmlFor="product-warranty">{t('Warranty')}</label>
              <input
                id="product-warranty"
                type="text"
                value={form.warranty}
                onChange={handleChange('warranty')}
                placeholder={t('1 year / None')}
              />
            </div>
          </div>

          <div className="products-form__group">
            <label htmlFor="product-description">{t('Description')}</label>
            <textarea
              id="product-description"
              rows="4"
              value={form.description}
              onChange={handleChange('description')}
              placeholder={t('Include features, condition, and reason for selling.')}
            />
          </div>

          <div className="products-form__group products-form__checkbox">
            <label htmlFor="product-negotiable">
              <input
                id="product-negotiable"
                type="checkbox"
                checked={form.negotiable}
                onChange={handleChange('negotiable')}
              />
              {t('Price is negotiable')}
            </label>
          </div>

          <div className="products-form__group">
            <label htmlFor="product-tags">{t('Tags')}</label>
            <input
              id="product-tags"
              type="text"
              value={form.tags}
              onChange={handleChange('tags')}
              placeholder={t('e.g. gaming, iphone, warranty')}
            />
          </div>

          <div className="products-form__group">
            <label>{t('Images')}</label>
            <div className="products-form__images">
              {form.images.map((value, index) => (
                <input
                  key={`image-${index}`}
                  type="text"
                  value={value}
                  onChange={handleImageChange(index)}
                  placeholder={t('Paste image URL')}
                />
              ))}
            </div>
            <label className="products-form__upload">
              <span>{t('Upload your photos')}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </label>
          </div>

          <div className="products-form__divider" />

          <h3>{t('Seller information')}</h3>

          <div className="products-form__group">
            <label htmlFor="product-contact-name">{t('Name')}</label>
            <input
              id="product-contact-name"
              type="text"
              value={form.contactName}
              onChange={handleChange('contactName')}
            />
          </div>

          <div className="products-form__row">
            <div className="products-form__group">
              <label htmlFor="product-contact-email">{t('Email')}</label>
              <input
                id="product-contact-email"
                type="email"
                value={form.contactEmail}
                onChange={handleChange('contactEmail')}
              />
            </div>
            <div className="products-form__group">
              <label htmlFor="product-contact-phone">{t('Phone')}</label>
              <input
                id="product-contact-phone"
                type="text"
                value={form.contactPhone}
                onChange={handleChange('contactPhone')}
              />
            </div>
          </div>
        </aside>

        <section className="products-preview">
          <h2>{t('Preview')}</h2>
          <div className="products-preview__card">
            <div
              className={`products-preview__image-grid ${
                previewImages.length > 1 ? 'is-split' : ''
              }`}
            >
              {previewImages.length === 0 ? (
                <div className="products-preview__placeholder">
                  {t('Add product image')}
                </div>
              ) : (
                previewImages.map((src, index) => (
                  <img key={`${src}-${index}`} src={src} alt={preview.title} />
                ))
              )}
            </div>
            <div className="products-preview__body">
              <div className="products-preview__price">{formatPrice(preview.price, t)}</div>
              <h3 className="products-preview__title">{preview.title}</h3>
              <div className="products-preview__meta">
                <span>{t(preview.category)}</span>
                <span>{t(preview.condition)}</span>
                <span>{preview.location}</span>
              </div>
              <p className="products-preview__description">{preview.description}</p>
              <div className="products-preview__grid">
                <div>
                  <span>{t('Brand')}</span>
                  <strong>{preview.brand}</strong>
                </div>
                <div>
                  <span>{t('Model')}</span>
                  <strong>{preview.model}</strong>
                </div>
                <div>
                  <span>{t('Year')}</span>
                  <strong>{preview.year}</strong>
                </div>
                <div>
                  <span>{t('Availability')}</span>
                  <strong>{t(preview.availability)}</strong>
                </div>
                <div>
                  <span>{t('Quantity')}</span>
                  <strong>{preview.quantity}</strong>
                </div>
                <div>
                  <span>{t('Delivery')}</span>
                  <strong>{t(preview.delivery)}</strong>
                </div>
                <div>
                  <span>{t('Shipping')}</span>
                  <strong>{preview.shippingCost}</strong>
                </div>
                <div>
                  <span>{t('Negotiable')}</span>
                  <strong>{preview.negotiable}</strong>
                </div>
                <div>
                  <span>{t('Warranty')}</span>
                  <strong>{preview.warranty}</strong>
                </div>
                <div>
                  <span>{t('Tags')}</span>
                  <strong>{preview.tags}</strong>
                </div>
              </div>
            </div>
            <div className="products-preview__seller">
              <div>
                <span>{t('Seller')}</span>
                <strong>{preview.contactName}</strong>
              </div>
              <div>
                <span>{t('Email')}</span>
                <strong>{preview.contactEmail}</strong>
              </div>
              <div>
                <span>{t('Phone')}</span>
                <strong>{preview.contactPhone}</strong>
              </div>
            </div>
            <div className="products-preview__actions">
              <button type="button" className="products-preview__cta">
                {t('Message Seller')}
              </button>
              <button type="button" className="products-preview__cta-outline">
                {t('Save Listing')}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductsPage;
