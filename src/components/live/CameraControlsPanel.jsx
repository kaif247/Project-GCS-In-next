import React from 'react';

const CameraControlsPanel = ({
  selectedCameraSource,
  onCameraSourceChange,
  selectedMicrophoneSource,
  onMicrophoneSourceChange,
  onScreenShare,
}) => {
  const cameraSources = [
    { id: 'default-camera', label: 'Default camera' },
    { id: 'usb-camera', label: 'USB camera' },
  ];

  const microphoneSources = [
    { id: 'default-mic', label: 'Default microphone' },
    { id: 'usb-mic', label: 'USB microphone' },
  ];

  return (
    <aside className="h-fit rounded-2xl border border-[#2b2f33] bg-[#222425] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
      <div className="mb-3 text-sm font-semibold">Camera controls</div>
      <p className="mb-5 text-sm text-slate-300">
        Check that your camera and microphone inputs are properly working before going live.
      </p>

      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-xl bg-[#2b2f33] px-3 py-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1e2124] text-slate-200">
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M23 7l-7 5 7 5V7z" />
              <rect x="1" y="5" width="15" height="14" rx="2" />
            </svg>
          </span>
          <select
            className="w-full bg-transparent text-sm text-slate-100 outline-none"
            value={selectedCameraSource || ''}
            onChange={(event) => onCameraSourceChange(event.target.value || null)}
            aria-label="Select a media source"
          >
            <option value="">Select a media source</option>
            {cameraSources.map((source) => (
              <option key={source.id} value={source.id}>
                {source.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-[#2b2f33] px-3 py-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1e2124] text-slate-200">
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 1v22" />
              <path d="M8 6a4 4 0 0 1 8 0v6a4 4 0 0 1-8 0z" />
              <path d="M5 11a7 7 0 0 0 14 0" />
            </svg>
          </span>
          <select
            className="w-full bg-transparent text-sm text-slate-100 outline-none"
            value={selectedMicrophoneSource || ''}
            onChange={(event) => onMicrophoneSourceChange(event.target.value || null)}
            aria-label="Select a media source"
          >
            <option value="">Select a media source</option>
            {microphoneSources.map((source) => (
              <option key={source.id} value={source.id}>
                {source.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#353a40] bg-[#2b2f33] px-4 py-2 text-sm font-semibold text-slate-100 transition"
          onClick={onScreenShare}
        >
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8" />
            <path d="M12 17v4" />
          </svg>
          Start screen share
        </button>
      </div>
    </aside>
  );
};

export default CameraControlsPanel;
