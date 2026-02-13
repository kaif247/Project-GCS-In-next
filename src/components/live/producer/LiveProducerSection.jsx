import React, { useCallback, useEffect, useRef, useState } from 'react';
import ToggleButton from '../../ToggleButton';
import LiveProducerSidebar from './LiveProducerSidebar';
import LiveProducerSetup from './LiveProducerSetup';
import LiveProducerDashboard from './LiveProducerDashboard';

const LiveProducerSection = ({ onRequestClose, onLiveStateChange }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const isMountedRef = useRef(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [activeSection, setActiveSection] = useState('setup');
  const [selectedVideoSource, setSelectedVideoSource] = useState('webcam');
  const [postDetails, setPostDetails] = useState({
    title: '',
    message: '',
    shareToStory: true,
  });

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const requestMedia = useCallback(async () => {
    setIsRequesting(true);
    setPermissionDenied(false);
    if (!navigator?.mediaDevices?.getUserMedia) {
      setPermissionDenied(true);
      setPermissionGranted(false);
      setIsRequesting(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (!isMountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setPermissionGranted(true);
    } catch (error) {
      setPermissionDenied(true);
      setPermissionGranted(false);
    } finally {
      setIsRequesting(false);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
      if (mobile) setIsSidebarOpen(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    const start = async () => {
      await requestMedia();
    };

    start();
    return () => {
      isMountedRef.current = false;
      stopStream();
    };
  }, [requestMedia, stopStream]);

  useEffect(() => {
    if (onLiveStateChange) onLiveStateChange(isLive);
  }, [isLive, onLiveStateChange]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      stopStream();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [stopStream]);

  const handleScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      stopStream();
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setPermissionGranted(true);
      setPermissionDenied(false);
      setSelectedVideoSource('screen');
    } catch (error) {
      // Ignore if user cancels screen share
    }
  };

  const handleGoLive = () => {
    if (permissionDenied || !permissionGranted || selectedVideoSource === 'software') return;
    setIsLive(true);
    setActiveSection('dashboard');
  };

  const handleEndLive = () => {
    setIsLive(false);
    setActiveSection('setup');
    stopStream();
    setPermissionGranted(false);
    setPermissionDenied(false);
    setSelectedVideoSource('webcam');
  };

  const isGoLiveDisabled =
    permissionDenied || !permissionGranted || selectedVideoSource === 'software';

  const handleVideoSourceChange = useCallback(
    (source) => {
      setSelectedVideoSource(source);
      if (source === 'webcam') {
        requestMedia();
      } else if (source === 'software') {
        stopStream();
        setPermissionGranted(false);
        setPermissionDenied(false);
      }
    },
    [requestMedia, stopStream]
  );

  const handleBack = () => {
    if (onRequestClose) onRequestClose();
  };

  const hasActiveStream =
    permissionGranted && selectedVideoSource !== 'software' && !permissionDenied;

  return (
    <section className="live-producer">
      {isMobile && (
        <ToggleButton
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
          label="Toggle live producer sidebar"
        />
      )}

      <div className="live-producer-layout">
        {isMobile && isSidebarOpen && (
          <button
            type="button"
            className="live-producer-backdrop"
            aria-label="Close live producer sidebar"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <div className={`live-producer-sidebar-wrap ${isSidebarOpen ? 'open' : ''}`}>
          <LiveProducerSidebar
            permissionGranted={permissionGranted}
            permissionDenied={permissionDenied}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onGoLive={handleGoLive}
            isGoLiveDisabled={isGoLiveDisabled}
            isLive={isLive}
            onBack={handleBack}
          />
        </div>

        <div className="live-producer-main">
          {activeSection === 'dashboard' || isLive ? (
            <LiveProducerDashboard
              videoRef={videoRef}
              hasActiveStream={hasActiveStream}
              onEndLive={handleEndLive}
            />
          ) : (
            <LiveProducerSetup
              videoRef={videoRef}
              isRequesting={isRequesting}
              permissionGranted={permissionGranted}
              permissionDenied={permissionDenied}
              selectedVideoSource={selectedVideoSource}
              onVideoSourceChange={handleVideoSourceChange}
              onScreenShare={handleScreenShare}
              postDetails={postDetails}
              onPostDetailsChange={setPostDetails}
            />
          )}
        </div>
      </div>

    </section>
  );
};

export default LiveProducerSection;
