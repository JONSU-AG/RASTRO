import React from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  FileText, 
  ExternalLink, 
  Eye, 
  BookOpen, 
  Cpu, 
  User, 
  Calendar,
  Sparkles,
  Download
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function OrsttyMiniCard({ 
  item, 
  onPlayVideo, 
  onPreviewResource 
}) {
  if (!item) return null;

  const isVideo = item.type === 'video' || item.ytId || item.icon === '🎬';
  const isDocument = item.type === 'pdf' || item.type === 'material' || item.icon === '📄' || item.icon === '✨';
  const isBook = item.type === 'libro' || item.icon === '📚';
  const isExam = item.type === 'examen' || item.icon === '📝';
  const isCourse = item.type === 'curso' || item.type === 'academia' || item.type === 'briceno' || item.type === 'esparta' || item.type === 'kelsen' || item.icon === '🏛️';
  const isProfile = item.type === 'perfil' || item.icon === '👤';
  const isWeek = item.type === 'semana' || item.icon === '📅';

  // Subtitle line (Materia · Semana · Academia)
  const metaParts = [];
  if (item.materia) metaParts.push(item.materia);
  if (item.semanaLabel) {
    metaParts.push(item.semanaLabel);
  } else if (item.semana) {
    metaParts.push(`Semana ${item.semana}`);
  }
  if (item.academia && item.academia !== item.materia) metaParts.push(item.academia);
  if (item.author && !metaParts.includes(item.author)) metaParts.push(`Por ${item.author}`);
  if (item.autor && !metaParts.includes(item.autor)) metaParts.push(`Autor: ${item.autor}`);
  if (item.preguntasCount) metaParts.push(`${item.preguntasCount} preguntas`);
  if (isCourse && item.subtitulo) metaParts.push(item.subtitulo);
  if (isCourse && item.badge && !metaParts.includes(item.badge)) metaParts.push(item.badge);

  const subtitle = metaParts.length > 0
    ? metaParts.join(' · ')
    : (item.categoria || (isCourse ? 'Academia de preparación' : 'Recurso académico'));

  // Title line - robust resolution across all real property names (name, nombre, title, academyName)
  const title = item.title || item.titulo || item.nombre || item.name || item.academyName || item.obra || (isCourse && item.id ? `Academia ${item.id.charAt(0).toUpperCase() + item.id.slice(1)}` : 'Recurso sin título');
  const description = item.desc || item.descripcion || item.description || null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      style={{
        background: 'var(--card-bg, #FFFFFF)',
        border: '1px solid var(--card-border, rgba(0, 0, 0, 0.12))',
        borderRadius: '16px',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '100%'
      }}
    >
      {/* Si es documento/material/separata: Renderizar como tarjeta de publicación de perfil */}
      {isDocument ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {/* Header tipo Perfil de Usuario */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #007AFF, #5856D6)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(0, 122, 255, 0.25)'
                }}
              >
                {(item.author || item.uploadedBy?.name || 'R').charAt(0).toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main, #111827)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.author || item.uploadedBy?.name || 'Comunidad RASTRO'}
                  </p>
                  <span style={{ fontSize: '0.65rem', color: '#007AFF', fontWeight: 700 }}>✓</span>
                </div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary, #6B7280)', display: 'block' }}>
                  {item.categoria || 'Material Académico'}
                </span>
              </div>
            </div>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '8px',
                background: 'rgba(0, 122, 255, 0.12)',
                color: '#007AFF',
                whiteSpace: 'nowrap'
              }}
            >
              📄 {item.type === 'pdf' ? 'PDF' : 'Separata'}
            </span>
          </div>

          {/* Bloque del Recurso / Archivo */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '12px',
              background: 'rgba(120, 120, 128, 0.06)',
              border: '1px solid var(--card-border, rgba(0, 0, 0, 0.08))',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <h4
              style={{
                margin: 0,
                fontSize: '0.88rem',
                fontWeight: 700,
                color: 'var(--text-main, #111827)',
                lineHeight: 1.35,
                wordBreak: 'break-word'
              }}
            >
              {title}
            </h4>
            <p
              style={{
                margin: '2px 0 0',
                fontSize: '0.72rem',
                color: 'var(--text-secondary, #4B5563)',
                lineHeight: 1.3
              }}
            >
              {subtitle}
            </p>
            {description && (
              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: '0.74rem',
                  color: 'var(--text-main, #374151)',
                  lineHeight: 1.4,
                  opacity: 0.92
                }}
              >
                {description}
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Card Header regular: Icon + Title */
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '1.05rem',
              background: isVideo 
                ? 'rgba(239, 68, 68, 0.12)' 
                : isBook 
                ? 'rgba(168, 85, 247, 0.12)' 
                : isExam 
                ? 'rgba(245, 158, 11, 0.12)' 
                : 'rgba(16, 185, 129, 0.12)',
              border: '1px solid var(--card-border, rgba(0, 0, 0, 0.08))'
            }}
          >
            {item.icon || (isVideo ? '🎬' : isBook ? '📚' : isExam ? '📝' : '✨')}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h4
              style={{
                margin: 0,
                fontSize: '0.88rem',
                fontWeight: 700,
                color: 'var(--text-main, #111827)',
                lineHeight: 1.35,
                wordBreak: 'break-word'
              }}
            >
              {title}
            </h4>

            <p
              style={{
                margin: '3px 0 0',
                fontSize: '0.74rem',
                color: 'var(--text-secondary, #4B5563)',
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
              title={subtitle}
            >
              {subtitle}
            </p>

            {description && (
              <p
                style={{
                  margin: '6px 0 0',
                  fontSize: '0.78rem',
                  color: 'var(--text-main, #374151)',
                  lineHeight: 1.4,
                  whiteSpace: 'pre-line',
                  opacity: 0.92
                }}
              >
                {description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          flexWrap: 'wrap',
          marginTop: '4px',
          paddingTop: '6px',
          borderTop: '1px solid var(--card-border, rgba(0, 0, 0, 0.08))'
        }}
      >
        {/* Case 1: Video */}
        {isVideo && (
          <>
            <button
              onClick={() => onPlayVideo && onPlayVideo(item)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                color: '#FFFFFF',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                transition: 'all 0.15s ease'
              }}
            >
              <Play size={13} fill="#FFFFFF" />
              <span>Ver video</span>
            </button>

            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  borderRadius: '10px',
                  border: '1px solid var(--card-border, rgba(0, 0, 0, 0.12))',
                  background: 'rgba(120, 120, 128, 0.08)',
                  color: 'var(--text-main, #111827)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
                title="Abrir en pestaña nueva"
              >
                <span>Abrir</span>
                <ExternalLink size={12} />
              </a>
            )}
          </>
        )}

        {/* Case 2: Document / PDF / Material */}
        {isDocument && (
          <>
            <button
              onClick={() => onPreviewResource && onPreviewResource(item)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #007AFF, #0056B3)',
                color: '#FFFFFF',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 122, 255, 0.3)',
                transition: 'all 0.15s ease'
              }}
            >
              <Eye size={13} />
              <span>Vista previa</span>
            </button>

            {(item.url || item.driveUrl) && (
              <a
                href={item.driveUrl || item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  borderRadius: '10px',
                  border: '1px solid var(--card-border, rgba(0, 0, 0, 0.12))',
                  background: 'rgba(120, 120, 128, 0.08)',
                  color: 'var(--text-main, #111827)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  cursor: 'pointer'
                }}
              >
                <span>Abrir</span>
                <ExternalLink size={12} />
              </a>
            )}
          </>
        )}

        {/* Case 3: Book */}
        {isBook && (
          <>
            <button
              onClick={() => onPreviewResource && onPreviewResource(item)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                color: '#FFFFFF',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
              }}
            >
              <Eye size={13} />
              <span>Vista previa</span>
            </button>

            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 10px',
                  borderRadius: '10px',
                  border: '1px solid var(--card-border, rgba(0, 0, 0, 0.12))',
                  background: 'rgba(120, 120, 128, 0.08)',
                  color: 'var(--text-main, #111827)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <span>Abrir</span>
                <ExternalLink size={12} />
              </a>
            )}
          </>
        )}

        {/* Case 4: Exam / Simulador */}
        {(isExam || item.type === 'comparacion') && (
          <Link
            to="/simulador"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
              color: '#FFFFFF',
              fontSize: '0.74rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
            }}
          >
            <Cpu size={13} />
            <span>{item.type === 'comparacion' ? 'Simular puntaje en Simulador' : 'Ir al Simulador'}</span>
          </Link>
        )}

        {/* Case 5: Course / Academia */}
        {isCourse && (
          <Link
            to={item.path || `/cursos/${item.id || ''}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              color: '#FFFFFF',
              fontSize: '0.74rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
            }}
          >
            <BookOpen size={13} />
            <span>Ver Academia</span>
          </Link>
        )}

        {/* Case 6: User profile */}
        {isProfile && (
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            <Link
              to={item.profileUrl || `/usuario/${item.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #007AFF, #6366F1)',
                color: '#FFFFFF',
                fontSize: '0.74rem',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              <User size={13} />
              <span>Ver perfil</span>
            </Link>
            {item.chatUrl && (
              <Link
                to={item.chatUrl}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#10B981',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  textDecoration: 'none'
                }}
              >
                <span>💬 Mandar mensaje</span>
              </Link>
            )}
          </div>
        )}

        {/* Case 7: Week */}
        {isWeek && (
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--text-secondary, #9CA3AF)',
              padding: '4px 8px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.06)'
            }}
          >
            {item.subjectCount ? `${item.subjectCount} materias disponibles` : 'Semana activa'}
          </span>
        )}
      </div>
    </motion.div>
  );
}
