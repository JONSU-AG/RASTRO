import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, UserCheck, Search, Loader2, ExternalLink, Sparkles } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FollowButton } from './FollowButton';

export const FollowersFollowingModal = ({
  isOpen,
  onClose,
  targetUid,
  targetName = 'Estudiante',
  initialTab = 'followers'
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab); // 'followers' | 'following'
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [loadingFollowers, setLoadingFollowers] = useState(true);
  const [loadingFollowing, setLoadingFollowing] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfilesCache, setUserProfilesCache] = useState({});

  // Reset tab when opening with a specified initialTab
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setSearchQuery('');
    }
  }, [isOpen, initialTab]);

  // Bloquear scroll de fondo mientras el modal esté abierto
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // 1. Escuchar Seguidores (donde followedUid === targetUid)
  useEffect(() => {
    if (!targetUid || !isOpen) return;

    setLoadingFollowers(true);
    const qFollowers = query(
      collection(db, 'siguiendo'),
      where('followedUid', '==', targetUid)
    );

    const unsubFollowers = onSnapshot(qFollowers, async (snapshot) => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setFollowers(items);
      setLoadingFollowers(false);

      // Fetch user profile details for items missing cache
      items.forEach(async (item) => {
        const uid = item.followerUid;
        if (uid && !userProfilesCache[uid]) {
          try {
            const userSnap = await getDoc(doc(db, 'usuarios', uid));
            if (userSnap.exists()) {
              setUserProfilesCache(prev => ({ ...prev, [uid]: userSnap.data() }));
            }
          } catch (e) {
            // quiet fallback
          }
        }
      });
    }, (err) => {
      console.warn('Error fetching followers:', err);
      setLoadingFollowers(false);
    });

    return () => unsubFollowers();
  }, [targetUid, isOpen]);

  // 2. Escuchar Seguidos (donde followerUid === targetUid)
  useEffect(() => {
    if (!targetUid || !isOpen) return;

    setLoadingFollowing(true);
    const qFollowing = query(
      collection(db, 'siguiendo'),
      where('followerUid', '==', targetUid)
    );

    const unsubFollowing = onSnapshot(qFollowing, async (snapshot) => {
      const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setFollowing(items);
      setLoadingFollowing(false);

      // Fetch user profile details for items missing cache
      items.forEach(async (item) => {
        const uid = item.followedUid;
        if (uid && !userProfilesCache[uid]) {
          try {
            const userSnap = await getDoc(doc(db, 'usuarios', uid));
            if (userSnap.exists()) {
              setUserProfilesCache(prev => ({ ...prev, [uid]: userSnap.data() }));
            }
          } catch (e) {
            // quiet fallback
          }
        }
      });
    }, (err) => {
      console.warn('Error fetching following:', err);
      setLoadingFollowing(false);
    });

    return () => unsubFollowing();
  }, [targetUid, isOpen]);

  if (!isOpen) return null;

  const currentList = activeTab === 'followers' ? followers : following;
  const isLoading = activeTab === 'followers' ? loadingFollowers : loadingFollowing;

  // Normalizar y enriquecer usuarios con la caché
  const enrichedList = currentList.map(item => {
    const uid = activeTab === 'followers' ? item.followerUid : item.followedUid;
    const profile = userProfilesCache[uid] || {};
    return {
      uid,
      displayName: profile.displayName || (activeTab === 'followers' ? item.followerName : item.followedName) || 'Estudiante',
      photoURL: profile.photoURL || null,
      carrera: profile.carrera || '',
      universidad: profile.universidad || '',
      academicStatus: profile.academicStatus || '',
      isAlly: profile.isAlly || false
    };
  });

  const filteredList = enrichedList.filter(u => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (u.displayName && u.displayName.toLowerCase().includes(q)) ||
      (u.carrera && u.carrera.toLowerCase().includes(q)) ||
      (u.universidad && u.universidad.toLowerCase().includes(q))
    );
  });

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          padding: '12px'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            width: '100%',
            maxWidth: '520px',
            maxHeight: '86vh',
            background: 'var(--card-bg, #1e1e24)',
            border: '1.5px solid var(--card-border, rgba(255, 255, 255, 0.12))',
            borderRadius: '26px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.45)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 18px 12px',
              borderBottom: '1px solid var(--card-border, rgba(255, 255, 255, 0.08))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px'
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.12rem',
                  fontWeight: 800,
                  color: 'var(--text-main, #ffffff)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                <Users size={18} style={{ color: 'var(--accent-color, #007AFF)', flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Comunidad de {targetName}
                </span>
              </h2>
              <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary, #94a3b8)', display: 'block', marginTop: '2px' }}>
                Visualiza seguidores y seguidos
              </span>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(120, 120, 128, 0.12)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-secondary, #94a3b8)',
                transition: 'all 0.15s ease',
                flexShrink: 0
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Segmented Control con soporte responsive (texto y abajo el svg en móvil) */}
          <div style={{ padding: '12px 16px 8px' }}>
            <div
              style={{
                display: 'flex',
                background: 'rgba(120, 120, 128, 0.12)',
                padding: '4px',
                borderRadius: '16px',
                border: '1px solid var(--card-border, rgba(255, 255, 255, 0.08))',
                gap: '6px'
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('followers')}
                className="modal-tab-btn"
                style={{
                  background: activeTab === 'followers' ? 'var(--accent-color, #007AFF)' : 'transparent',
                  color: activeTab === 'followers' ? '#ffffff' : 'var(--text-main, #e2e8f0)',
                  boxShadow: activeTab === 'followers' ? '0 4px 12px rgba(0, 122, 255, 0.35)' : 'none'
                }}
              >
                <span className="tab-text">
                  <span>Seguidores</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      background: activeTab === 'followers' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(120, 120, 128, 0.2)',
                      color: activeTab === 'followers' ? '#ffffff' : 'var(--text-secondary, #94a3b8)'
                    }}
                  >
                    {followers.length}
                  </span>
                </span>
                <span className="tab-svg">
                  <Users size={16} />
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('following')}
                className="modal-tab-btn"
                style={{
                  background: activeTab === 'following' ? 'var(--accent-color, #007AFF)' : 'transparent',
                  color: activeTab === 'following' ? '#ffffff' : 'var(--text-main, #e2e8f0)',
                  boxShadow: activeTab === 'following' ? '0 4px 12px rgba(0, 122, 255, 0.35)' : 'none'
                }}
              >
                <span className="tab-text">
                  <span>Seguidos</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      background: activeTab === 'following' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(120, 120, 128, 0.2)',
                      color: activeTab === 'following' ? '#ffffff' : 'var(--text-secondary, #94a3b8)'
                    }}
                  >
                    {following.length}
                  </span>
                </span>
                <span className="tab-svg">
                  <UserCheck size={16} />
                </span>
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div style={{ padding: '6px 16px 10px' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary, #94a3b8)'
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Buscar en ${activeTab === 'followers' ? 'seguidores' : 'seguidos'}...`}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '9px 12px 9px 38px',
                  borderRadius: '12px',
                  border: '1px solid var(--card-border, rgba(255, 255, 255, 0.12))',
                  background: 'rgba(120, 120, 128, 0.08)',
                  color: 'var(--text-main, #ffffff)',
                  fontSize: '0.86rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* List Content */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '0 20px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            {isLoading ? (
              <div style={{ padding: '50px 20px', textAlign: 'center', color: 'var(--accent-color)' }}>
                <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 8px' }} />
                <p style={{ margin: 0, fontSize: '0.86rem', color: 'var(--text-secondary)' }}>Cargando conexiones...</p>
              </div>
            ) : filteredList.length === 0 ? (
              <div style={{ padding: '50px 20px', textAlign: 'center' }}>
                <Sparkles size={36} style={{ color: 'var(--text-secondary)', opacity: 0.5, margin: '0 auto 10px' }} />
                <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)', fontSize: '0.94rem' }}>
                  {searchQuery.trim()
                    ? 'No se encontraron resultados'
                    : activeTab === 'followers'
                      ? 'Aún no tiene seguidores'
                      : 'Aún no sigue a ningún estudiante'}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  {searchQuery.trim()
                    ? 'Prueba con otro término de búsqueda.'
                    : activeTab === 'followers'
                      ? 'Cuando otros estudiantes sigan este perfil, aparecerán listados aquí.'
                      : 'Cuando este usuario comience a seguir a otros, aparecerán listados aquí.'}
                </p>
              </div>
            ) : (
              filteredList.map((itemUser) => {
                const isSelf = user?.uid === itemUser.uid;

                return (
                  <div
                    key={itemUser.uid}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '16px',
                      background: 'rgba(120, 120, 128, 0.06)',
                      border: '1px solid var(--card-border, rgba(255, 255, 255, 0.08))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {/* User info clickable to profile */}
                    <div
                      onClick={() => {
                        onClose();
                        navigate(`/usuario/${itemUser.uid}`);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        flex: 1,
                        minWidth: 0
                      }}
                    >
                      {/* Avatar */}
                      {itemUser.photoURL ? (
                        <img
                          src={itemUser.photoURL}
                          alt={itemUser.displayName}
                          referrerPolicy="no-referrer"
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: '1.5px solid var(--accent-color, #007AFF)',
                            flexShrink: 0
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #007AFF, #00C6FF)',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '1.1rem',
                            flexShrink: 0
                          }}
                        >
                          {(itemUser.displayName || 'U')[0].toUpperCase()}
                        </div>
                      )}

                      {/* Names & metadata */}
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              fontWeight: 800,
                              fontSize: '0.9rem',
                              color: 'var(--text-main, #ffffff)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {itemUser.displayName}
                          </span>
                          {itemUser.isAlly && (
                            <span
                              style={{
                                fontSize: '0.66rem',
                                fontWeight: 800,
                                padding: '1px 6px',
                                borderRadius: '6px',
                                background: 'rgba(52, 168, 83, 0.18)',
                                color: '#34A853',
                                border: '1px solid rgba(52, 168, 83, 0.3)'
                              }}
                            >
                              🌟 Aliado
                            </span>
                          )}
                        </div>

                        {itemUser.carrera && (
                          <div
                            style={{
                              fontSize: '0.76rem',
                              color: 'var(--accent-color, #007AFF)',
                              fontWeight: 600,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {itemUser.carrera}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions: Follow / Ver Perfil */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      {!isSelf && user && (
                        <FollowButton
                          targetUid={itemUser.uid}
                          targetName={itemUser.displayName}
                          size="compact"
                        />
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          navigate(`/usuario/${itemUser.uid}`);
                        }}
                        title="Ir al perfil"
                        style={{
                          padding: '6px 10px',
                          borderRadius: '10px',
                          border: '1px solid var(--card-border, rgba(255, 255, 255, 0.12))',
                          background: 'rgba(120, 120, 128, 0.1)',
                          color: 'var(--text-main, #ffffff)',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
