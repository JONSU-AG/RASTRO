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

    // Función para extraer el texto real del mensaje sin prefijos redundantes
    const extractNotificationContent = (data) => {
      const sender = data.senderName || 'Estudiante';
      let title = '🎓 RUMBO';
      let body = '';
      let targetUrl = '/';

      // Extrae texto real si viene formateado con comillas o prefijos conocidos
      const cleanQuotedText = (raw) => {
        if (!raw || typeof raw !== 'string') return '';
        const match = raw.match(/:\s*["“](.+)["”]$/);
        if (match && match[1]?.trim()) {
          return match[1].trim();
        }
        return raw
          .replace(/^te envió un mensaje privado:\s*/i, '')
          .replace(/^te envió un mensaje:\s*/i, '')
          .replace(/^publicó en tu muro:\s*/i, '')
          .replace(/^publicó en su muro:\s*/i, '')
          .replace(/^comentó en tu publicación:\s*/i, '')
          .replace(/^comentó en tu material:\s*/i, '')
          .replace(/^comentó:\s*/i, '')
          .replace(/^["“]|["”]$/g, '')
          .trim();
      };

      const rawText = data.text || data.content || '';
      const messageClean = cleanQuotedText(data.message);
      const actualText = rawText || messageClean || data.message || '';

      switch (data.type) {
        case 'chat':
        case 'mensaje':
        case 'direct_message': {
          title = `💬 ${sender}`;
          body = actualText || (data.imageUrl ? '📷 Te envió una foto' : 'Te envió un nuevo mensaje');
          targetUrl = `/chats?with=${data.senderUid || ''}`;
          break;
        }

        case 'nuevo_material':
        case 'material': {
          title = `📚 ${sender} subió material`;
          const docTitle = data.postTitle || data.title || actualText;
          body = docTitle ? `"${docTitle}"` : 'Nuevo material de estudio disponible';
          targetUrl = data.targetPath || `/biblioteca?materialId=${data.materialId || data.postId || ''}`;
          break;
        }

        case 'wall_post':
        case 'post': {
          title = `📝 ${sender} en el Muro`;
          body = actualText ? `"${actualText}"` : 'Compartió una nueva publicación en el muro';
          const targetProfile = data.profileUid || data.senderUid || user?.uid || '';
          targetUrl = data.targetPath || `/usuario/${targetProfile}?tab=muro${data.postId ? `&postId=${data.postId}` : ''}`;
          break;
        }

        case 'comment': {
          title = `💬 Comentario de ${sender}`;
          body = actualText ? `"${actualText}"` : 'Comentó en tu publicación';
          const wallProfile = data.profileUid || user?.uid || '';
          targetUrl = data.targetPath || `/usuario/${wallProfile}?tab=muro${data.postId ? `&postId=${data.postId}` : ''}`;
          break;
        }

        case 'reaction': {
          title = `❤️ Reacción de ${sender}`;
          body = data.message || `Reaccionó a tu publicación ${data.postTitle ? `"${data.postTitle}"` : ''}`;
          const wallProfile = data.profileUid || user?.uid || '';
          targetUrl = data.targetPath || `/usuario/${wallProfile}?tab=muro${data.postId ? `&postId=${data.postId}` : ''}`;
          break;
        }

        case 'follow': {
          title = `👤 ${sender}`;
          body = `${sender} comenzó a seguirte en Rumbo`;
          targetUrl = data.targetPath || `/usuario/${data.senderUid || ''}`;
          break;
        }

        case 'admin_broadcast':
        case 'aviso': {
          title = `📢 ${data.title || 'Aviso Oficial RUMBO'}`;
          body = actualText || data.body || 'Nuevo comunicado para la comunidad estudiantil';
          targetUrl = '/?openAvisos=true';
          break;
        }

        case 'admin_warning': {
          title = `⚠️ ${data.title || 'Aviso de Moderación'}`;
          body = actualText || data.body || 'Has recibido una notificación de moderación';
          targetUrl = '/';
          break;
        }

        default: {
          title = data.title || `🎓 ${sender || 'RUMBO'}`;
          body = actualText || data.body || data.message || 'Tienes una nueva notificación';
          targetUrl = data.targetPath || '/';
          break;
        }
      }

      return { title, body, targetUrl };
    };

    const processDoc = (docSnap) => {
      const data = docSnap.data();
      const id = docSnap.id;

      if (!data) return;
      if (notifiedIdsRef.current.has(id)) return;

      // Si ya está leída, no alertar
      if (data.read) return;

      const notifTime = data.createdAt?.toMillis 
        ? data.createdAt.toMillis() 
        : (typeof data.timestamp === 'number' ? data.timestamp : 0);

      // Descartar solo si tiene fecha explícita y es anterior a cuando se inició la app
      if (notifTime > 0 && notifTime < initialLoadTimeRef.current - 15000) {
        notifiedIdsRef.current.add(id);
        return;
      }

      // Marcar como procesada para no duplicar alertas
      notifiedIdsRef.current.add(id);

      // Extraer título, cuerpo exacto del mensaje y enlace de destino
      const { title, body, targetUrl } = extractNotificationContent(data);

      triggerSystemNotification({
        title,
        body,
        icon: data.senderPhoto || '/assets/LOGOR.png',
        data: { url: targetUrl, notifId: id },
        tag: `rumbo-notif-${id}`
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
        if (change.type === 'added' || change.type === 'modified') {
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
        if (change.type === 'added' || change.type === 'modified') {
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
