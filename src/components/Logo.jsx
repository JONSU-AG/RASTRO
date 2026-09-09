import React, { useState } from 'react';

export const Logo = ({ className = '', height = 36 }) => {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none'
      }}
      className={className}
    >
      {!imageFailed ? (
        <img
          src="./astrologo.png"
          alt="RASTRO"
          style={{
            height: `${height}px`,
            width: 'auto',
            maxHeight: '56px',
            objectFit: 'contain',
            display: 'block'
          }}
          onError={(e) => {
            if (!e.currentTarget.dataset.fallback) {
              e.currentTarget.dataset.fallback = '1';
              e.currentTarget.src = './assets/rastro-logo-16-9.png';
            } else {
              setImageFailed(true);
            }
          }}
        />
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '900', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
          <img
            src="./applogo.png"
            alt="RASTRO"
            style={{ width: `${height}px`, height: `${height}px`, borderRadius: '8px', objectFit: 'contain' }}
            onError={(e) => {
              e.currentTarget.src = './assets/rastro-pwa-icon.png';
            }}
          />
          <span>RASTRO</span>
        </div>
      )}
    </div>
  );
};
