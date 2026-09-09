import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getDirectImageUrl } from '../lib/storageHelper';

export const ImageGalleryCarousel = ({
  images = [],
  alt = 'Foto de la publicación',
  onImageClick,
  maxHeight = '480px',
  aspectRatio = 'auto',
  autoPlay = false,
  autoPlayInterval = 4500,
  compact = false
}) => {
  // Normalize images array
  const rawList = Array.isArray(images) ? images : (images ? [images] : []);
  const normalizedImages = rawList
    .map(img => {
      if (!img) return null;
      if (typeof img === 'string') return img;
      return img.url || img.driveUrl || img.downloadUrl || null;
    })
    .filter(Boolean);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const isSwipingRef = useRef(false);

  const total = normalizedImages.length;

  useEffect(() => {
    if (currentIndex >= total && total > 0) {
      setCurrentIndex(0);
    }
  }, [total, currentIndex]);

  // Autoplay (optional, pauses on hover/touch)
  useEffect(() => {
    if (!autoPlay || total <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % total);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, total, isHovered, autoPlayInterval]);

  const handlePrev = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + total) % total);
  };

  const handleNext = (e) => {
    if (e) e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % total);
  };

  // Safe non-blocking touch handlers:
  // Never calls e.preventDefault() so native vertical scrolling remains 100% fluid!
  const handleTouchStart = (e) => {
    if (!e.touches || !e.touches[0]) return;
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now()
    };
    isSwipingRef.current = true;
  };

  const handleTouchEnd = (e) => {
    if (!isSwipingRef.current || !e.changedTouches || !e.changedTouches[0]) return;
    isSwipingRef.current = false;
    const touchEnd = e.changedTouches[0];
    const diffX = touchEnd.clientX - touchStartRef.current.x;
    const diffY = touchEnd.clientY - touchStartRef.current.y;
    const timeDiff = Date.now() - touchStartRef.current.time;

    // Only recognize horizontal swipe if horizontal displacement is significantly greater than vertical
    if (Math.abs(diffX) > 36 && Math.abs(diffX) > Math.abs(diffY) * 1.3 && timeDiff < 600) {
      if (diffX > 0) {
        handlePrev(e);
      } else {
        handleNext(e);
      }
    }
  };

  if (total === 0) return null;

  // Single Image Mode: Clean render without carousel controls
  if (total === 1) {
    const singleUrl = normalizedImages[0];
    return (
      <div
        style={{
          borderRadius: compact ? '12px' : '18px',
          overflow: 'hidden',
          border: '1px solid var(--card-border, rgba(120,120,128,0.2))',
          background: 'rgba(0,0,0,0.03)',
          cursor: onImageClick ? 'pointer' : 'default',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'pan-y'
        }}
        onClick={() => onImageClick && onImageClick(singleUrl, 0)}
      >
        <img
          src={getDirectImageUrl(singleUrl)}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          draggable={false}
          style={{
            width: '100%',
            maxHeight: maxHeight,
            aspectRatio: aspectRatio,
            objectFit: 'contain',
            display: 'block',
            borderRadius: compact ? '12px' : '18px',
            touchAction: 'pan-y'
          }}
          onError={(e) => {
            const fallback = singleUrl;
            if (e.target.src !== fallback) {
              e.target.src = fallback;
            }
          }}
        />
      </div>
    );
  }

  // Multi-Image Gallery Carousel Mode
  const activeUrl = normalizedImages[currentIndex];

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'relative',
        borderRadius: compact ? '14px' : '20px',
        overflow: 'hidden',
        border: '1px solid var(--card-border, rgba(120,120,128,0.2))',
        background: 'rgba(0,0,0,0.04)',
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto',
        userSelect: 'none',
        touchAction: 'pan-y'
      }}
    >
      {/* Active Image Display */}
      <div
        onClick={() => onImageClick && onImageClick(activeUrl, currentIndex)}
        style={{
          cursor: onImageClick ? 'pointer' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: compact ? '180px' : '240px',
          maxHeight: maxHeight,
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
          touchAction: 'pan-y'
        }}
      >
        <img
          key={`gallery-img-${currentIndex}`}
          src={getDirectImageUrl(activeUrl)}
          alt={`${alt} (${currentIndex + 1}/${total})`}
          loading="lazy"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          draggable={false}
          style={{
            width: '100%',
            maxHeight: maxHeight,
            aspectRatio: aspectRatio,
            objectFit: 'contain',
            display: 'block',
            borderRadius: compact ? '14px' : '20px',
            touchAction: 'pan-y',
            transition: 'opacity 0.2s ease'
          }}
          onError={(e) => {
            if (e.target.src !== activeUrl) {
              e.target.src = activeUrl;
            }
          }}
        />
      </div>

      {/* Navigation Buttons (Left & Right) */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Anterior"
        style={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%)',
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.4)',
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'all 0.15s ease'
        }}
      >
        <ChevronLeft size={20} />
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Siguiente"
        style={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.4)',
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          transition: 'all 0.15s ease'
        }}
      >
        <ChevronRight size={20} />
      </button>

      {/* Position Indicators: Minimalist Dots */}
      <div
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '20px',
          background: 'rgba(0,0,0,0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 10,
          pointerEvents: 'auto'
        }}
      >
        {normalizedImages.map((_, idx) => (
          <button
            key={`dot-${idx}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex(idx);
            }}
            aria-label={`Ir a foto ${idx + 1}`}
            style={{
              width: idx === currentIndex ? '16px' : '6px',
              height: '6px',
              borderRadius: '99px',
              border: 'none',
              padding: 0,
              background: idx === currentIndex ? '#FFFFFF' : 'rgba(255,255,255,0.45)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          />
        ))}
      </div>
    </div>
  );
};
