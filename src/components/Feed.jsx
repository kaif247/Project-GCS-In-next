import React, { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { posts, currentUser, friendSuggestions } from '../data/facebookData';
import Stories from './Stories';
import PostInput from './PostInput';
import Post from './Post';
import useProfileData from '../hooks/useProfileData';
import useFeedPreferences from '../hooks/useFeedPreferences';
import useLocalPosts from '../hooks/useLocalPosts';

const engagementOptions = [
  'Protector',
  'Architect / Builder',
  'Leader / Founder',
];

const contributionTiers = [
  {
    label: 'The Citizen (FREE - Data Only)',
    value: 'Citizen',
    buttonText: 'Authenticate Bloodline (Data Only)',
  },
  {
    label: 'The Innovator ($18.49 / Month)',
    value: 'Innovator',
    buttonText: 'Contribute $18.49 Monthly',
  },
  {
    label: 'The Sovereign ($1,849 One-Time)',
    value: 'Sovereign',
    buttonText: 'Contribute $1,849 One-Time',
  },
];

const tierToPath = {
  Citizen: 'Protector',
  Innovator: 'Architect / Builder',
  Sovereign: 'Leader / Founder',
};


const Feed = () => {
  const router = useRouter();
  const profile = useProfileData();
  const { prefs, unhidePost } = useFeedPreferences();
  const { posts: localPosts, addPost, removePost } = useLocalPosts();
  const suggestionsScrollRef = useRef(null);
  const [registryForm, setRegistryForm] = useState({
    name: '',
    email: '',
    path: engagementOptions[0],
    tier: contributionTiers[0].value,
    paymentMethod: 'Stripe',
  });
  const [registryStatus, setRegistryStatus] = useState({ state: 'idle', message: '' });
  const registryEndpoint =
    process.env.NEXT_PUBLIC_REGISTRY_ENDPOINT || '/api/sovereign-registry';
  const selectedTier =
    contributionTiers.find((tier) => tier.value === registryForm.tier) ||
    contributionTiers[0];

  const suggestionList = useMemo(() => {
    const items = [];
    while (items.length < 10) {
      items.push(...friendSuggestions);
    }
    return items.slice(0, 10).map((item, idx) => ({
      ...item,
      id: `${item.id}-${idx}`,
      isRequestSent: false,
    }));
  }, []);
  const [visibleSuggestions, setVisibleSuggestions] = useState(suggestionList);

  const scrollSuggestions = (direction) => {
    if (!suggestionsScrollRef.current) return;
    const amount = direction === 'left' ? -280 : 280;
    suggestionsScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const resolvedPosts = useMemo(() => {
    const combined = [...localPosts, ...posts];
    return combined.map((post) =>
      post.userId === currentUser.id
        ? {
            ...post,
            userName: profile.name,
            userAvatar: profile.avatar,
          }
        : post
    );
  }, [profile, localPosts]);

    const filteredPosts = useMemo(() => {
      const now = Date.now();
      return resolvedPosts.filter((post) => {
        if (prefs.hiddenAuthors.includes(post.userName)) return false;
        if (prefs.blockedAuthors.includes(post.userName)) return false;
        if (prefs.blockedUserIds.includes(String(post.userId))) return false;
        const snoozeUntil = prefs.snoozedAuthors[post.userName];
        if (snoozeUntil && snoozeUntil > now) return false;
        return true;
      });
    }, [resolvedPosts, prefs]);
  const handleRegistryChange = (field) => (event) => {
    setRegistryForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleTierChange = (event) => {
    const tier = event.target.value;
    setRegistryForm((prev) => ({
      ...prev,
      tier,
      path: tierToPath[tier] || prev.path,
    }));
  };

  const handleRegistrySubmit = async (event) => {
    event.preventDefault();
    if (!registryForm.name.trim() || !registryForm.email.trim()) {
      setRegistryStatus({ state: 'error', message: 'Please complete all required fields.' });
      return;
    }
    setRegistryStatus({ state: 'loading', message: '' });
    try {
      const response = await fetch(registryEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registryForm),
      });
      if (!response.ok) throw new Error('Request failed');
      setRegistryStatus({ state: 'success', message: 'Registry received. Welcome.' });
      // Redirect to certificate page if Sovereign Founder
      if (registryForm.tier === 'Sovereign') {
        router.push({
          pathname: '/founder-certificate',
          query: {
            founderName: registryForm.name,
            activationDate: new Date().toLocaleDateString(),
            serialNumber: `HD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          },
        });
      }
      setRegistryForm({
        name: '',
        email: '',
        path: engagementOptions[0],
        tier: contributionTiers[0].value,
        paymentMethod: 'Stripe',
      });
    } catch (error) {
      setRegistryStatus({ state: 'error', message: 'Submission failed. Please try again.' });
    }
  };

  return (
    <div className="feed-container">
      <div className="feed-content">
        <section className="sovereign-feed-registry">
          <h2>Registry of Blood</h2>
          <p>Authenticate your coordinate before entering the feed.</p>
          <form onSubmit={handleRegistrySubmit}>
            <label className="sr-only" htmlFor="sovereign-name">
              Full Name
            </label>
            <input
              id="sovereign-name"
              type="text"
              placeholder="Your Sovereign Title"
              value={registryForm.name}
              onChange={handleRegistryChange('name')}
              required
            />
            <label className="sr-only" htmlFor="sovereign-email">
              Email Address
            </label>
            <input
              id="sovereign-email"
              type="email"
              placeholder="Digital Coordinate"
              value={registryForm.email}
              onChange={handleRegistryChange('email')}
              required
            />
            <label className="sr-only" htmlFor="sovereign-path">
              Engagement Path
            </label>
            <select
              id="sovereign-path"
              value={registryForm.path}
              onChange={handleRegistryChange('path')}
            >
              {engagementOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <label className="sr-only" htmlFor="sovereign-tier">
              Sovereign Contribution Tier
            </label>
            <select
              id="sovereign-tier"
              value={registryForm.tier}
              onChange={handleTierChange}
            >
              {contributionTiers.map((tier) => (
                <option key={tier.value} value={tier.value}>
                  {tier.label}
                </option>
              ))}
            </select>
            {/* Payment Method for paid tiers */}
            {(registryForm.tier === 'Innovator' || registryForm.tier === 'Sovereign') && (
              <div style={{ margin: '1rem 0' }}>
                <label htmlFor="payment-method">Payment Method</label>
                <select
                  id="payment-method"
                  value={registryForm.paymentMethod}
                  onChange={handleRegistryChange('paymentMethod')}
                >
                  <option value="Stripe">Stripe</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Crypto">Crypto (USDC/ETH)</option>
                </select>
              </div>
            )}
            <button type="submit" className="sovereign-feed-registry__submit">
              <img
                src="/sacred-antique-key.svg"
                alt=""
                aria-hidden="true"
                className="sovereign-feed-registry__key"
              />
              {registryStatus.state === 'loading' ? 'Submitting...' : selectedTier.buttonText}
            </button>
          </form>
          {registryStatus.message && (
            <p className="sovereign-feed-registry__status" role="status">
              {registryStatus.message}
            </p>
          )}
          <div className="sovereign-feed-registry__seal">
            <div className="sovereign-feed-registry__seal-glow" aria-hidden="true" />
            <img
              src="/registry-seal.svg"
              alt="Dorvilus Coat of Arms - Seal of Authenticity"
              loading="lazy"
            />
            <div className="sovereign-feed-registry__seal-text">
              <span>Seal of Authenticity</span>
              <span className="sovereign-feed-registry__motto">
                Je Renais de mes Cendres
              </span>
            </div>
            <span className="sovereign-feed-registry__badge">
              AUTHENTICATED BLOODLINE | 2026 FREQUENCY
            </span>
          </div>
        </section>
        <div className="hero-to-feed-divider" role="presentation" aria-hidden="true" />

        {/* Post Input */}
        <PostInput
          username={profile.name}
          avatarUrl={profile.avatar}
          onVideoClick={() => router.push('/live')}
          onPhotoClick={() => {}}
          onEmojiClick={() => {}}
          onCreatePost={(payload) => {
              const newPost = {
                id: `local-${Date.now()}`,
                isLocal: true,
                userId: currentUser.id,
                userName: profile.name,
                userAvatar: profile.avatar,
                content: payload.content || '',
                hashtags: payload.tags || [],
              images: payload.images || [],
              video: payload.video || null,
              textBackground: payload.textBackground || null,
              textColor: payload.textColor || null,
              reactions: {},
              comments: 0,
              shares: 0,
              location: 'Home',
              timestamp: 'Just now',
            };
            addPost(newPost);
          }}
        />

        {/* Stories Section */}
        <Stories />

        {/* Posts Feed */}
        <div className="posts-list">
          {filteredPosts.map((post, index) =>
            prefs.hiddenPosts.includes(post.id) ? (
              <div key={post.id} className="post-hidden-banner">
                <div>
                  <strong>Hidden</strong>
                  <span>
                    {prefs.hiddenReasons?.[post.id] === 'not_interested'
                      ? 'We will show you fewer posts like this.'
                      : 'Hiding posts helps GCS personalize your Feed.'}
                  </span>
                </div>
                <button type="button" onClick={() => unhidePost(post.id)}>
                  Undo
                </button>
              </div>
            ) : (
                <React.Fragment key={post.id}>
                  <Post
                    post={post}
                    canDelete={String(post.id).startsWith('local-')}
                    onDelete={removePost}
                  />
                  {index === 1 && (
                    <section className="feed-suggestions">
                      <div className="feed-suggestions__header">
                        <div>
                          <div className="feed-suggestions__title">People you may know</div>
                          <div className="feed-suggestions__subtitle">Suggestions based on mutuals</div>
                        </div>
                        <button
                          type="button"
                          className="feed-suggestions__more"
                          onClick={() => router.push('/friends/suggestions')}
                        >
                          See all
                        </button>
                      </div>
                      <div className="feed-suggestions__body">
                        <button
                          type="button"
                          className="feed-suggestions__nav feed-suggestions__nav--left"
                          aria-label="Scroll suggestions left"
                          onClick={() => scrollSuggestions('left')}
                        >
                          &#8249;
                        </button>
                        <div className="feed-suggestions__list" ref={suggestionsScrollRef}>
                          {visibleSuggestions.map((suggestion) => (
                            <div key={suggestion.id} className="feed-suggestions__card">
                              <button
                                type="button"
                                className="feed-suggestions__remove"
                                aria-label="Remove"
                                onClick={() =>
                                  setVisibleSuggestions((prev) =>
                                    prev.filter((item) => item.id !== suggestion.id)
                                  )
                                }
                              >
                                &times;
                              </button>
                              <img src={suggestion.avatar} alt={suggestion.name} />
                              <div className="feed-suggestions__name">{suggestion.name}</div>
                              <div className="feed-suggestions__mutuals">
                                {suggestion.mutualFriends} mutual friends
                              </div>
                              <button
                                type="button"
                                className="feed-suggestions__cta"
                                onClick={() =>
                                  setVisibleSuggestions((prev) =>
                                    prev.map((item) =>
                                      item.id === suggestion.id
                                        ? { ...item, isRequestSent: !item.isRequestSent }
                                        : item
                                    )
                                  )
                                }
                              >
                                {suggestion.isRequestSent ? 'Cancel request' : 'Add friend'}
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          className="feed-suggestions__nav feed-suggestions__nav--right"
                          aria-label="Scroll suggestions right"
                          onClick={() => scrollSuggestions('right')}
                        >
                          &#8250;
                        </button>
                      </div>
                    </section>
                  )}
                </React.Fragment>
              )
            )}
        </div>

      </div>
    </div>
  );
};

export default Feed;
