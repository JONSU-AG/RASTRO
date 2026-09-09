import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Play, FileText, Download } from 'lucide-react';

export function InChatVideoModal({ video, onClose }) {
  if (!video) return null;

  // Extract YouTube ID or convert URL
  const getEmbedUrl = () => {
    if (video.ytId) {
      return `https://www.youtube.com/embed/${video.ytId}?autoplay=1&rel=0`;
    }
    const url = video.url || '';
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
    if (url.includes('drive.google.com/file/d/')) {
      const fileId = url.split('/d/')[1]?.split('/')[0];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl();

  return (
    <AnimatePresence>
      <div 
        className="ios-modal-backdrop" 
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.72)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 99999
        }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          style={{
            maxWidth: '820px',
            width: '100%',
            background: 'var(--card-bg, #18181B)',
            border: '1px solid var(--card-border, rgba(255, 255, 255, 0.15))',
            borderRadius: '24px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <div 
            style={{
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--card-border, rgba(255, 255, 255, 0.1))',
              gap: '12px'
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span 
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#EF4444',
                    background: 'rgba(239, 68, 68, 0.14)',
                    padding: '2px 8px',
                    borderRadius: '8px'
                  }}
                >
                  {video.materia || 'Clase grabada'}
                </span>
                {video.semanaLabel && (
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary, #9CA3AF)' }}>
                    {video.semanaLabel}
                  </span>
                )}
              </div>
              <h3 
                style={{ 
                  margin: 0, 
                  fontSize: '0.98rem', 
                  fontWeight: 800, 
                  color: 'var(--text-main, #FFFFFF)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {video.title || 'Reproductor de Video RASTRO'}
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {video.url && (
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: 'var(--text-main, #FFFFFF)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                  title="Abrir en YouTube / pestaña nueva"
                >
                  <span>Abrir enlace</span>
                  <ExternalLink size={13} />
                </a>
              )}
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-main, #FFFFFF)',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Video Player Frame */}
          <div 
            style={{ 
              position: 'relative', 
              width: '100%', 
              paddingTop: '56.25%', // 16:9 Aspect Ratio
              background: '#000000' 
            }}
          >
            <iframe
              src={embedUrl}
              title={video.title || 'Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
            />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export function InChatPreviewModal({ resource, onClose }) {
  if (!resource) return null;

  const url = resource.driveUrl || resource.url || '';

  const getDrivePreviewUrl = (rawUrl) => {
    if (!rawUrl) return null;
    if (rawUrl.includes('/view') || rawUrl.includes('/edit')) {
      return rawUrl.replace(/\/view.*$/, '/preview').replace(/\/edit.*$/, '/preview');
    }
    if (rawUrl.includes('drive.google.com/file/d/')) {
      const fileId = rawUrl.split('/d/')[1]?.split('/')[0];
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    if (rawUrl.includes('drive.google.com/drive/folders/')) {
      const folderId = rawUrl.split('folders/')[1]?.split('?')[0];
      return `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
    }
    return rawUrl;
  };

  const previewUrl = getDrivePreviewUrl(url);

  return (
    <AnimatePresence>
      <div 
        className="ios-modal-backdrop" 
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.72)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          zIndex: 99999
        }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          style={{
            maxWidth: '860px',
            width: '100%',
            height: '84vh',
            background: 'var(--card-bg, #18181B)',
            border: '1px solid var(--card-border, rgba(255, 255, 255, 0.15))',
            borderRadius: '24px',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Header */}
          <div 
            style={{
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--card-border, rgba(255, 255, 255, 0.1))',
              gap: '12px'
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span 
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#007AFF',
                    background: 'rgba(0, 122, 255, 0.14)',
                    padding: '2px 8px',
                    borderRadius: '8px'
                  }}
                >
                  {resource.materia || resource.categoria || 'Documento'}
                </span>
                {resource.author && (
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary, #9CA3AF)' }}>
                    Aporte de {resource.author}
                  </span>
                )}
              </div>
              <h3 
                style={{ 
                  margin: 0, 
                  fontSize: '0.98rem', 
                  fontWeight: 800, 
                  color: 'var(--text-main, #FFFFFF)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {resource.title || 'Vista previa'}
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {url && (
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: 'var(--text-main, #FFFFFF)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                  title="Abrir en Drive o pestaña nueva"
                >
                  <span>Abrir archivo</span>
                  <ExternalLink size={13} />
                </a>
              )}
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-main, #FFFFFF)',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Iframe View */}
          <div style={{ flex: 1, background: 'rgba(0, 0, 0, 0.08)', position: 'relative' }}>
            {previewUrl ? (
              <iframe
                src={previewUrl}
                title={resource.title || 'Documento'}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
              />
            ) : (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: 'var(--text-secondary, #9CA3AF)',
                  fontSize: '0.9rem'
                }}
              >
                No se pudo generar vista previa directa. Abre el archivo en una pestaña nueva.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
