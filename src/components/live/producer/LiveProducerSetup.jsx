import React from 'react';

import {

  FaVideo,

  FaKey,

  FaInfoCircle,

  FaCamera,

  FaMicrophone,

  FaDesktop,

  FaUserFriends,

  FaMapMarkerAlt,

  FaSmile,

} from 'react-icons/fa';



const LiveProducerSetup = ({
  videoRef,
  isRequesting,
  permissionGranted,
  permissionDenied,
  selectedVideoSource,
  onVideoSourceChange,
  onScreenShare,
  postDetails,
  onPostDetailsChange,
  onGoLive,
  onBack,
  isGoLiveDisabled,
}) => {
  const showStream = permissionGranted && selectedVideoSource !== 'software' && !permissionDenied;



  return (

    <div className="lp-main-grid">

      <div className="lp-column">

        <div className="lp-card lp-preview-card">

          <div className="lp-preview">

            {showStream ? (

              <video ref={videoRef} autoPlay muted playsInline />

            ) : (

              <div className="lp-preview-placeholder">

                <FaVideo />

                <div className="lp-preview-title">

                  {permissionDenied

                    ? 'Camera access is blocked. Select Webcam to try again.'

                    : 'Connect a video source to go live'}

                </div>

                {isRequesting && <div className="lp-preview-sub">Requesting camera access...</div>}

              </div>

            )}

          </div>

          <div className="lp-event-logs">

            <span className="lp-event-logs__icon">OK</span>

            Event logs

          </div>

        </div>



        <div className="lp-card lp-video-source">

          <div className="lp-card__header">

            <h3>Select a video source</h3>

            <FaInfoCircle />

          </div>

          <div className="lp-source-grid">

            <button

              type="button"

              className={`lp-source-card ${selectedVideoSource === 'webcam' ? 'active' : ''}`}

              onClick={() => onVideoSourceChange('webcam')}

            >

              <div className="lp-source-icon"><FaCamera /></div>

              <span>Webcam</span>

            </button>

            <button

              type="button"

              className={`lp-source-card ${selectedVideoSource === 'software' ? 'active' : ''}`}

              onClick={() => onVideoSourceChange('software')}

            >

              <div className="lp-source-icon"><FaKey /></div>

              <span>Streaming software</span>

            </button>

          </div>

        </div>



        <div className="lp-card lp-controls">

          <div className="lp-card__header">

            <h3>Camera controls</h3>

          </div>

          <p>Check that your camera and microphone inputs are properly working before going live.</p>

          <div className="lp-control">

            <FaCamera />

            <select>

              <option>Select a media source</option>

            </select>

          </div>

          <div className="lp-control">

            <FaMicrophone />

            <select>

              <option>Select a media source</option>

            </select>

          </div>

          <button type="button" className="lp-btn-secondary lp-screen-share" onClick={onScreenShare}>

            <FaDesktop />

            Start screen share

          </button>

        </div>

      </div>



      <div className="lp-column">
        <div className="lp-card lp-post-details">
          <div className="lp-card__header">

            <h3>Add post details</h3>

          </div>

          <div className="lp-story-row">

            <div>

              <div className="lp-card__title">Share to story</div>

              <div className="lp-card__subtitle">Your live video will also be added to your story.</div>

            </div>

            <input

              type="checkbox"

              checked={postDetails.shareToStory}

              onChange={(e) =>

                onPostDetailsChange({ ...postDetails, shareToStory: e.target.checked })

              }

            />

          </div>



          <label>

            Title (optional)

            <input

              type="text"

              value={postDetails.title}

              onChange={(e) => onPostDetailsChange({ ...postDetails, title: e.target.value })}

              placeholder="Title (optional)"

            />

          </label>

          <label>

            Description

            <textarea

              rows="4"

              value={postDetails.message}

              onChange={(e) => onPostDetailsChange({ ...postDetails, message: e.target.value })}

              placeholder="Say something about your live video"

            />

          </label>

          <div className="lp-post-actions">
            <FaUserFriends />
            <FaMapMarkerAlt />
            <FaSmile />
          </div>
        </div>

        <div className="lp-setup-actions">
          <button type="button" className="lp-btn-secondary" onClick={onBack}>
            Back
          </button>
          <button
            type="button"
            className="lp-btn-primary"
            onClick={onGoLive}
            disabled={isGoLiveDisabled}
          >
            Go Live
          </button>
        </div>
      </div>
    </div>
  );
};


export default LiveProducerSetup;

