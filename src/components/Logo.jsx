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
          e.currentTarget.onerror = null;
          e.currentTarget.src = './applogo.png';
        }}
      />
    </div>
  );
};
