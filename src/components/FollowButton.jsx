import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, UserPlus, Check, Loader2 } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export const FollowButton = ({
  targetUid,
  targetName = '',
  size = 'compact', // 'compact' | 'normal'
  onNotice
}) => {
  const { user } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.uid || !targetUid || user.uid === targetUid) {
      setIsFollowing(false);
      return;
    }

    const fid = `${user.uid}_${targetUid}`;
    const ref = doc(db, 'siguiendo', fid);
    const unsub = onSnapshot(
      ref,
      (snap) => setIsFollowing(snap.exists()),
      (err) => console.warn('FollowButton snapshot notice:', err?.message)
    );

    return () => unsub();
  }, [user?.uid, targetUid]);

  // If viewing own post or no target, don't show follow button
  if (!targetUid || (user && user.uid === targetUid)) {
    return null;
  }

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      if (onNotice) {
        onNotice('Inicia sesión', 'Debes iniciar sesión para seguir a este usuario y recibir avisos de sus aportes.');
      } else {
        alert('Debes iniciar sesión para seguir a este usuario y recibir notificaciones cuando suba material.');
      }
      return;
    }

    setLoading(true);
    const fid = `${user.uid}_${targetUid}`;
    const willFollow = !isFollowing;
    setIsFollowing(willFollow); // Optimistic

    try {
      if (willFollow) {
        await setDoc(doc(db, 'siguiendo', fid), {
          followerUid: user.uid,
          followerName: user.displayName || user.email || 'Estudiante',
          followedUid: targetUid,
          followedName: targetName || 'Usuario',
          createdAt: new Date().toISOString()
        });
      } else {
        await deleteDoc(doc(db, 'siguiendo', fid));
      }
    } catch (err) {
      setIsFollowing(!willFollow); // Revert on failure
      console.error('Error toggling follow:', err);
      if (onNotice) onNotice('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const isCompact = size === 'compact';

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggle}
      disabled={loading}
      title={isFollowing ? `Siguiendo a ${targetName || 'este usuario'}. Clic para dejar de seguir` : `Seguir a ${targetName || 'este usuario'}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: isCompact ? '3px' : '6px',
        padding: isCompact ? '2px 8px' : '7px 14px',
        borderRadius: '99px',
        border: isFollowing
          ? '1px solid rgba(16, 185, 129, 0.4)'
          : '1px solid rgba(0, 122, 255, 0.35)',
        background: isFollowing
          ? 'rgba(16, 185, 129, 0.12)'
          : 'rgba(0, 122, 255, 0.1)',
        color: isFollowing
          ? '#10B981'
          : 'var(--accent-color, #007AFF)',
        fontWeight: 800,
        fontSize: isCompact ? '0.70rem' : '0.82rem',
        cursor: loading ? 'wait' : 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        verticalAlign: 'middle',
        boxShadow: isFollowing ? 'none' : '0 2px 6px rgba(0, 122, 255, 0.12)',
        transition: 'all 0.18s ease'
      }}
    >
      {loading ? (
        <Loader2 size={isCompact ? 10 : 13} className="animate-spin" />
      ) : isFollowing ? (
        <>
          <Check size={isCompact ? 11 : 14} style={{ strokeWidth: 3 }} />
          <span>Siguiendo</span>
        </>
      ) : (
        <>
          <Heart size={isCompact ? 10 : 13} style={{ fill: 'none' }} />
          <span>Seguir</span>
        </>
      )}
    </motion.button>
  );
};
