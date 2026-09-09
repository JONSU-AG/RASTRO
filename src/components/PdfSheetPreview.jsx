import React, { useState } from 'react';
import { FileText, Folder } from 'lucide-react';
import { getDriveFileId } from '../lib/storageHelper';

export const PdfSheetPreview = ({
  url,
  title = 'Documento PDF',
  category = 'Material Académico',
  height = 185,
  compact = false,
  isFolder: isFolderProp
}) => {
  const isFolder = Boolean(
    isFolderProp ||
    (url && (
      url.includes('/folders/') ||
      url.includes('folderview') ||
      url.includes('embeddedfolderview')
    )) ||
    (category && typeof category === 'string' && category.toLowerCase().includes('carpeta')) ||
    (title && typeof title === 'string' && title.toLowerCase().includes('carpeta'))
  );

  const driveId = !isFolder ? getDriveFileId(url) : null;
  const [imgStage, setImgStage] = useState(isFolder ? 3 : 0); // 0 = drive w800, 1 = lh3 w600, 2 = drive w400, 3 = mock sheet

  // Generación escalonada de URLs (solo para archivos que no sean carpetas)
  const getThumbnailSrc = () => {
    if (isFolder || !driveId) return null;
    if (imgStage === 0) return `https://drive.google.com/thumbnail?id=${driveId}&sz=w800`;
    if (imgStage === 1) return `https://lh3.googleusercontent.com/d/${driveId}=w600`;
    if (imgStage === 2) return `https://drive.google.com/thumbnail?id=${driveId}&sz=w400`;
    return null;
  };

  const currentSrc = getThumbnailSrc();

  const handleImgError = () => {
    setImgStage(prev => prev + 1);
  };

  return (
    <div
      style={{
        width: '100%',
        height: `${height}px`,
        borderRadius: '16px',
        overflow: 'hidden',
        border: isFolder ? '1.5px solid rgba(0, 122, 255, 0.35)' : '1.5px solid rgba(0, 122, 255, 0.22)',
        background: isFolder
          ? 'linear-gradient(145deg, rgba(235, 245, 255, 0.95), rgba(220, 236, 254, 0.9))'
          : 'linear-gradient(145deg, rgba(240, 244, 250, 0.95), rgba(225, 235, 248, 0.85))',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
        boxSizing: 'border-box',
        padding: '6px'
      }}
    >
      {/* Si tenemos URL de imagen válida */}
      {!isFolder && currentSrc && imgStage < 3 ? (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src={currentSrc}
            alt={title}
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            draggable={false}
            onError={handleImgError}
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
              borderRadius: '8px',
              background: '#FFFFFF',
              boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
              pointerEvents: 'none',
              userSelect: 'none'
            }}
          />
        </div>
      ) : (
        /* Representación realista y estilizada de la HOJA (PDF o Carpeta de Archivos) */
        <div
          style={{
            height: '92%',
            aspectRatio: '1 / 1.38',
            background: '#FFFFFF',
            borderRadius: '8px',
            boxShadow: '0 8px 22px rgba(0, 0, 0, 0.14), 0 2px 6px rgba(0,0,0,0.06)',
            border: isFolder ? '1px solid rgba(0, 122, 255, 0.18)' : '1px solid rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            padding: '10px 12px',
            boxSizing: 'border-box'
          }}
        >
          {/* Franja superior simulada de membrete / portada */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: isFolder ? '1.5px solid #007AFF' : '1.5px solid #FF3B30',
            paddingBottom: '6px',
            marginBottom: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{
                background: isFolder ? '#007AFF' : '#FF3B30',
                color: '#FFF',
                fontSize: '0.62rem',
                fontWeight: 900,
                padding: '2px 6px',
                borderRadius: '4px',
                letterSpacing: '0.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                {isFolder ? (
                  <>
                    <Folder size={10} /> CARPETA DE ARCHIVOS
                  </>
                ) : (
                  'PDF · PÁGINA 1'
                )}
              </span>
            </div>
            <span style={{ fontSize: '0.62rem', color: isFolder ? '#007AFF' : '#8E8E93', fontWeight: 700 }}>
              {isFolder ? 'DRIVE' : 'PREU'}
            </span>
          </div>

          {/* Título en la hoja */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6px' }}>
            <span style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              color: '#1C1C1E',
              lineHeight: 1.25,
              display: '-webkit-box',
              WebkitLineClamp: isFolder ? 2 : 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textAlign: 'center'
            }}>
              {title}
            </span>

            {/* Categoría chip */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.62rem', fontWeight: 700, color: '#007AFF', background: 'rgba(0,122,255,0.08)', padding: '2px 6px', borderRadius: '6px' }}>
                {category}
              </span>
            </div>

            {/* Mensaje amigable exclusivo para carpetas de archivos */}
            {isFolder ? (
              <div style={{
                marginTop: '6px',
                padding: '8px 8px',
                borderRadius: '8px',
                background: 'rgba(0, 122, 255, 0.05)',
                border: '1px dashed rgba(0, 122, 255, 0.3)',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}>
                <p style={{
                  margin: 0,
                  fontSize: '0.66rem',
                  lineHeight: 1.35,
                  color: '#1C1C1E',
                  fontWeight: 600
                }}>
                  Esta es una carpeta de archivos, es por eso que no hay vista previa, ten un buen día estudiante promedio 💙
                </p>
              </div>
            ) : (
              /* Líneas simuladas de texto impreso para PDFs */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px', opacity: 0.45 }}>
                <div style={{ height: '3px', background: '#8E8E93', borderRadius: '2px', width: '90%', margin: '0 auto' }} />
                <div style={{ height: '3px', background: '#8E8E93', borderRadius: '2px', width: '80%', margin: '0 auto' }} />
                <div style={{ height: '3px', background: '#8E8E93', borderRadius: '2px', width: '85%', margin: '0 auto' }} />
              </div>
            )}
          </div>

          {/* Pie de la hoja */}
          <div style={{
            borderTop: '1px dashed #E5E5EA',
            paddingTop: '4px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.58rem',
            color: isFolder ? '#007AFF' : '#AEAEB2',
            fontWeight: 600
          }}>
            <span>RASTRO OFICIAL</span>
            <span>{isFolder ? 'CARPETA / OFICIAL' : 'PÁG. 1 / OFICIAL'}</span>
          </div>
        </div>
      )}

      {/* Insignia flotante sutil para indicar que es PDF o Carpeta */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          color: '#FFFFFF',
          padding: '3px 8px',
          borderRadius: '8px',
          fontSize: '0.68rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
      >
        {isFolder ? (
          <>
            <Folder size={12} style={{ color: '#007AFF' }} />
            <span>Carpeta</span>
          </>
        ) : (
          <>
            <FileText size={12} style={{ color: '#FF3B30' }} />
            <span>1ra Hoja</span>
          </>
        )}
      </div>
    </div>
  );
};
