import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal, Copy, Check, Download, ExternalLink, HelpCircle, Code2 } from 'lucide-react';
import { CONSOLE_EXTRACTOR_SCRIPT } from '../lib/consoleExtractorScript';

export const ConsoleExtractorModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(CONSOLE_EXTRACTOR_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(10px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          boxSizing: 'border-box'
        }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          style={{
            background: 'var(--card-bg)',
            border: '1.5px solid var(--card-border)',
            borderRadius: '26px',
            width: '100%',
            maxWidth: '620px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.4)',
            boxSizing: 'border-box'
          }}
        >
          {/* Header estilo Consola DevTools */}
          <div style={{
            padding: '18px 24px',
            background: 'linear-gradient(135deg, #1E1E2E 0%, #2D2B55 100%)',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#38BDF8'
              }}>
                <Terminal size={20} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900 }}>
                  Extractor de Enlaces para Consola
                </h2>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700 }}>
                  Descargador automático de enlaces vía DevTools (F12)
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: '22px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Paso a paso */}
            <div style={{
              background: 'rgba(0, 122, 255, 0.08)',
              border: '1.5px solid rgba(0, 122, 255, 0.2)',
              borderRadius: '18px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <h4 style={{ margin: 0, color: 'var(--accent-color)', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={18} /> ¿Cómo usar este script en 3 pasos?
              </h4>
              <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                <li>Abre en tu navegador la plataforma o aula donde están los videos y clases.</li>
                <li>Presiona la tecla <strong>F12</strong> (o clic derecho ➔ <em>Inspeccionar</em>) y entra a la pestaña <strong>Consola (Console)</strong>.</li>
                <li>Pega el script copiado abajo y presiona <strong>Enter</strong>. El script recorrerá las clases y descargará un archivo <code>recursos.txt</code> listo para copiar en RUMBO.</li>
              </ol>
            </div>

            {/* Preview del Script y Botón Copiar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
                  Código JavaScript del Extractor:
                </span>
                <button
                  onClick={handleCopy}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 16px',
                    borderRadius: '12px',
                    background: copied ? '#10B981' : 'var(--accent-color)',
                    color: '#FFF',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: copied ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 4px 12px rgba(0, 122, 255, 0.3)'
                  }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copied ? '¡Copiado al Portapapeles!' : 'Copiar Script'}</span>
                </button>
              </div>

              <div style={{
                background: '#0F172A',
                color: '#38BDF8',
                borderRadius: '14px',
                padding: '14px',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                maxHeight: '180px',
                overflowY: 'auto',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                lineHeight: 1.5,
                whiteSpace: 'pre'
              }}>
                {CONSOLE_EXTRACTOR_SCRIPT.slice(0, 500)}...
                <div style={{ color: '#94A3B8', marginTop: '6px' }}>// ... (script completo copiado al portapapeles)</div>
              </div>
            </div>

            {/* Footer Action */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  borderRadius: '12px',
                  border: '1px solid var(--card-border)',
                  background: 'rgba(120, 120, 128, 0.1)',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  cursor: 'pointer'
                }}
              >
                Cerrar
              </button>

              <button
                type="button"
                onClick={handleCopy}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '10px 22px',
                  borderRadius: '12px',
                  background: copied ? '#10B981' : 'linear-gradient(135deg, #007AFF 0%, #00C6FF 100%)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 122, 255, 0.35)'
                }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? '¡Copiado!' : 'Copiar para Consola'}</span>
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
