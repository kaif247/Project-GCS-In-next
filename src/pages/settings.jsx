import React, { useState } from 'react';
import StreamSettingsPanel from '../components/live/StreamSettingsPanel';
import CameraControlsPanel from '../components/live/CameraControlsPanel';

const SettingsPage = () => {
  const [latencyChoice, setLatencyChoice] = useState('auto');
  const [audience, setAudience] = useState('friends');
  const [embedLiveVideo, setEmbedLiveVideo] = useState(false);
  const [unpublishAfterEnd, setUnpublishAfterEnd] = useState(false);
  const [selectedCameraSource, setSelectedCameraSource] = useState(null);
  const [selectedMicrophoneSource, setSelectedMicrophoneSource] = useState(null);

  return (
    <main className="min-h-screen bg-[#151515] text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.6fr)]">
          <StreamSettingsPanel
            latencyChoice={latencyChoice}
            onLatencyChange={setLatencyChoice}
            audience={audience}
            onAudienceChange={setAudience}
            embedLiveVideo={embedLiveVideo}
            onEmbedLiveVideoChange={setEmbedLiveVideo}
            unpublishAfterEnd={unpublishAfterEnd}
            onUnpublishAfterEndChange={setUnpublishAfterEnd}
          />
          <CameraControlsPanel
            selectedCameraSource={selectedCameraSource}
            onCameraSourceChange={setSelectedCameraSource}
            selectedMicrophoneSource={selectedMicrophoneSource}
            onMicrophoneSourceChange={setSelectedMicrophoneSource}
            onScreenShare={() => {}}
          />
        </div>
      </div>
    </main>
  );
};

export default SettingsPage;
