import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { triggerSystemNotification } from '../lib/notifications';

export const DeviceNotificationsListener = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const notifiedIdsRef = useRef(new Set());
  const initialLoadTimeRef = useRef(Date.now());

  // 1. Escuchar mensajes del Service Worker cuando el usuario toca la notificación en el panel de Android
  useEffect(() => {
    const handleSwMessage = (event) => {
      if (event.data && event.data.type === 'NOTIFICATION_NAVIGATE' && event.data.url) {
        try {
          const urlObj = new URL(event.data.url, window.location.origin);
          const target = urlObj.pathname + urlObj.search + urlObj.hash;
          if (urlObj.searchParams.get('openAvisos') === 'true') {
            window.dispatchEvent(new CustomEvent('rastro-open-notificaciones'));
          } else {
            navigate(target);
          }
        } catch {
          navigate(event.data.url);
        }
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSwMessage);
    }

    return () => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleSwMessage);
      }
    };
  }, [navigate]);

  // 2. Escuchar notificaciones en Firestore para enviarlas al panel del dispositivo Android
  useEffect(() => {
    if (!user?.uid) return;

    let isFirstUserSnapshot = true;
    let isFirstAllSnapshot = true;

    const processDoc = (docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;

      if (notifiedIdsRef.current.has(id)) return;
      notifiedIdsRef.current.add(id);

      // Si ya está leída o es anterior a la sesión actual, no alertar
      if (data.read) return;
      const notifTime = data.createdAt?.toMillis ? data.createdAt.toMillis() : (data.timestamp || 0);
      if (notifTime < initialLoadTimeRef.current - 15000) return;

      // Determinamos título, mensaje y URL de destino de acuerdo al tipo
      let title = '🎓 RASTRO';
      let body = data.message || 'Tienes una nueva notificación';
      let targetUrl = '/';

      if (data.type === 'chat' || data.type === 'mensaje') {
        title = `💬 ${data.senderName || 'Mensaje Privado'}`;
        body = data.message || 'Te envió un nuevo mensaje';
        targetUrl = `/chats?with=${data.senderUid || ''}`;
      } else if (data.type === 'nuevo_material' || data.type === 'material') {
        title = `📚 ${data.senderName || 'Usuario que sigues'} subió material`;
        body = data.message || (data.postTitle ? `"${data.postTitle}"` : 'Nuevo material disponible');
        targetUrl = data.targetPath || `/biblioteca?materialId=${data.materialId || data.postId || ''}`;
      } else if (data.type === 'wall_post' || data.type === 'post') {
        title = `📝 ${data.senderName || 'Usuario que sigues'} publicó en su muro`;
        body = data.message || 'Compartió una nueva publicación';
        targetUrl = data.targetPath || `/usuario/${data.profileUid || data.senderUid}?tab=muro`;
      } else if (data.type === 'admin_broadcast' || data.type === 'aviso' || data.recipientUid === 'all') {
        title = `📢 ${data.title || 'Aviso Oficial RASTRO'}`;
        body = data.message || data.body || 'Nuevo comunicado para la comunidad estudiantil';
        targetUrl = `/?openAvisos=true`;
      } else if (data.type === 'comment') {
        title = `💬 ${data.senderName || 'Comunidad RASTRO'}`;
        body = data.message || 'Comentó en tu contenido';
        targetUrl = `/usuario/${data.profileUid || user.uid}?tab=muro${data.postId ? `&postId=${data.postId}` : ''}`;
      } else if (data.type === 'reaction') {
        title = `❤️ ${data.senderName || 'Estudiante'}`;
        body = data.message || 'Reaccionó a tu publicación';
        targetUrl = `/usuario/${data.profileUid || user.uid}?tab=muro${data.postId ? `&postId=${data.postId}` : ''}`;
      } else if (data.targetPath) {
        targetUrl = data.targetPath;
      }

      triggerSystemNotification({
        title,
        body,
        icon: data.senderPhoto || '/assets/LOGOR.png',
        data: { url: targetUrl, notifId: id },
        tag: `rastro-notif-${id}`
      });
    };

    // Consultas a Firestore
    const qUser = query(
      collection(db, 'notificaciones'),
      where('recipientUid', '==', user.uid),
      where('read', '==', false)
    );

    const qAll = query(
      collection(db, 'notificaciones'),
      where('recipientUid', '==', 'all')
    );

    const unsubUser = onSnapshot(qUser, (snap) => {
      if (isFirstUserSnapshot) {
        snap.docs.forEach((d) => notifiedIdsRef.current.add(d.id));
        isFirstUserSnapshot = false;
        return;
      }
      snap.docChanges().forEach((change) => {
        if (change.type === 'added') {
          processDoc(change.doc);
        }
      });
    }, (err) => console.warn('User notif listener error:', err));

    const unsubAll = onSnapshot(qAll, (snap) => {
      if (isFirstAllSnapshot) {
        snap.docs.forEach((d) => notifiedIdsRef.current.add(d.id));
        isFirstAllSnapshot = false;
        return;
      }
      snap.docChanges().forEach((change) => {
        if (change.type === 'added') {
          processDoc(change.doc);
        }
      });
    }, (err) => console.warn('Broadcast notif listener error:', err));

    return () => {
      unsubUser();
      unsubAll();
    };
  }, [user?.uid]);

  return null;
};
