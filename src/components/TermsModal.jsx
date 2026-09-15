import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  FileText, 
  Flag, 
  ExternalLink, 
  Sparkles, 
  X, 
  AlertTriangle, 
  CheckCircle,
  HardDrive,
  Users,
  EyeOff
} from 'lucide-react';

export const TermsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="ios-modal-backdrop" 
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.72)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000150,
          padding: '16px',
          boxSizing: 'border-box'
        }}
      >
        <motion.div
          className="ios-modal-card"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.93, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 25 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          style={{
            background: 'var(--card-bg)',
            border: '1.5px solid var(--card-border)',
            borderRadius: '28px',
            width: '100%',
            maxWidth: '720px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 30px 70px rgba(0,0,0,0.45), 0 10px 24px rgba(0,0,0,0.25)',
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '22px 26px 18px',
            borderBottom: '1px solid var(--card-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(120, 120, 128, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.16), rgba(52, 199, 89, 0.16))',
                border: '1.5px solid rgba(0, 122, 255, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-color)'
              }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                  Términos, Condiciones & Privacidad
                </h2>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  Compromiso de protección al estudiante, confidencialidad y deslinde legal
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(120, 120, 128, 0.12)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                transition: 'all 0.18s ease'
              }}
              title="Cerrar ventana"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body Scrollable */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 26px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            fontSize: '0.88rem',
            lineHeight: 1.6,
            color: 'var(--text-main)',
            WebkitOverflowScrolling: 'touch'
          }}>

            {/* Banner 1: Máxima Confidencialidad y Protección al Usuario */}
            <div style={{
              padding: '16px 18px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.12), rgba(0, 122, 255, 0.08))',
              border: '1.5px solid rgba(52, 199, 89, 0.35)',
              display: 'flex',
              gap: '14px',
              alignItems: 'flex-start'
            }}>
              <EyeOff size={24} style={{ color: '#34C759', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.94rem', display: 'block', marginBottom: '4px' }}>
                  🛡️ Tu Privacidad es Sagrada: Cero Exposición y Absoluta Confidencialidad
                </strong>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  En nuestra plataforma reconocemos la dedicación y el valor de cada estudiante. <strong>No te exhibimos</strong>: tus contraseñas, correos privados, actividad de lectura y hábitos de estudio permanecen bajo estricta reserva técnica. No vendemos, no intercambiamos ni monetizamos tus datos personales bajo ninguna circunstancia. Tu identidad está 100% protegida.
                </p>
              </div>
            </div>

            {/* Sección 1: Naturaleza del Servicio y Repositorio de Enlaces */}
            <section style={{
              background: 'rgba(120, 120, 128, 0.06)',
              borderRadius: '18px',
              padding: '16px 18px',
              border: '1px solid var(--card-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <ExternalLink size={18} style={{ color: 'var(--accent-color)' }} />
                <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  1. Naturaleza del Servicio: Repositorio Técnico e Intermediario de Enlaces
                </h3>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                RUMBO / RASTRO <strong>no es una academia de preparación</strong>, no es una entidad mercantil con fines de lucro, ni una productora de material audiovisual. La plataforma funciona únicamente como una herramienta tecnológica comunitaria, un <strong>repositorio indexador de enlaces e hipervínculos externos</strong> (Google Drive, YouTube, Zoom, etc.) y un espacio libre para que los postulantes organicen sus cursos y apuntes formativos. 
              </p>
              <p style={{ margin: '8px 0 0', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                <strong>No almacenamos contenido protegido en servidores propios:</strong> RUMBO no posee ni opera servidores donde se alojen grabaciones, libros o archivos pesados con derechos de autor. Los hipervínculos dirigen a nubes y servidores independientes administrados por terceros.
              </p>
            </section>

            {/* Sección 2: Deslinde Total de Responsabilidad Legal */}
            <section style={{
              background: 'rgba(120, 120, 128, 0.06)',
              borderRadius: '18px',
              padding: '16px 18px',
              border: '1px solid var(--card-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Lock size={18} style={{ color: '#FF9500' }} />
                <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  2. Exención Total de Responsabilidad sobre la Distribución (Safe Harbor)
                </h3>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Al amparo de las normativas internacionales aplicables a prestadores de servicios de intermediación técnica, alojamiento y motores de búsqueda digital (doctrina <em>Safe Harbor</em> y limitación de responsabilidad para intermediarios):
              </p>
              <ul style={{ margin: '8px 0 0', paddingLeft: '18px', fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <li><strong>No nos hacemos responsables</strong> por el origen, contenido, licencias, disponibilidad o veracidad de los hipervínculos externos aportados por los usuarios.</li>
                <li><strong>Tampoco criminalizamos ni culpamos al estudiante:</strong> Entendemos que los aportes se efectúan dentro de un marco de colaboración solidaria y buena fe para fines de estudio personal y preparación universitaria sin dolo comercial.</li>
                <li>RUMBO no ejerce control editorial previo ni supervisión activa de todos los enlaces que circulan en la red, pero cuenta con canales activos y automatizados de moderación y retiro inmediato.</li>
              </ul>
            </section>

            {/* Sección 3: Moderación Comunitaria Automática (3 y 5 Reportes) */}
            <section style={{
              background: 'rgba(255, 59, 48, 0.05)',
              borderRadius: '18px',
              padding: '16px 18px',
              border: '1.5px solid rgba(255, 59, 48, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Flag size={18} style={{ color: '#FF3B30' }} />
                <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  3. Moderación Comunitaria Automática por Reportes
                </h3>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Para garantizar una comunidad segura, limpia y respetuosa de la legalidad, RUMBO cuenta con botones de reporte en casi todos sus apartados. La plataforma ejecuta un <strong>auto-ocultamiento automático</strong> sin intervención humana según los siguientes umbrales:
              </p>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '10px',
                marginTop: '10px'
              }}>
                <div style={{
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: 'rgba(255, 59, 48, 0.08)',
                  border: '1px solid rgba(255, 59, 48, 0.2)'
                }}>
                  <strong style={{ color: '#FF3B30', fontSize: '0.86rem', display: 'block', marginBottom: '2px' }}>
                    🚨 3 Reportes: Materiales y Biblioteca
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Cualquier archivo, imagen, libro o comentario que acumule <strong>3 reportes</strong> válidos por errores o contenido inapropiado es <strong>ocultado de inmediato</strong> de la vista comunitaria.
                  </span>
                </div>
                <div style={{
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: 'rgba(0, 122, 255, 0.08)',
                  border: '1px solid rgba(0, 122, 255, 0.2)'
                }}>
                  <strong style={{ color: 'var(--accent-color)', fontSize: '0.86rem', display: 'block', marginBottom: '2px' }}>
                    🎓 5 Reportes: Cursos Estructurados
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    En el caso de los cursos (que contienen múltiples módulos o clases), al registrar <strong>5 reportes</strong> la plataforma <strong>oculta automáticamente</strong> el curso completo del directorio público.
                  </span>
                </div>
              </div>
            </section>

            {/* Sección 4: Política de Retiro Rápido para Propietarios y Docentes */}
            <section style={{
              background: 'rgba(52, 199, 89, 0.06)',
              borderRadius: '18px',
              padding: '16px 18px',
              border: '1.5px solid rgba(52, 199, 89, 0.25)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <CheckCircle size={18} style={{ color: '#34C759' }} />
                <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  4. Si eres Propietario o Autor: Cómo Ocultar o Retirar un Material
                </h3>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Mantenemos una política de respeto absoluto hacia autores, profesores, creadores y academias. Si no estás de acuerdo con la difusión de algún material de tu autoría o decides que deje de ser público, tienes vías directas e inmediatas:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                <div style={{ padding: '12px 14px', borderRadius: '14px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                  <strong style={{ color: '#DC2626', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    ⚡ Opción 1 (La más rápida): Reportar el material para que deje de mostrarse
                  </strong>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    La vía más veloz para retirar cualquier contenido es la moderación comunitaria: <strong>reportando el material 3 veces (en biblioteca, archivos o apuntes) o 5 veces (en cursos completos)</strong>. Al alcanzar dicho número de reportes, el sistema <strong>deja de mostrarlo automáticamente y se oculta de toda la plataforma</strong> en tiempo real, garantizando una salida inmediata.
                  </p>
                </div>

                <div style={{ padding: '12px 14px', borderRadius: '14px', background: 'rgba(52, 199, 89, 0.08)', border: '1px solid rgba(52, 199, 89, 0.25)' }}>
                  <strong style={{ color: '#059669', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    🔒 Opción 2: Ocultarlo tú mismo sin intermediarios (Directo en Google Drive)
                  </strong>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Dado que RUMBO solo funciona como un repositorio de hipervínculos y no almacena archivos en servidores propios, tú como propietario tienes el control total en el origen: <strong>entra a tu cuenta de Google Drive y cambia el acceso del archivo o carpeta a "Restringido" o "Privado"</strong>. En ese mismo segundo, el contenido queda inaccesible para cualquier usuario en internet y en la plataforma de manera global e instantánea, sin depender de nadie más.
                  </p>
                </div>

                <div style={{ padding: '12px 14px', borderRadius: '14px', background: 'rgba(0, 122, 255, 0.08)', border: '1px solid rgba(0, 122, 255, 0.25)' }}>
                  <strong style={{ color: 'var(--accent-color)', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    📝 Opción 3: Reporte con motivo personalizado o Canal de Asistencia
                  </strong>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Si deseas que el enlace sea desindexado administrativamente, pulsa el botón <strong>"Reportar"</strong> en la tarjeta respectiva, selecciona la causal <em>"Derechos de autor / Solicitud de retiro del propietario"</em> y redacta el motivo. También dispones de nuestro canal directo de WhatsApp para coordinar amistosamente cualquier retiro prioritario.
                  </p>
                </div>
              </div>
            </section>

            {/* Sección 5: Prohibición de Lucro y Fines Educativos */}
            <section style={{
              background: 'rgba(120, 120, 128, 0.06)',
              borderRadius: '18px',
              padding: '16px 18px',
              border: '1px solid var(--card-border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Users size={18} style={{ color: 'var(--accent-color)' }} />
                <h3 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  5. Fines Estrictamente Educativos y Gratuidad Total
                </h3>
              </div>
              <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                El acceso a RUMBO es completamente gratuito. Queda prohibida la venta, lucración económica, cobro por suscripciones de enlaces o comercialización del acceso a contenidos educativos dentro de la plataforma. La finalidad única de RUMBO es democratizar herramientas de autoestudio para estudiantes y postulantes universitarios.
              </p>
            </section>

            {/* Sección 6: Cláusula de Solución Amistosa y Jurisdicción */}
            <section style={{
              background: 'rgba(120, 120, 128, 0.06)',
              borderRadius: '18px',
              padding: '16px 18px',
              border: '1px solid var(--card-border)'
            }}>
              <h3 style={{ margin: '0 0 6px', fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>
                6. Acuerdo Integral y Solución Pacífica de Controversias
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                El acceso y utilización de RUMBO / RASTRO constituye la aceptación plena y voluntaria de estos Términos, Condiciones y Políticas de Privacidad. Cualquier reclamo, discrepancia o notificación de retiro se tramitará y resolverá prioritariamente por la vía de la buena fe y los mecanismos de desindexación amigable previstos en este documento.
              </p>
            </section>

          </div>

          {/* Footer with Action Button */}
          <div style={{
            padding: '16px 26px 20px',
            borderTop: '1px solid var(--card-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(120, 120, 128, 0.04)',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} style={{ color: '#34C759' }} />
              <span>Comunidad segura, colaborativa y protegida.</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              style={{
                padding: '12px 28px',
                borderRadius: '14px',
                border: 'none',
                background: 'var(--accent-color)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(0, 122, 255, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <CheckCircle size={18} />
              <span>Entendido y Aceptar</span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
