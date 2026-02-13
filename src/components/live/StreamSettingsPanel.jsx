import React, { useMemo } from 'react';

const StreamSettingsPanel = ({
  latencyChoice,
  onLatencyChange,
  audience,
  onAudienceChange,
  embedLiveVideo,
  onEmbedLiveVideoChange,
  unpublishAfterEnd,
  onUnpublishAfterEndChange,
}) => {
  const isEmbedEnabled = audience === 'public';
  const latencyNote = useMemo(() => {
    if (latencyChoice === 'auto') return 'Normal latency selected';
    return '';
  }, [latencyChoice]);

  return (
    <section className="rounded-2xl border border-[#2b2f33] bg-[#222425] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
      <div className="mb-6 text-lg font-semibold">Stream settings</div>

      <div className="mb-6">
        <div className="text-sm font-semibold">Stream latency</div>
        <p className="mt-2 text-sm text-slate-300">
          Stream latency is the time delay between your camera capturing a moment and that moment
          being shown to viewers.
        </p>

        <fieldset className="mt-4 space-y-4">
          <legend className="sr-only">Stream latency options</legend>

          <label className="flex cursor-pointer gap-4 rounded-xl border border-transparent p-3 transition hover:border-[#30353b]">
            <div className="mt-1 h-4 w-4 rounded-full border border-slate-400">
              <div
                className={`h-full w-full rounded-full ${
                  latencyChoice === 'auto' ? 'bg-blue-500' : 'bg-transparent'
                }`}
              />
            </div>
            <div>
              <div className="text-sm font-semibold">Auto</div>
              <p className="text-sm text-slate-300">
                We&apos;ll choose the best latency for your broadcast to optimise stream quality.
              </p>
              {latencyNote ? (
                <p className="mt-1 text-xs text-slate-400">{latencyNote}</p>
              ) : null}
            </div>
            <input
              type="radio"
              name="latency"
              value="auto"
              className="sr-only"
              checked={latencyChoice === 'auto'}
              onChange={() => onLatencyChange('auto')}
            />
          </label>

          <label className="flex cursor-pointer gap-4 rounded-xl border border-transparent p-3 transition hover:border-[#30353b]">
            <div className="mt-1 h-4 w-4 rounded-full border border-slate-400">
              <div
                className={`h-full w-full rounded-full ${
                  latencyChoice === 'normal' ? 'bg-blue-500' : 'bg-transparent'
                }`}
              />
            </div>
            <div>
              <div className="text-sm font-semibold">Normal</div>
              <p className="text-sm text-slate-300">
                Recommended if you don&apos;t plan to interact with viewers. This option provides the
                best-quality stream.
              </p>
            </div>
            <input
              type="radio"
              name="latency"
              value="normal"
              className="sr-only"
              checked={latencyChoice === 'normal'}
              onChange={() => onLatencyChange('normal')}
            />
          </label>

          <label className="flex cursor-pointer gap-4 rounded-xl border border-transparent p-3 transition hover:border-[#30353b]">
            <div className="mt-1 h-4 w-4 rounded-full border border-slate-400">
              <div
                className={`h-full w-full rounded-full ${
                  latencyChoice === 'low' ? 'bg-blue-500' : 'bg-transparent'
                }`}
              />
            </div>
            <div>
              <div className="text-sm font-semibold">Low latency</div>
              <p className="text-sm text-slate-300">
                Recommended if you want to interact with viewers in near-real time. Viewers may
                experience minimal buffering.
              </p>
            </div>
            <input
              type="radio"
              name="latency"
              value="low"
              className="sr-only"
              checked={latencyChoice === 'low'}
              onChange={() => onLatencyChange('low')}
            />
          </label>
        </fieldset>

        <p className="mt-4 text-sm text-slate-400">
          You cannot change the latency settings once a broadcast has begun, so please make any
          changes beforehand. We automatically apply any changes to all future broadcasts, but you
          can update them at any time to fit your needs.
        </p>
      </div>

      <div className="border-t border-[#30353b] pt-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Embed live video</div>
            <p className="text-sm text-slate-300">
              Insert your live video on any website outside of Facebook.
            </p>
            {!isEmbedEnabled && (
              <p className="mt-1 text-xs text-slate-400">
                Change audience to Public to enable this feature.
              </p>
            )}
          </div>
          <label className="relative inline-flex items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={embedLiveVideo}
              onChange={(event) => onEmbedLiveVideoChange(event.target.checked)}
              disabled={!isEmbedEnabled}
              aria-disabled={!isEmbedEnabled}
            />
            <span
              className={`h-6 w-11 rounded-full border border-[#3a3f44] transition ${
                isEmbedEnabled ? 'bg-[#2d3136]' : 'bg-[#2a2d30]'
              } peer-checked:bg-blue-600 peer-disabled:opacity-60`}
            />
            <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
          </label>
        </div>

        <div className="mb-6">
          <div className="sr-only">Audience</div>
          <div className="inline-flex overflow-hidden rounded-full border border-[#2f3338] bg-[#1c1f22] text-xs font-semibold">
            <button
              type="button"
              className={`px-3 py-1.5 ${
                audience === 'friends' ? 'bg-[#2c3136] text-white' : 'text-slate-300'
              }`}
              onClick={() => onAudienceChange('friends')}
            >
              Friends
            </button>
            <button
              type="button"
              className={`px-3 py-1.5 ${
                audience === 'public' ? 'bg-[#2c3136] text-white' : 'text-slate-300'
              }`}
              onClick={() => onAudienceChange('public')}
            >
              Public
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#30353b] pt-6">
          <div>
            <div className="text-sm font-semibold">Unpublish after live video ends</div>
            <p className="text-sm text-slate-300">
              Unpublished posts are not visible to the public. Page admins can still see the
              unpublished post and their insights.
            </p>
          </div>
          <label className="relative inline-flex items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={unpublishAfterEnd}
              onChange={(event) => onUnpublishAfterEndChange(event.target.checked)}
            />
            <span className="h-6 w-11 rounded-full border border-[#3a3f44] bg-[#2d3136] transition peer-checked:bg-blue-600" />
            <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5" />
          </label>
        </div>
      </div>
    </section>
  );
};

export default StreamSettingsPanel;
