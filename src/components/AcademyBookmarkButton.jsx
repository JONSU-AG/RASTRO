import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toggleSaveMaterialItem, isItemSavedInList } from '../lib/savedHelper';

export const AcademyBookmarkButton = ({ item, size = 'normal', showText = true, onToggle = null, saveTypeLabel = null }) => {
  const { user } = useAuth();
  const itemId = item?.id || null;
  const [isSaved, setIsSaved] = useState(() => isItemSavedInList(itemId));

  useEffect(() => {
    const handleUpdate = () => {
      setIsSaved(isItemSavedInList(itemId));
    };
    window.addEventListener('rumbo_saved_updated', handleUpdate);
    return () => window.removeEventListener('rumbo_saved_updated', handleUpdate);
  }, [itemId]);

  const handleClick = async (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!item || !itemId) return;
    const newState = await toggleSaveMaterialItem(user, item);
    setIsSaved(newState);
    if (onToggle) onToggle(newState);
  };

  const isSmall = size === 'small';

  const getDefaultLabel = () => {
    if (!saveTypeLabel) return isSaved ? 'Guardado' : 'Guardar';
    return isSaved ? `Guardado: ${saveTypeLabel}` : `Guardar ${saveTypeLabel}`;
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      onClick={handleClick}
      title={isSaved ? 'Quitar de Guardados' : 'Guardar'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: isSmall ? '5px 10px' : '7px 14px',
        borderRadius: '12px',
        border: isSaved ? '1.5px solid #F59E0B' : '1px solid var(--card-border)',
        background: isSaved ? 'rgba(245, 158, 11, 0.16)' : 'rgba(120, 120, 128, 0.08)',
        color: isSaved ? '#F59E0B' : 'var(--text-main)',
        fontSize: isSmall ? '0.78rem' : '0.85rem',
        fontWeight: 700,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: isSaved ? '0 2px 8px rgba(245, 158, 11, 0.25)' : 'none',
        whiteSpace: 'nowrap',
        flexShrink: 0
      }}
    >
      {isSaved ? (
        <BookmarkCheck size={isSmall ? 15 : 18} style={{ color: '#F59E0B' }} />
      ) : (
        <Bookmark size={isSmall ? 15 : 18} />
      )}
      {showText && (
        <span>{getDefaultLabel()}</span>
      )}
    </motion.button>
  );
};
