import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export const SimuladorSelect = ({
  value,
  onChange,
  options = [],
  placeholder = 'Seleccionar...',
  icon = null,
  style = {},
  buttonStyle = {},
  menuStyle = {},
  ariaLabel
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize options array: support both strings and { value, label }
  const normalizedOptions = options.map(opt => {
    if (typeof opt === 'object' && opt !== null) {
      return { 
        value: String(opt.value !== undefined ? opt.value : opt.label), 
        label: String(opt.label || opt.value), 
        icon: opt.icon || null 
      };
    }
    return { value: String(opt), label: String(opt), icon: null };
  });

  const selectedOption = normalizedOptions.find(opt => opt.value === String(value)) || normalizedOptions[0];

  // Cerrar al hacer clic fuera o presionar Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-block',
        ...style
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={ariaLabel || selectedOption?.label}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: '10px 14px',
          borderRadius: '14px',
          border: isOpen ? '1.5px solid var(--accent-color, #007AFF)' : '1.5px solid var(--card-border)',
          background: 'var(--card-bg, #ffffff)',
          color: 'var(--text-main, #0F172A)',
          fontSize: '0.85rem',
          fontWeight: 700,
          cursor: 'pointer',
          outline: 'none',
          boxShadow: isOpen ? '0 0 0 3px rgba(0, 122, 255, 0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
          transition: 'all 0.18s ease',
          boxSizing: 'border-box',
          textAlign: 'left',
          ...buttonStyle
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1, overflow: 'hidden' }}>
          {icon && <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0, opacity: 0.75 }}>{icon}</span>}
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {selectedOption?.label || placeholder}
          </span>
        </div>

        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: 'var(--text-secondary)' }}
        >
          <ChevronDown size={15} />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              minWidth: '100%',
              width: 'max-content',
              maxWidth: '340px',
              zIndex: 1000,
              background: 'var(--card-bg, #ffffff)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1.5px solid var(--card-border)',
              borderRadius: '16px',
              padding: '6px',
              boxShadow: '0 12px 36px rgba(0,0,0,0.25), 0 4px 14px rgba(0,0,0,0.1)',
              maxHeight: '260px',
              overflowY: 'auto',
              boxSizing: 'border-box',
              ...menuStyle
            }}
          >
            {normalizedOptions.map((opt) => {
              const isSelected = opt.value === String(value);

              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isSelected ? 'rgba(0, 122, 255, 0.12)' : 'transparent',
                    color: isSelected ? 'var(--accent-color, #007AFF)' : 'var(--text-main)',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 800 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.12s ease',
                    boxSizing: 'border-box',
                    marginBottom: '2px'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'rgba(120, 120, 128, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {opt.label}
                  </span>
                  {isSelected && (
                    <Check size={14} strokeWidth={2.5} style={{ flexShrink: 0, color: 'var(--accent-color, #007AFF)' }} />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
