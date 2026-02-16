import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import useStories from '../../hooks/useStories';
import { currentUser } from '../../data/facebookData';
import StoryProgress from '../StoryProgress/StoryProgress';
import StoryReactions from '../StoryReactions/StoryReactions';
import StoryReply from '../StoryReply/StoryReply';
import StoryNavigation from '../StoryNavigation/StoryNavigation';
import styles from './StoryViewer.module.css';

const SEGMENT_MS = 5000;

const groupStoriesByUser = (stories) => {
  const map = new Map();
  stories.forEach((story) => {
    const key = story.userName || 'Unknown';
    if (!map.has(key)) {
      map.set(key, {
        userName: story.userName,
        userAvatar: story.userAvatar,
        stories: [],
      });
    }
    map.get(key).stories.push(story);
  });
  return Array.from(map.values());
};

const StoryViewer = ({ initialStoryId }) => {
  const router = useRouter();
  const { stories, removeStory } = useStories();
  const grouped = useMemo(() => groupStoriesByUser(stories), [stories]);
  const containerRef = useRef(null);
  const lastTimeRef = useRef(null);
  const animationRef = useRef(null);
  const progressRef = useRef(0);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transitionKey, setTransitionKey] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const holdTimeoutRef = useRef(null);
  const holdTriggeredRef = useRef(false);
  const replyPausedRef = useRef(false);
  const touchStartX = useRef(null);
  const touchStartTime = useRef(null);
  const videoRef = useRef(null);

  const currentGroup = grouped[currentUserIndex];
  const currentStory = currentGroup ? currentGroup.stories[currentSegmentIndex] : null;
  const canDeleteStory =
    currentStory &&
    (currentStory.userId === currentUser.id ||
      (String(currentStory.id).startsWith('story-') && currentStory.userName === currentUser.name));


  useEffect(() => {
    if (!stories.length || !initialStoryId) return;
    const idx = stories.findIndex((story) => String(story.id) === String(initialStoryId));
    if (idx < 0) return;
    let running = 0;
    for (let i = 0; i < grouped.length; i += 1) {
      const group = grouped[i];
      const groupIdx = group.stories.findIndex((story) => String(story.id) === String(initialStoryId));
      if (groupIdx >= 0) {
        setCurrentUserIndex(i);
        setCurrentSegmentIndex(groupIdx);
        progressRef.current = 0;
        setProgress(0);
        break;
      }
      running += group.stories.length;
    }
  }, [initialStoryId, stories, grouped]);

  useEffect(() => {
    const onKey = (event) => {
      const tag = event.target?.tagName?.toLowerCase();
      const isTypingField = tag === 'input' || tag === 'textarea';
      if (event.key === 'Escape') {
        event.preventDefault();
        handleClose();
      }
      if (event.key === ' ' && !isTypingField) {
        event.preventDefault();
        handleTogglePlay();
      }
      if (event.key.toLowerCase() === 'm' && !isTypingField) {
        event.preventDefault();
        handleToggleMute();
      }
      if ((event.key === 'Delete' || event.key === 'Backspace') && canDeleteStory && !isTypingField) {
        event.preventDefault();
        setIsDeleteOpen(true);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrev();
      }
      if (event.key === 'Tab') {
        const focusable = containerRef.current?.querySelectorAll(
          'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [currentUserIndex, currentSegmentIndex, canDeleteStory]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    containerRef.current?.focus();
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      setIsPaused(document.hidden);
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (!currentStory) return undefined;
    const next = getNextStory();
    if (next && next.image) {
      const img = new Image();
      img.src = next.image;
    }
    return undefined;
  }, [currentStory, currentUserIndex, currentSegmentIndex]);

  useEffect(() => {
    setTransitionKey((prev) => prev + 1);
    setIsMenuOpen(false);
    setIsDeleteOpen(false);
    progressRef.current = 0;
    setProgress(0);
  }, [currentUserIndex, currentSegmentIndex]);

  useEffect(() => {
    if (isPaused) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      lastTimeRef.current = null;
      return;
    }
    const tick = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const delta = time - lastTimeRef.current;
      lastTimeRef.current = time;
      progressRef.current = Math.min(1, progressRef.current + delta / SEGMENT_MS);
      setProgress(progressRef.current);
      if (progressRef.current >= 1) {
        goNext();
        return;
      }
      animationRef.current = requestAnimationFrame(tick);
    };
    animationRef.current = requestAnimationFrame(tick);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
      lastTimeRef.current = null;
    };
  }, [isPaused, currentUserIndex, currentSegmentIndex]);

  const getNextStory = () => {
    if (!currentGroup) return null;
    if (currentSegmentIndex + 1 < currentGroup.stories.length) {
      return currentGroup.stories[currentSegmentIndex + 1];
    }
    if (currentUserIndex + 1 < grouped.length) {
      return grouped[currentUserIndex + 1].stories[0];
    }
    return null;
  };

  const handleClose = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
    if (!grouped.length) {
      handleClose();
      return;
    }
    if (currentUserIndex >= grouped.length) {
      setCurrentUserIndex(grouped.length - 1);
      setCurrentSegmentIndex(0);
      progressRef.current = 0;
      setProgress(0);
      return;
    }
    const group = grouped[currentUserIndex];
    if (group && currentSegmentIndex >= group.stories.length) {
      setCurrentSegmentIndex(0);
      progressRef.current = 0;
      setProgress(0);
    }
  }, [grouped, currentUserIndex, currentSegmentIndex]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = isMuted;
    videoRef.current.volume = isMuted ? 0 : 1;
  }, [isMuted, currentStory]);

  useEffect(() => {
    if (!videoRef.current || !currentStory?.video) return;
    if (isPaused) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {
        if (!isMuted) setIsMuted(true);
      });
    }
  }, [isPaused, currentStory, isMuted]);

  const goNext = () => {
    if (!currentGroup) return;
    if (currentSegmentIndex + 1 < currentGroup.stories.length) {
      setCurrentSegmentIndex((prev) => prev + 1);
      progressRef.current = 0;
      setProgress(0);
      return;
    }
    if (currentUserIndex + 1 < grouped.length) {
      setCurrentUserIndex((prev) => prev + 1);
      setCurrentSegmentIndex(0);
      progressRef.current = 0;
      setProgress(0);
      return;
    }
    handleClose();
  };

  const goPrev = () => {
    if (!currentGroup) return;
    if (currentSegmentIndex > 0) {
      setCurrentSegmentIndex((prev) => prev - 1);
      progressRef.current = 0;
      setProgress(0);
      return;
    }
    if (currentUserIndex > 0) {
      const prevUser = grouped[currentUserIndex - 1];
      setCurrentUserIndex((prev) => prev - 1);
      setCurrentSegmentIndex(prevUser.stories.length - 1);
      progressRef.current = 0;
      setProgress(0);
    }
  };

  const handleTogglePlay = () => {
    const nextPaused = !isPaused;
    if (!nextPaused && videoRef.current && isMuted) {
      setIsMuted(false);
    }
    setIsPaused(nextPaused);
  };

  const handleToggleMute = () => {
    setIsMuted((prev) => {
      const next = !prev;
      if (videoRef.current) {
        videoRef.current.muted = next;
        videoRef.current.volume = next ? 0 : 1;
        if (!next) {
          videoRef.current.play().catch(() => {});
        }
      }
      return next;
    });
  };

  const handleDeleteStory = () => {
    if (!currentStory) return;
    removeStory(currentStory.id);
    setIsDeleteOpen(false);
  };

  const handleReplyFocus = () => {
    replyPausedRef.current = isPaused;
    setIsPaused(true);
    if (videoRef.current) videoRef.current.pause();
  };

  const handleReplyBlur = () => {
    if (!replyPausedRef.current) {
      setIsPaused(false);
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  if (!currentStory) {
    return (
      <div className={styles.overlay}>
        <div className={styles.backdrop} />
        <div className={styles.emptyState}>
          <p>No stories available.</p>
          <button type="button" onClick={handleClose}>Back</button>
        </div>
      </div>
    );
  }

  const backgroundMap = {
    dark: styles.bgDark,
    accent: styles.bgAccent,
    cyan: styles.bgCyan,
    violet: styles.bgViolet,
    rose: styles.bgRose,
    mint: styles.bgMint,
  };
  const backgroundClass = backgroundMap[currentStory.backgroundKey] || styles.bgDark;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.backdrop} onClick={handleClose} aria-hidden="true" />
      <div
        className={styles.shell}
        ref={containerRef}
        tabIndex={-1}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0].clientX;
          touchStartTime.current = Date.now();
          setIsPaused(true);
        }}
        onTouchEnd={(event) => {
          const endX = event.changedTouches[0].clientX;
          const deltaX = endX - (touchStartX.current || 0);
          const duration = Date.now() - (touchStartTime.current || 0);
          setIsPaused(false);
          if (Math.abs(deltaX) > 40) {
            if (deltaX > 0) {
              goPrev();
            } else {
              goNext();
            }
            return;
          }
          if (duration < 200) {
            const screenMid = window.innerWidth / 2;
            if (endX < screenMid) {
              goPrev();
            } else {
              goNext();
            }
          }
        }}
      >
        <button type="button" className={styles.closeButton} aria-label="Close story viewer" onClick={handleClose}>
          ×
        </button>
        <div className={styles.stage} onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}>
          <div className={styles.storyCard}>
            <StoryProgress
              segments={currentGroup.stories.length}
              activeIndex={currentSegmentIndex}
              progress={progress}
            />
            <div className={styles.storyHeader}>
              <div className={styles.storyUser}>
                <img src={currentStory.userAvatar} alt={currentStory.userName} />
                <div>
                  <div className={styles.storyUserName}>{currentStory.userName}</div>
                  <div className={styles.storyUserMeta}>22h</div>
                </div>
              </div>
              <div
                className={styles.storyControls}
                onMouseDown={(e) => e.stopPropagation()}
                onMouseUp={(e) => e.stopPropagation()}
              >
                <button type="button" aria-label={isPaused ? 'Play' : 'Pause'} onClick={handleTogglePlay}>
                  {isPaused ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M8 5.5v13l10-6.5-10-6.5z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <rect x="6" y="5" width="4" height="14" rx="1.5" />
                      <rect x="14" y="5" width="4" height="14" rx="1.5" />
                    </svg>
                  )}
                </button>
                {currentStory.video && (
                  <button type="button" aria-label={isMuted ? 'Unmute' : 'Mute'} onClick={handleToggleMute}>
                    {isMuted ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M4 9v6h4l5 4V5L8 9H4z" />
                        <path d="M16 9l4 4m0-4l-4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path d="M4 9v6h4l5 4V5L8 9H4z" />
                        <path d="M16 8c1.5 1.2 2.5 2.7 2.5 4s-1 2.8-2.5 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                  </button>
                )}
                {canDeleteStory && (
                  <button type="button" aria-label="Delete story" onClick={() => setIsDeleteOpen(true)}>
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <path d="M9 3h6l1 2h4v2H4V5h4l1-2z" />
                      <path d="M6 9h12l-1 11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 9z" />
                    </svg>
                  </button>
                )}
                <div className={styles.menuWrap}>
                  <button
                    type="button"
                    aria-label="Menu"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                      <circle cx="5" cy="12" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="19" cy="12" r="2" />
                    </svg>
                  </button>
                  {isMenuOpen && (
                    <div className={styles.menu}>
                      <button type="button">Report</button>
                      <button type="button">Mute story</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div
              className={styles.storyMedia}
              key={transitionKey}
              onClick={(e) => {
                e.stopPropagation();
                if (holdTriggeredRef.current) {
                  holdTriggeredRef.current = false;
                  return;
                }
                handleTogglePlay();
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                holdTriggeredRef.current = false;
                holdTimeoutRef.current = setTimeout(() => {
                  holdTriggeredRef.current = true;
                }, 200);
                setIsPaused(true);
                if (videoRef.current) videoRef.current.pause();
              }}
              onMouseUp={(e) => {
                e.stopPropagation();
                if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
                setIsPaused(false);
                if (videoRef.current) {
                  videoRef.current.play().catch(() => {});
                }
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                holdTriggeredRef.current = false;
                holdTimeoutRef.current = setTimeout(() => {
                  holdTriggeredRef.current = true;
                }, 200);
                setIsPaused(true);
                if (videoRef.current) videoRef.current.pause();
              }}
              onTouchEnd={(e) => {
                e.stopPropagation();
                if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
                setIsPaused(false);
                if (videoRef.current) {
                  videoRef.current.play().catch(() => {});
                }
              }}
            >
              {currentStory.video ? (
                <video
                  ref={videoRef}
                  src={currentStory.video}
                  autoPlay={!isPaused}
                  muted={isMuted}
                  playsInline
                  preload="metadata"
                  poster={currentStory.thumbnail || currentStory.image || undefined}
                />
              ) : currentStory.image ? (
                <img src={currentStory.image} alt={currentStory.userName} loading="lazy" />
              ) : (
                <div className={`${styles.storyText} ${backgroundClass}`}>{currentStory.text}</div>
              )}
            </div>
          </div>
            <StoryNavigation onPrev={goPrev} onNext={goNext} />
            <StoryReply
              onSubmit={(value) => console.log('reply', value)}
              onFocus={handleReplyFocus}
              onBlur={handleReplyBlur}
              onChange={handleReplyFocus}
            />
            <StoryReactions />
            {isDeleteOpen && (
              <div className={styles.deleteOverlay} onClick={() => setIsDeleteOpen(false)}>
                <div className={styles.deleteModal} onClick={(e) => e.stopPropagation()}>
                  <h3>Delete story?</h3>
                  <p>Are you sure you want to delete this story?</p>
                  <div className={styles.deleteActions}>
                    <button type="button" onClick={() => setIsDeleteOpen(false)}>Cancel</button>
                    <button type="button" onClick={handleDeleteStory}>Delete</button>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;


