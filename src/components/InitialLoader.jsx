import React from 'react';

const InitialLoader = () => (
  <div className="initial-loader" role="status" aria-live="polite" aria-label="Loading">
    <div className="initial-loader__center">
      <img src="/icons/loader.png" alt="Loading" className="initial-loader__logo" />
    </div>
    <div className="initial-loader__footer">
      <div className="initial-loader__from">From</div>
      <img src="/GCS.png" alt="GCS" className="initial-loader__gcs" />
      <div className="initial-loader__name">Global Creole Society</div>
    </div>
  </div>
);

export default InitialLoader;
