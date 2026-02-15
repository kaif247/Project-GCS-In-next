import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'gcs-profile';

const initialForm = {
  name: '',
  username: '',
  bio: '',
  location: '',
  work: '',
  education: '',
  website: '',
  avatarUrl: '',
  coverUrl: '',
};

const ProfileCreatePage = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('');
  const [modalImage, setModalImage] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setForm((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        // ignore malformed data
      }
    }
  }, []);

  const preview = useMemo(
    () => ({
      name: form.name || 'Your name',
      username: form.username ? `@${form.username}` : '@username',
      bio: form.bio || 'Add a short bio for your profile.',
      location: form.location || 'Location',
      work: form.work || 'Workplace',
      education: form.education || 'Education',
      website: form.website || 'Website',
      avatarUrl: form.avatarUrl || 'https://i.pravatar.cc/150?img=12',
      coverUrl:
        form.coverUrl ||
        'https://images.unsplash.com/photo-1503264116251-35a269479413?w=1200&h=400&fit=crop',
    }),
    [form]
  );

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleFile = (field) => (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, [field]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      setStatus('Please add your name.');
      return;
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    }
    setStatus('Profile saved successfully.');
  };

  return (
    <div className="profile-create-page">
      <div className="profile-create-hero">
        <div className="profile-create-hero__cover">
          <img src={preview.coverUrl} alt="Cover" onClick={() => setModalImage(preview.coverUrl)} />
          <label className="profile-create-hero__cover-btn">
            <span>📷</span> Edit cover photo
            <input type="file" accept="image/*" onChange={handleFile('coverUrl')} />
          </label>
        </div>
        <div className="profile-create-hero__header">
          <div className="profile-create-hero__avatar">
            <img
              src={preview.avatarUrl}
              alt={preview.name}
              onClick={() => setModalImage(preview.avatarUrl)}
            />
            <label className="profile-create-hero__avatar-btn">
              📷
              <input type="file" accept="image/*" onChange={handleFile('avatarUrl')} />
            </label>
          </div>
          <div className="profile-create-hero__meta">
            <h1>{preview.name}</h1>
            <div className="profile-create-hero__username">{preview.username}</div>
            <p>{preview.bio}</p>
            <div className="profile-create-hero__badges">
              <span>{preview.location}</span>
              <span>{preview.work}</span>
              <span>{preview.education}</span>
            </div>
          </div>
          <div className="profile-create-hero__actions">
            <Link href="/profile" className="profile-create-link">
              View profile
            </Link>
            <button type="button" className="profile-create-save" onClick={handleSave}>
              Save profile
            </button>
          </div>
        </div>
      </div>

      {status && <div className="profile-create-status">{status}</div>}

      <div className="profile-create-content">
        <aside className="profile-create-form">
          <div className="profile-create-card">
            <h2>Basics</h2>
            <div className="form-group">
              <label>Name *</label>
              <input type="text" value={form.name} onChange={handleChange('name')} />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input type="text" value={form.username} onChange={handleChange('username')} />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea rows="3" value={form.bio} onChange={handleChange('bio')} />
            </div>
          </div>

          <div className="profile-create-card">
            <h2>Contact</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Location</label>
                <input type="text" value={form.location} onChange={handleChange('location')} />
              </div>
              <div className="form-group">
                <label>Website</label>
                <input type="text" value={form.website} onChange={handleChange('website')} />
              </div>
            </div>
          </div>

          <div className="profile-create-card">
            <h2>Work & education</h2>
            <div className="form-row">
              <div className="form-group">
                <label>Work</label>
                <input type="text" value={form.work} onChange={handleChange('work')} />
              </div>
              <div className="form-group">
                <label>Education</label>
                <input type="text" value={form.education} onChange={handleChange('education')} />
              </div>
            </div>
          </div>

          <div className="profile-create-card">
            <h2>Images</h2>
            <div className="form-group">
              <label>Avatar image (URL)</label>
              <input type="text" value={form.avatarUrl} onChange={handleChange('avatarUrl')} />
            </div>
            <div className="form-group">
              <label>Cover image (URL)</label>
              <input type="text" value={form.coverUrl} onChange={handleChange('coverUrl')} />
            </div>
          </div>
        </aside>

        <section className="profile-create-preview">
          <div className="profile-create-preview__title">Preview</div>
          <div className="profile-preview-card">
            <div className="profile-preview-cover">
              <img src={preview.coverUrl} alt="Cover" />
            </div>
            <div className="profile-preview-avatar">
              <img src={preview.avatarUrl} alt={preview.name} />
            </div>
            <div className="profile-preview-body">
              <h2>{preview.name}</h2>
              <div className="profile-preview-username">{preview.username}</div>
              <p>{preview.bio}</p>
              <div className="profile-preview-details">
                <span>{preview.location}</span>
                <span>{preview.work}</span>
                <span>{preview.education}</span>
                <span>{preview.website}</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {modalImage && (
        <div className="profile-image-modal" onClick={() => setModalImage('')}>
          <div className="profile-image-modal__content" onClick={(e) => e.stopPropagation()}>
            <img src={modalImage} alt="Profile" />
            <button type="button" onClick={() => setModalImage('')}>
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileCreatePage;
