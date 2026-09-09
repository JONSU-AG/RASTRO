import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, MessageSquare, Heart, Sparkles, Trash2, ExternalLink, Megaphone, Info, Eye, ChevronDown, ChevronUp, Settings, Volume2, VolumeX, Smartphone, Play } from 'lucide-react';
import { db } from '../lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  getNotificationStatus, 
  requestSystemNotificationPermission, 
  disableSystemNotifications, 
  setNotificationSettings, 
  playNotificationSound, 
  triggerSystemNotification 
} from '../lib/notifications';

export const NotificationsModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeNotifTab, setActiveNotifTab] = useState('avisos'); // 'avisos' | 'normal' | 'ajustes'
  const [selectedNoticePopup, setSelectedNoticePopup] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState({});

  const listScrollRef = useRef(null);
  const prevIsOpenRef = useRef(false);

  // Bloquear scroll de fondo mientras el modal esté abierto
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Auto-switch to whichever tab contains the most recent notification whenever opening
  useEffect(() => {
    if (isOpen && !prevIsOpenRef.current) {
      if (notifications.length > 0) {
        const topItem = notifications[0];
        const isAvisos = topItem.type === 'admin_broadcast' || topItem.type === 'comunidad' || topItem.type === 'aviso' || topItem.recipientUid === 'all';
        setActiveNotifTab(isAvisos ? 'avisos' : 'normal');
      }
      setTimeout(() => {
        if (listScrollRef.current) {
          listScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 50);
    }
    prevIsOpenRef.current = isOpen;
  }, [isOpen, notifications]);

  // Configuración de notificaciones del dispositivo y sonido
  const [systemNotifState, setSystemNotifState] = useState(getNotificationStatus());
  const [testSuccessMsg, setTestSuccessMsg] = useState('');

  const refreshSystemStatus = () => {
    setSystemNotifState(getNotificationStatus());
  };

  const handleToggleSystemNotifications = async () => {
    if (systemNotifState.isEnabled) {
      disableSystemNotifications();
      refreshSystemStatus();
    } else {
      // Desbloquear audio en el gesto de usuario del móvil
      if (systemNotifState.soundEnabled) {
        playNotificationSound(systemNotifState.soundType);
      }
      const res = await requestSystemNotificationPermission();
      refreshSystemStatus();
      if (res.success) {
        // Disparar notificación con sonido PWA
        await triggerSystemNotification({
          title: '🔔 Notificaciones Activadas',
          body: 'Recibirás avisos de clases, simulacros y novedades en tu dispositivo.',
          data: { url: '/cursos' }
        });
      }
    }
  };

  const handleToggleSound = () => {
    const nextVal = !systemNotifState.soundEnabled;
    setNotificationSettings({ sound: nextVal });
    refreshSystemStatus();
    if (nextVal) {
      playNotificationSound(systemNotifState.soundType);
    }
  };

  const handleSelectSound = (type) => {
    setNotificationSettings({ soundType: type });
    refreshSystemStatus();
    playNotificationSound(type);
  };

  const handleSendTestNotification = async () => {
    setTestSuccessMsg('Enviando notificación de prueba...');
    if (systemNotifState.soundEnabled) {
      playNotificationSound(systemNotifState.soundType);
    }
    await triggerSystemNotification({
      title: '🎓 Rumbo - Aviso del Sistema',
      body: '¡Esta es una notificación de prueba en tu dispositivo con sonido!',
      data: { url: '/cursos' }
    });
    setTestSuccessMsg('¡Notificación enviada!');
    setTimeout(() => setTestSuccessMsg(''), 3000);
  };

  const toggleGroupExpand = (groupKey) => {
    setExpandedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  useEffect(() => {
    if (!user?.uid) return;

    try {
      const qUser = query(
        collection(db, 'notificaciones'),
        where('recipientUid', '==', user.uid)
      );

      const qAll = query(
        collection(db, 'notificaciones'),
        where('recipientUid', '==', 'all')
      );

      let userDocs = [];
      let allDocs = [];

      const updateMergedNotifications = () => {
        const docMap = new Map();
        [...userDocs, ...allDocs].forEach(d => docMap.set(d.id, d));
        const combined = Array.from(docMap.values());

        const clearedNotifsKey = `rumbo_cleared_notifs_${user?.uid || 'guest'}`;
        const clearedAvisosKey = `rumbo_cleared_avisos_${user?.uid || 'guest'}`;
        const clearedNotifsTimestamp = parseInt(localStorage.getItem(clearedNotifsKey) || '0', 10);
        const clearedAvisosTimestamp = parseInt(localStorage.getItem(clearedAvisosKey) || '0', 10);

        const isAvisos = (n) => n.type === 'admin_broadcast' || n.type === 'comunidad' || n.type === 'aviso' || n.recipientUid === 'all';

        const filtered = combined.filter(n => {
          const time = n.createdAt?.toMillis ? n.createdAt.toMillis() : (n.timestamp || 0);
          if (isAvisos(n)) {
            return time > clearedAvisosTimestamp;
          }
          return time > clearedNotifsTimestamp;
        });

        // Sort by most recent first
        filtered.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.timestamp || 0);
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.timestamp || 0);
          return timeB - timeA;
        });

        setNotifications(filtered);
        setUnreadCount(filtered.filter(n => !n.read).length);
      };

      const unsubUser = onSnapshot(qUser, (snapshot) => {
        userDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        updateMergedNotifications();
      }, (err) => {
        console.warn("User notifications listener error:", err);
      });

      const unsubAll = onSnapshot(qAll, (snapshot) => {
        allDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        updateMergedNotifications();
      }, (err) => {
        console.warn("All notifications listener error:", err);
      });

      return () => {
        unsubUser();
        unsubAll();
      };
    } catch (e) {
      console.warn("Could not listen to notifications:", e);
    }
  }, [user?.uid]);

  const markAsRead = async (notifId) => {
    try {
      await updateDoc(doc(db, 'notificaciones', notifId), { read: true });
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  };

  const markAllAsRead = async () => {
    if (notifications.length === 0) return;
    try {
      const unread = notifications.filter(n => !n.read);
      for (const n of unread) {
        await updateDoc(doc(db, 'notificaciones', n.id), { read: true });
      }
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  const deleteNotification = async (notifId) => {
    try {
      await deleteDoc(doc(db, 'notificaciones', notifId));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const isAvisosItem = (n) => n.type === 'admin_broadcast' || n.type === 'comunidad' || n.type === 'aviso' || n.recipientUid === 'all';
  const avisosList = notifications.filter(isAvisosItem);
  const notifList = notifications.filter(n => !isAvisosItem(n));

  const clearAvisos = async () => {
    if (avisosList.length === 0) return;
    const now = Date.now();
    const clearedKey = `rumbo_cleared_avisos_${user?.uid || 'guest'}`;
    localStorage.setItem(clearedKey, String(now));

    const userDocsToDelete = avisosList.filter(n => n.id && n.recipientUid === user?.uid);
    setNotifications(prev => prev.filter(n => !isAvisosItem(n)));

    try {
      if (userDocsToDelete.length > 0) {
        await Promise.allSettled(userDocsToDelete.map(n => deleteDoc(doc(db, 'notificaciones', n.id))));
      }
    } catch (err) {
      console.error("Error deleting avisos:", err);
    }
  };

  const clearNotificaciones = async () => {
    if (notifList.length === 0) return;
    const now = Date.now();
    const clearedKey = `rumbo_cleared_notifs_${user?.uid || 'guest'}`;
    localStorage.setItem(clearedKey, String(now));

    const userDocsToDelete = notifList.filter(n => n.id && n.recipientUid === user?.uid);
    setNotifications(prev => prev.filter(isAvisosItem));

    try {
      if (userDocsToDelete.length > 0) {
        await Promise.allSettled(userDocsToDelete.map(n => deleteDoc(doc(db, 'notificaciones', n.id))));
      }
    } catch (err) {
      console.error("Error deleting notifications:", err);
    }
  };

  const handleNotificationClick = (n) => {
    markAsRead(n.id);

    // If it's an Admin community notice/broadcast -> Open popup modal without navigating!
    if (n.type === 'admin_broadcast' || n.type === 'comunidad' || n.recipientUid === 'all') {
      setSelectedNoticePopup(n);
      return;
    }

    onClose();

    // 1. Mensaje Directo Privado (WhatsApp-like) -> Ir a la página independiente /chats con ese remitente
    if (n.type === 'chat' || n.type === 'mensaje' || n.type === 'direct_message' || n.targetPath?.includes('tab=chat')) {
      const chatPartner = n.senderUid && n.senderUid !== user?.uid ? n.senderUid : n.chatUid;
      if (chatPartner) {
        navigate(`/chats?with=${chatPartner}`);
      } else {
        navigate('/chats');
      }
      return;
    }

    // 2. Publicación, Comentario o Reacción en Muro -> Ir exactamente a esa publicación
    if (n.postId || n.type === 'comment' || n.type === 'reaction' || n.type === 'wall_post' || n.type === 'post') {
      const wallProfile = n.profileUid || n.targetUid || user?.uid;
      const postHash = n.postId ? `#post-${n.postId}` : '';
      const postParam = n.postId ? `&postId=${n.postId}` : '';
      navigate(`/usuario/${wallProfile}?tab=muro${postParam}${postHash}`);
      return;
    }

    // 3. Material de Biblioteca
    if (n.type === 'material' || n.type === 'nuevo_material' || n.materialId) {
      navigate(`/biblioteca?materialId=${n.materialId || n.postId || n.targetId}`);
      return;
    }

    // 4. Ruta personalizada
    if (n.targetPath) {
      navigate(n.targetPath);
      return;
    }

    // 5. Fallback a perfil de usuario
    const targetUid = n.profileUid || n.targetUid || (n.senderUid && n.senderUid !== user?.uid ? n.senderUid : null);
    if (targetUid) {
      navigate(`/usuario/${targetUid}`);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Hace un momento';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100000,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px'
          }}
        >
          <motion.div
            initial={{ scale: 0.94, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 12 }}
            onClick={(e) => e.stopPropagation()}
            className="ios-glass-card"
            style={{
              width: '100%',
              maxWidth: '500px',
              maxHeight: '84vh',
              borderRadius: '26px',
              padding: '18px 16px 14px',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--card-bg, #ffffff)',
              color: 'var(--text-main, #1c1c1e)',
              border: '1.5px solid var(--card-border, rgba(120,120,128,0.2))',
              boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '12px',
                  background: 'rgba(0, 122, 255, 0.14)',
                  color: 'var(--accent-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Bell size={18} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '1.12rem', fontWeight: 800, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Notificaciones
                  </h3>
                  {unreadCount > 0 && (
                    <span style={{ fontSize: '0.74rem', color: 'var(--accent-color)', fontWeight: 700 }}>
                      {unreadCount} sin leer
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                {activeNotifTab === 'avisos' && avisosList.length > 0 && (
                  <button
                    onClick={clearAvisos}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '10px',
                      border: '1px solid rgba(168, 85, 247, 0.45)',
                      background: 'rgba(168, 85, 247, 0.12)',
                      color: '#A855F7',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Trash2 size={13} />
                    <span className="tab-text-full">Vaciar</span>
                  </button>
                )}
                {activeNotifTab === 'normal' && notifList.length > 0 && (
                  <button
                    onClick={clearNotificaciones}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255, 59, 48, 0.35)',
                      background: 'rgba(255, 59, 48, 0.08)',
                      color: '#FF3B30',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Trash2 size={13} />
                    <span className="tab-text-full">Vaciar</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    border: 'none',
                    background: 'rgba(120, 120, 128, 0.15)',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Tab Switcher: Avisos (Default) vs Notificaciones */}
            {(() => {
              const rawDisplayedList = activeNotifTab === 'avisos' ? avisosList : notifList;
              const avisosUnread = avisosList.filter(n => !n.read).length;
              const notifUnread = notifList.filter(n => !n.read).length;

              // Group notifications Android-style if >= 3 from same sender/context
              const groupedFeed = [];
              if (activeNotifTab === 'avisos') {
                rawDisplayedList.forEach(item => groupedFeed.push({ isGroup: false, item }));
              } else {
                const groups = {};
                rawDisplayedList.forEach(n => {
                  const key = n.senderUid ? `${n.type || 'gen'}_${n.senderUid}` : n.id;
                  if (!groups[key]) groups[key] = [];
                  groups[key].push(n);
                });

                Object.values(groups).forEach(items => {
                  if (items.length >= 3) {
                    groupedFeed.push({
                      isGroup: true,
                      groupKey: items[0].id,
                      items: items,
                      mainItem: items[0],
                      unreadCount: items.filter(i => !i.read).length
                    });
                  } else {
                    items.forEach(item => groupedFeed.push({ isGroup: false, item }));
                  }
                });
              }

              return (
                <>
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    marginBottom: '14px',
                    borderBottom: '1px solid var(--card-border)',
                    paddingBottom: '10px'
                  }}>
                    <button
                      type="button"
                      onClick={() => setActiveNotifTab('avisos')}
                      className="modal-tab-btn"
                      style={{
                        background: activeNotifTab === 'avisos' ? 'linear-gradient(135deg, #A855F7, #6366F1)' : 'rgba(120, 120, 128, 0.08)',
                        color: activeNotifTab === 'avisos' ? '#FFFFFF' : 'var(--text-main)',
                        boxShadow: activeNotifTab === 'avisos' ? '0 4px 14px rgba(168, 85, 247, 0.35)' : 'none'
                      }}
                    >
                      <span className="tab-text">
                        <span className="tab-text-full">Avisos ({avisosList.length})</span>
                        <span className="tab-text-short">Avisos</span>
                        {avisosUnread > 0 && (
                          <span style={{ padding: '1px 5px', borderRadius: '8px', background: '#EF4444', color: '#FFF', fontSize: '0.62rem', fontWeight: 900 }}>
                            {avisosUnread}
                          </span>
                        )}
                      </span>
                      <span className="tab-svg">
                        <Megaphone size={15} />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveNotifTab('normal')}
                      className="modal-tab-btn"
                      style={{
                        background: activeNotifTab === 'normal' ? 'var(--accent-color)' : 'rgba(120, 120, 128, 0.08)',
                        color: activeNotifTab === 'normal' ? '#FFFFFF' : 'var(--text-main)',
                        boxShadow: activeNotifTab === 'normal' ? '0 4px 14px rgba(0, 122, 255, 0.35)' : 'none'
                      }}
                    >
                      <span className="tab-text">
                        <span className="tab-text-full">Notificaciones ({notifList.length})</span>
                        <span className="tab-text-short">Notifs ({notifList.length})</span>
                        {notifUnread > 0 && (
                          <span style={{ padding: '1px 5px', borderRadius: '8px', background: '#EF4444', color: '#FFF', fontSize: '0.62rem', fontWeight: 900 }}>
                            {notifUnread}
                          </span>
                        )}
                      </span>
                      <span className="tab-svg">
                        <Bell size={15} />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveNotifTab('ajustes')}
                      title="Configurar Notificaciones del Sistema"
                      className="modal-tab-btn"
                      style={{
                        background: activeNotifTab === 'ajustes' ? 'linear-gradient(135deg, #10B981, #059669)' : 'rgba(120, 120, 128, 0.08)',
                        color: activeNotifTab === 'ajustes' ? '#FFFFFF' : 'var(--text-main)',
                        boxShadow: activeNotifTab === 'ajustes' ? '0 4px 14px rgba(16, 185, 129, 0.35)' : 'none'
                      }}
                    >
                      <span className="tab-text">
                        <span>Ajustes</span>
                      </span>
                      <span className="tab-svg">
                        <Settings size={15} />
                      </span>
                    </button>
                  </div>

                  {/* VISTA DE AJUSTES DIRECTA DENTRO DEL MODAL */}
                  {activeNotifTab === 'ajustes' ? (
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '4px' }}>
                      {/* Estado General del Dispositivo */}
                      <div style={{
                        padding: '16px',
                        borderRadius: '20px',
                        background: 'rgba(120, 120, 128, 0.06)',
                        border: '1px solid var(--card-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '12px',
                              background: systemNotifState.isEnabled ? 'rgba(16, 185, 129, 0.15)' : 'rgba(120, 120, 128, 0.15)',
                              color: systemNotifState.isEnabled ? '#10B981' : 'var(--text-secondary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Smartphone size={20} />
                            </div>
                            <div>
                              <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                Pop-ups en el Teléfono (Android)
                              </h4>
                              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                {systemNotifState.isEnabled
                                  ? 'Activo: recibirás alertas emergentes en la barra de Android.'
                                  : 'Permite avisos flotantes de clases y simulacros.'}
                              </p>
                            </div>
                          </div>

                          {/* Toggle Switch */}
                          <button
                            type="button"
                            onClick={handleToggleSystemNotifications}
                            style={{
                              width: '52px',
                              height: '28px',
                              borderRadius: '99px',
                              background: systemNotifState.isEnabled ? '#10B981' : 'rgba(120, 120, 128, 0.3)',
                              position: 'relative',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '2px',
                              transition: 'background 0.2s ease',
                              flexShrink: 0
                            }}
                          >
                            <motion.div
                              animate={{ x: systemNotifState.isEnabled ? 24 : 0 }}
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: '#FFFFFF',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.25)'
                              }}
                            />
                          </button>
                        </div>

                        {systemNotifState.permission === 'denied' && (
                          <div style={{ padding: '8px 12px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', fontSize: '0.78rem', fontWeight: 600 }}>
                            ⚠️ Los permisos fueron bloqueados en los ajustes del navegador de tu teléfono. Puedes reactivarlos tocando el candado en la barra de direcciones.
                          </div>
                        )}
                      </div>

                      {/* Sonido de Notificación */}
                      <div style={{
                        padding: '16px',
                        borderRadius: '20px',
                        background: 'rgba(120, 120, 128, 0.06)',
                        border: '1px solid var(--card-border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '12px',
                              background: systemNotifState.soundEnabled ? 'rgba(0, 122, 255, 0.15)' : 'rgba(120, 120, 128, 0.15)',
                              color: systemNotifState.soundEnabled ? 'var(--accent-color)' : 'var(--text-secondary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {systemNotifState.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                            </div>
                            <div>
                              <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-main)' }}>
                                Sonido de Notificación
                              </h4>
                              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                Reproducir tono cristalino con cada aviso
                              </p>
                            </div>
                          </div>

                          {/* Toggle Switch */}
                          <button
                            type="button"
                            onClick={handleToggleSound}
                            style={{
                              width: '52px',
                              height: '28px',
                              borderRadius: '99px',
                              background: systemNotifState.soundEnabled ? 'var(--accent-color)' : 'rgba(120, 120, 128, 0.3)',
                              position: 'relative',
                              border: 'none',
                              cursor: 'pointer',
                              padding: '2px',
                              transition: 'background 0.2s ease',
                              flexShrink: 0
                            }}
                          >
                            <motion.div
                              animate={{ x: systemNotifState.soundEnabled ? 24 : 0 }}
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: '#FFFFFF',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.25)'
                              }}
                            />
                          </button>
                        </div>

                        {/* Selector de tonos gratuitos de alta fidelidad */}
                        {systemNotifState.soundEnabled && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '6px', borderTop: '1px solid var(--card-border)' }}>
                            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                              Elegir tono disponible (Gratis / Alta fidelidad):
                            </span>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                              {[
                                { id: 'pop', name: 'Burbuja Pop', badge: 'Predeterminado' },
                                { id: 'chime', name: 'Cristalino', badge: 'Doble tono' },
                                { id: 'bell', name: 'Campana', badge: 'Academia' }
                              ].map(sound => (
                                <button
                                  key={sound.id}
                                  type="button"
                                  onClick={() => handleSelectSound(sound.id)}
                                  style={{
                                    padding: '8px 6px',
                                    borderRadius: '12px',
                                    border: systemNotifState.soundType === sound.id ? '2px solid var(--accent-color)' : '1px solid var(--card-border)',
                                    background: systemNotifState.soundType === sound.id ? 'rgba(0, 122, 255, 0.12)' : 'rgba(120, 120, 128, 0.04)',
                                    color: systemNotifState.soundType === sound.id ? 'var(--accent-color)' : 'var(--text-main)',
                                    fontWeight: 700,
                                    fontSize: '0.72rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '3px',
                                    position: 'relative'
                                  }}
                                >
                                  <Play size={14} />
                                  <span style={{ fontWeight: 800 }}>{sound.name}</span>
                                  <span style={{
                                    fontSize: '0.62rem',
                                    opacity: 0.8,
                                    padding: '1px 5px',
                                    borderRadius: '6px',
                                    background: systemNotifState.soundType === sound.id ? 'var(--accent-color)' : 'rgba(120, 120, 128, 0.15)',
                                    color: systemNotifState.soundType === sound.id ? '#FFFFFF' : 'var(--text-secondary)'
                                  }}>
                                    {sound.badge}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Botón de Prueba */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                        <button
                          type="button"
                          onClick={handleSendTestNotification}
                          style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '14px',
                            border: 'none',
                            background: 'linear-gradient(135deg, #007AFF, #0051A8)',
                            color: '#FFFFFF',
                            fontWeight: 800,
                            fontSize: '0.86rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 14px rgba(0, 122, 255, 0.35)'
                          }}
                        >
                          <Bell size={16} /> Probar Notificación con Sonido Ahora
                        </button>

                        {testSuccessMsg && (
                          <div style={{ textAlign: 'center', color: '#10B981', fontSize: '0.78rem', fontWeight: 800 }}>
                            {testSuccessMsg}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Notifications Feed */
                    <div ref={listScrollRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
                    {groupedFeed.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                        <Sparkles size={36} style={{ color: 'var(--accent-color)', marginBottom: '10px' }} />
                        <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-main)', fontSize: '0.95rem' }}>
                          {activeNotifTab === 'avisos' ? 'No hay avisos oficiales por el momento' : 'No tienes notificaciones personales'}
                        </p>
                        <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          {activeNotifTab === 'avisos'
                            ? 'Aquí verás los comunicados, avisos de la comunidad y novedades importantes.'
                            : 'Aquí verás las interacciones, respuestas y reacciones de otros estudiantes.'}
                        </p>
                      </div>
                    ) : (
                      groupedFeed.map(entry => {
                        if (entry.isGroup) {
                          const main = entry.mainItem;
                          const isExpanded = expandedGroups[entry.groupKey];

                          return (
                            <div
                              key={entry.groupKey}
                              style={{
                                borderRadius: '18px',
                                background: 'rgba(120, 120, 128, 0.06)',
                                border: '1.5px solid var(--accent-color)',
                                overflow: 'hidden'
                              }}
                            >
                              {/* Group Header (Android Accordion style) */}
                              <div
                                onClick={() => toggleGroupExpand(entry.groupKey)}
                                style={{
                                  padding: '12px 14px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  cursor: 'pointer',
                                  background: 'rgba(0, 122, 255, 0.1)',
                                  userSelect: 'none'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  {main.senderPhoto ? (
                                    <img
                                      src={main.senderPhoto}
                                      alt={main.senderName}
                                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                  ) : (
                                    <div style={{
                                      width: '36px',
                                      height: '36px',
                                      borderRadius: '50%',
                                      background: 'linear-gradient(135deg, var(--accent-color), #A855F7)',
                                      color: '#fff',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: 800
                                    }}>
                                      {(main.senderName || 'U')[0].toUpperCase()}
                                    </div>
                                  )}
                                  <div>
                                    <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                                      {main.senderName || 'Estudiante RASTRO'}
                                    </span>
                                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 700 }}>
                                      {entry.items.length} notificaciones agrupadas
                                    </span>
                                  </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  {entry.unreadCount > 0 && (
                                    <span style={{ padding: '2px 8px', borderRadius: '10px', background: '#EF4444', color: '#FFF', fontSize: '0.68rem', fontWeight: 800 }}>
                                      {entry.unreadCount} nuevas
                                    </span>
                                  )}
                                  <button
                                    type="button"
                                    style={{ border: 'none', background: 'transparent', color: 'var(--text-main)', cursor: 'pointer' }}
                                  >
                                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                  </button>
                                </div>
                              </div>

                              {/* Accordion Expanded Sub-items */}
                              {isExpanded ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', padding: '10px' }}>
                                  {entry.items.map(subItem => (
                                    <div
                                      key={subItem.id}
                                      onClick={() => handleNotificationClick(subItem)}
                                      style={{
                                        padding: '10px 12px',
                                        borderRadius: '12px',
                                        background: subItem.read ? 'rgba(120, 120, 128, 0.04)' : 'rgba(0, 122, 255, 0.12)',
                                        border: '1px solid var(--card-border)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      <div style={{ flex: 1, minWidth: 0, paddingRight: '8px' }}>
                                        <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-main)', fontWeight: subItem.read ? 400 : 700 }}>
                                          {subItem.message}
                                        </p>
                                        <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                                          {formatDate(subItem.createdAt)}
                                        </span>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteNotification(subItem.id);
                                        }}
                                        style={{ border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }}
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div
                                  onClick={() => handleNotificationClick(main)}
                                  style={{ padding: '10px 14px', fontSize: '0.82rem', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    Último: {main.message}
                                  </span>
                                  <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 800, flexShrink: 0 }}>
                                    Ver todo ➔
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        }

                        const n = entry.item;
                        const isBroadcast = isAvisos(n);

                        return (
                          <div
                            key={n.id}
                            onClick={() => handleNotificationClick(n)}
                            style={{
                              padding: '14px',
                              borderRadius: '18px',
                              background: n.read 
                                ? 'rgba(120, 120, 128, 0.04)' 
                                : isBroadcast 
                                  ? 'rgba(168, 85, 247, 0.12)' 
                                  : 'rgba(0, 122, 255, 0.08)',
                              border: n.read 
                                ? '1px solid var(--card-border)' 
                                : isBroadcast 
                                  ? '1.5px solid #A855F7' 
                                  : '1.5px solid var(--accent-color)',
                              display: 'flex',
                              gap: '12px',
                              alignItems: 'flex-start',
                              transition: 'all 0.2s ease',
                              cursor: 'pointer',
                              position: 'relative'
                            }}
                          >
                            {/* Avatar / Icon */}
                            {isBroadcast ? (
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #A855F7, #6366F1)',
                                color: '#FFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                boxShadow: '0 4px 12px rgba(168, 85, 247, 0.3)'
                              }}>
                                <Megaphone size={20} />
                              </div>
                            ) : n.senderPhoto ? (
                              <img
                                src={n.senderPhoto}
                                alt={n.senderName}
                                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                              />
                            ) : (
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--accent-color), #A855F7)',
                                color: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '0.9rem',
                                flexShrink: 0
                              }}>
                                {(n.senderName || 'U')[0].toUpperCase()}
                              </div>
                            )}

                            {/* Content */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              {notifications[0]?.id === n.id && (
                                <div style={{ marginBottom: '4px' }}>
                                  <span style={{ fontSize: '0.66rem', fontWeight: 900, padding: '2px 8px', borderRadius: '6px', background: 'linear-gradient(135deg, #10B981, #059669)', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                    ✨ Más reciente
                                  </span>
                                </div>
                              )}
                              {isBroadcast ? (
                                <>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.2)', color: '#A855F7' }}>
                                      📢 AVISO COMUNITARIO
                                    </span>
                                  </div>
                                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', margin: '2px 0' }}>
                                    {n.title || 'Aviso Oficial RASTRO'}
                                  </div>
                                  <div style={{
                                    fontSize: '0.84rem',
                                    color: 'var(--text-main)',
                                    lineHeight: 1.45,
                                    whiteSpace: (n.message && n.message.length <= 140) ? 'pre-wrap' : 'normal',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: (n.message && n.message.length > 140) ? '-webkit-box' : 'block',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical'
                                  }}>
                                    {n.message}
                                  </div>
                                </>
                              ) : (
                                <div style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.4 }}>
                                  <span style={{ fontWeight: 800, color: 'var(--text-main)' }}>
                                    {n.senderName || 'Estudiante RASTRO'}
                                  </span>{' '}
                                  {n.message}
                                </div>
                              )}

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                                <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                                  {formatDate(n.createdAt)}
                                </span>

                                {isBroadcast ? (
                                  (n.message && n.message.length > 140) ? (
                                    <span style={{ fontSize: '0.76rem', fontWeight: 700, color: '#A855F7', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                      <Eye size={13} /> Ver más
                                    </span>
                                  ) : null
                                ) : (
                                  <span style={{ 
                                    fontSize: '0.76rem', 
                                    fontWeight: 700, 
                                    color: (n.type === 'chat' || n.type === 'mensaje') ? '#059669' : 'var(--accent-color)', 
                                    display: 'inline-flex', 
                                    alignItems: 'center', 
                                    gap: '4px' 
                                  }}>
                                    {(n.type === 'chat' || n.type === 'mensaje' || n.type === 'direct_message') 
                                      ? <>Ver Mensaje Privado 💬</>
                                      : (n.postId || n.type === 'comment' || n.type === 'reaction' || n.type === 'wall_post')
                                        ? <>Ir a la Publicación 📄</>
                                        : (n.type === 'material' || n.materialId)
                                          ? <>Ver Material 📚</>
                                          : <>Ver en Perfil <ExternalLink size={12} /></>
                                    }
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Delete button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(n.id);
                              }}
                              title="Eliminar notificación"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                padding: '4px'
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
                </>
              );
            })()}
          </motion.div>

          {/* 📢 POPUP MODAL PARA LECTURA DE AVISOS DE LA COMUNIDAD */}
          <AnimatePresence>
            {selectedNoticePopup && (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                onClick={() => setSelectedNoticePopup(null)}
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 100010,
                  background: 'rgba(0,0,0,0.65)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '14px'
                }}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="ios-glass-card"
                  style={{
                    width: '100%',
                    maxWidth: '460px',
                    borderRadius: '28px',
                    padding: '24px',
                    background: 'var(--card-bg, #ffffff)',
                    color: 'var(--text-main, #1c1c1e)',
                    border: '1.5px solid #A855F7',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #A855F7, #6366F1)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Megaphone size={24} />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.18)', color: '#A855F7' }}>
                        📢 COMUNICADO OFICIAL
                      </span>
                      <h3 style={{ margin: '4px 0 0', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {selectedNoticePopup.title || 'Aviso a la Comunidad RASTRO'}
                      </h3>
                    </div>
                  </div>

                  <div style={{
                    fontSize: '0.92rem',
                    color: 'var(--text-main)',
                    lineHeight: 1.55,
                    whiteSpace: 'pre-wrap',
                    background: 'rgba(120, 120, 128, 0.05)',
                    padding: '16px',
                    borderRadius: '18px',
                    border: '1px solid var(--card-border)',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    {selectedNoticePopup.message}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
                    <button
                      onClick={() => {
                        deleteNotification(selectedNoticePopup.id);
                        setSelectedNoticePopup(null);
                      }}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 59, 48, 0.3)',
                        background: 'rgba(255, 59, 48, 0.08)',
                        color: '#FF3B30',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Trash2 size={14} /> Borrar aviso
                    </button>
                    <button
                      onClick={() => setSelectedNoticePopup(null)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: '14px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #A855F7, #6366F1)',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(168, 85, 247, 0.35)'
                      }}
                    >
                      Entendido
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

