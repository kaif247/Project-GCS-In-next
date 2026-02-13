import React, { useMemo, useRef, useState } from 'react';
import {
  FaRegCommentDots,
  FaUsers,
  FaSignal,
  FaPoll,
  FaRegEye,
  FaThumbsUp,
  FaVideo,
  FaExpand,
  FaCompress,
} from 'react-icons/fa';

const LiveProducerDashboard = ({ videoRef, hasActiveStream, onEndLive }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollCorrectIndex, setPollCorrectIndex] = useState('');
  const [polls, setPolls] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenRef = useRef(null);

  const pollOptionsTrimmed = useMemo(
    () => pollOptions.map((option) => option.trim()).filter(Boolean),
    [pollOptions]
  );

  const handleAddComment = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    setComments((prev) => [
      { id: Date.now(), author: 'You', text: trimmed },
      ...prev,
    ]);
    setCommentText('');
  };

  const handlePollOptionChange = (index, value) => {
    setPollOptions((prev) => prev.map((option, i) => (i === index ? value : option)));
  };

  const handleAddPollOption = () => {
    setPollOptions((prev) => [...prev, '']);
  };

  const handleCreatePoll = () => {
    const question = pollQuestion.trim();
    if (!question || pollOptionsTrimmed.length < 2) return;
    const correctIndex =
      pollCorrectIndex === '' ? null : Number.parseInt(pollCorrectIndex, 10);
    setPolls((prev) => [
      {
        id: Date.now(),
        question,
        options: pollOptionsTrimmed,
        votes: new Array(pollOptionsTrimmed.length).fill(0),
        correctIndex: Number.isNaN(correctIndex) ? null : correctIndex,
      },
      ...prev,
    ]);
    setPollQuestion('');
    setPollOptions(['', '']);
    setPollCorrectIndex('');
  };

  const handleVote = (pollId, optionIndex) => {
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll.id !== pollId) return poll;
        if (poll.selectedIndex === optionIndex) return poll;
        const votes = poll.votes.map((count, idx) =>
          idx === optionIndex ? count + 1 : count
        );
        return { ...poll, votes, selectedIndex: optionIndex };
      })
    );
  };

  const handleToggleFullscreen = async () => {
    if (!fullscreenRef.current) return;
    if (!document.fullscreenElement) {
      await fullscreenRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="lp-dashboard">
      <div className="lp-dashboard-top">
        <div className="lp-card lp-preview-card">
          <div className="lp-preview lp-preview--live" ref={fullscreenRef}>
            {hasActiveStream ? (
              <video ref={videoRef} autoPlay muted playsInline />
            ) : (
              <div className="lp-preview-placeholder">
                <FaVideo />
                <div className="lp-preview-title">Start your video to see the preview.</div>
                <div className="lp-preview-sub">Select Webcam to request camera access.</div>
              </div>
            )}
            {hasActiveStream && (
              <>
                <div className="lp-live-viewers">
                  <FaUsers />
                  <span>0</span>
                </div>
                <div className="lp-live-comments">
                  {comments.length === 0 ? (
                    <div className="lp-live-comments__empty">No comments yet</div>
                  ) : (
                    comments.slice(0, 4).map((comment) => (
                      <div className="lp-live-comment" key={`overlay-${comment.id}`}>
                        <strong>{comment.author}</strong> {comment.text}
                      </div>
                    ))
                  )}
                  <div className="lp-live-comment-input">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment"
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          handleAddComment();
                        }
                      }}
                    />
                    <button type="button" onClick={handleAddComment}>
                      Post
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="lp-live-fullscreen-btn"
                  onClick={handleToggleFullscreen}
                  aria-label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
                >
                  {isFullscreen ? <FaCompress /> : <FaExpand />}
                </button>
              </>
            )}
          </div>
          <div className="lp-event-logs">
            <span className="lp-event-logs__icon">OK</span>
            Event logs
          </div>
        </div>

        <div className="lp-card lp-comments">
          <div className="lp-card__header">
            <h3>Comments</h3>
          </div>
          {comments.length === 0 ? (
            <div className="lp-empty">
              <FaRegCommentDots />
              <span>No comments yet</span>
            </div>
          ) : (
            <div className="lp-comment-list">
              {comments.map((comment) => (
                <div className="lp-comment" key={comment.id}>
                  <div className="lp-comment__author">{comment.author}</div>
                  <div className="lp-comment__text">{comment.text}</div>
                </div>
              ))}
            </div>
          )}
          <div className="lp-comment-input">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment"
            />
            <button type="button" className="lp-btn-secondary" onClick={handleAddComment}>
              Reply
            </button>
          </div>
        </div>
      </div>

      <div className="lp-dashboard-grid">
        <div className="lp-card">
          <div className="lp-card__header">
            <h3>Live activity</h3>
          </div>
          <div className="lp-metric-row">
            <div className="lp-metric">
              <FaRegEye />
              <div>
                <div className="lp-metric__value">0</div>
                <div className="lp-metric__label">Viewers</div>
              </div>
            </div>
            <div className="lp-metric">
              <FaUsers />
              <div>
                <div className="lp-metric__value">0</div>
                <div className="lp-metric__label">Comments</div>
              </div>
            </div>
            <div className="lp-metric">
              <FaThumbsUp />
              <div>
                <div className="lp-metric__value">0</div>
                <div className="lp-metric__label">Reactions</div>
              </div>
            </div>
            <div className="lp-metric">
              <FaSignal />
              <div>
                <div className="lp-metric__value">0</div>
                <div className="lp-metric__label">Shares</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lp-card">
          <div className="lp-card__header">
            <h3>Stream metrics</h3>
          </div>
          <div className="lp-metric-list">
            <div>1080p Max resolution</div>
            <div>8 hours Max live duration</div>
            <div>0 x 0 Video resolution</div>
          </div>
        </div>

        <div className="lp-card">
          <div className="lp-card__header">
            <h3>Manage on second device</h3>
          </div>
          <p className="lp-text-muted">
            Share the link to your live video with moderators. It will open in Live Producer.
          </p>
          <div className="lp-link-row">
            <input type="text" readOnly value="https://www.facebook.com/live/producer" />
            <button type="button" className="lp-btn-secondary">Copy</button>
          </div>
        </div>

        <div className="lp-card">
          <div className="lp-card__header">
            <h3>Preview link</h3>
          </div>
          <p className="lp-text-muted">Click on the link below to view what your viewers see.</p>
          <div className="lp-link-row">
            <input type="text" readOnly value="https://web.facebook.com/kaif.live" />
            <button type="button" className="lp-btn-secondary">View Post</button>
          </div>
        </div>

        <div className="lp-card">
          <div className="lp-card__header">
            <h3>Polls</h3>
          </div>
          {polls.length > 0 && (
            <div className="lp-poll-list">
              {polls.map((poll) => (
                <div className="lp-poll-item" key={poll.id}>
                  <div className="lp-poll-question">
                    <FaPoll />
                    <span>{poll.question}</span>
                  </div>
                  <div className="lp-poll-options">
                    {poll.options.map((option, index) => {
                      const totalVotes = poll.votes.reduce((sum, v) => sum + v, 0) || 1;
                      const percent = Math.round((poll.votes[index] / totalVotes) * 100);
                      const isSelected = poll.selectedIndex === index;
                      const isCorrect = poll.correctIndex === index;
                      const showResult = poll.selectedIndex !== undefined;
                      return (
                        <button
                          type="button"
                          key={`${poll.id}-${index}`}
                          className={`lp-poll-option-btn ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => handleVote(poll.id, index)}
                        >
                          <span className="lp-poll-option__label">{option}</span>
                          {showResult && (
                            <span className="lp-poll-option__meta">
                              {percent}% • {poll.votes[index]}
                            </span>
                          )}
                          {showResult && poll.correctIndex !== null && isSelected && (
                            <span className={`lp-poll-option__result ${isCorrect ? 'ok' : 'bad'}`}>
                              {isCorrect ? 'Correct' : 'Incorrect'}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="lp-poll">
            <label>Question</label>
            <input
              type="text"
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              placeholder="Ask a question"
            />
            <label>Options</label>
            {pollOptions.map((option, index) => (
              <input
                key={`poll-option-${index}`}
                type="text"
                value={option}
                onChange={(e) => handlePollOptionChange(index, e.target.value)}
                placeholder={`Add option ${index + 1}`}
              />
            ))}
            <label>Correct option (optional)</label>
            <select
              value={pollCorrectIndex}
              onChange={(e) => setPollCorrectIndex(e.target.value)}
            >
              <option value="">No correct option</option>
              {pollOptionsTrimmed.map((option, index) => (
                <option key={`correct-${index}`} value={index}>
                  {option}
                </option>
              ))}
            </select>
            <button type="button" className="lp-btn-secondary" onClick={handleAddPollOption}>
              Add another option
            </button>
            <button
              type="button"
              className="lp-btn-secondary"
              onClick={handleCreatePoll}
              disabled={!pollQuestion.trim() || pollOptionsTrimmed.length < 2}
            >
              Create Poll
            </button>
          </div>
        </div>

        <div className="lp-card lp-end-live">
          <div className="lp-card__header">
            <h3>End live session</h3>
          </div>
          <p>Stop your stream and return to setup.</p>
          <button type="button" className="lp-btn-primary" onClick={onEndLive}>
            End Live
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveProducerDashboard;
