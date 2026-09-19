import React, { useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Sigma, Copy, Check, Sparkles, AlertCircle, BookOpen } from 'lucide-react';

/**
 * Componente de Alta Fidelidad para Visualización de Fórmulas y Teoremas
 * Renderizado con KaTeX (Tipografía matemática oficial Computer Modern / LaTeX)
 * Jerarquía estricta:
 * 1. Teorema Fundamental / Fórmula Base (Reconocimiento Inmediato)
 * 2. Casos Operacionales y Despejes Evaluados en CEPREUNSA
 * 3. Nomenclatura de Variables y Unidades del Sistema Internacional (S.I.)
 * 4. Trampas Habituales y Clave Fija de Admisión
 */
export const FormulaDisplay = ({ formulaData, rawMecanismos, compact = false }) => {
  const [copied, setCopied] = useState(false);

  // Helper para renderizar LaTeX de forma segura
  const renderMath = (latexStr, isDisplay = true) => {
    if (!latexStr) return null;
    try {
      const html = katex.renderToString(latexStr, {
        displayMode: isDisplay,
        throwOnError: false
      });
      return <span dangerouslySetInnerHTML={{ __html: html }} />;
    } catch (e) {
      return <code style={{ fontFamily: 'monospace', color: '#FDE047' }}>{latexStr}</code>;
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Si no hay formulaData estructurada, renderizar texto plano estilizado con tipografía matemática únicamente si hay contenido
  if (!formulaData || !formulaData.formula_latex) {
    if (!rawMecanismos || !rawMecanismos.trim()) return null;
    return (
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
          borderRadius: '16px',
          padding: '16px',
          fontFamily: "'KaTeX_Math', 'Cambria Math', 'STIX Two Math', 'Times New Roman', serif"
        }}
      >
        <div
          style={{
            fontSize: '0.74rem',
            fontWeight: 900,
            color: '#FDE047',
            textTransform: 'uppercase',
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Sigma size={15} /> Fundamento Operacional y Teoremas
        </div>
        <div style={{ fontSize: '0.9rem', color: '#E2E8F0', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
          {rawMecanismos}
        </div>
      </div>
    );
  }

  const {
    teorema_nombre,
    formula_latex,
    formula_simple,
    descripcion,
    despejes = [],
    variables = [],
    fija_unsa
  } = formulaData;

  return (
    <div
      style={{
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%)',
        border: '1.5px solid rgba(245, 158, 11, 0.4)',
        borderRadius: '18px',
        padding: compact ? '14px' : '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Fondo sutil de malla milimétrica matemática */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.08) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          pointerEvents: 'none',
          opacity: 0.7
        }}
      />

      {/* Header con Teorema y Botón de Copiar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div>
          <div
            style={{
              fontSize: '0.68rem',
              fontWeight: 900,
              color: '#FDE047',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sigma size={14} color="#FDE047" />
            <span>NIVEL 1 • TEOREMA O FÓRMULA FUNDAMENTAL</span>
          </div>
          <h4
            style={{
              margin: '3px 0 0 0',
              fontSize: '0.98rem',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.01em'
            }}
          >
            {teorema_nombre}
          </h4>
        </div>

        <button
          type="button"
          onClick={() => handleCopy(formula_latex || formula_simple)}
          title="Copiar fórmula en formato LaTeX"
          style={{
            background: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
            border: copied ? '1px solid #10B981' : '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '10px',
            padding: '6px 10px',
            color: copied ? '#6EE7B7' : '#94A3B8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.72rem',
            fontWeight: 700,
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
        >
          {copied ? <Check size={13} color="#10B981" /> : <Copy size={13} />}
          <span>{copied ? '¡Copiada!' : 'LaTeX'}</span>
        </button>
      </div>

      {/* Pizarra Matemática Principal: Fórmula Base Destacada */}
      <div
        style={{
          background: 'rgba(2, 6, 23, 0.85)',
          border: '1.5px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '14px',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(56, 189, 248, 0.12), inset 0 0 15px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div
          style={{
            fontSize: compact ? '1.25rem' : '1.45rem',
            color: '#38BDF8',
            margin: '4px 0',
            overflowX: 'auto',
            maxWidth: '100%',
            padding: '4px 0',
            filter: 'drop-shadow(0 0 8px rgba(56, 189, 248, 0.3))'
          }}
        >
          {renderMath(formula_latex, true)}
        </div>

        {descripcion && (
          <p
            style={{
              margin: '8px 0 0 0',
              fontSize: '0.8rem',
              color: '#94A3B8',
              lineHeight: 1.45,
              maxWidth: '92%'
            }}
          >
            {descripcion}
          </p>
        )}
      </div>

      {/* Nivel 2: Casos Operacionales y Despejes Evaluados en UNSA */}
      {despejes && despejes.length > 0 && (
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              color: '#C084FC',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={13} color="#C084FC" />
            <span>NIVEL 2 • DESPEJES OPERACIONALES CEPREUNSA</span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '8px'
            }}
          >
            {despejes.map((despeje, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(192, 132, 252, 0.25)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: '#E2E8F0', fontWeight: 700 }}>
                  {despeje.nombre}
                </div>
                <div
                  style={{
                    fontSize: '1rem',
                    color: '#E9D5FF',
                    overflowX: 'auto',
                    padding: '2px 0'
                  }}
                >
                  {renderMath(despeje.latex, false)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nivel 3: Glosario de Variables y Unidades S.I. */}
      {variables && variables.length > 0 && (
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div
            style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              color: '#34D399',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <BookOpen size={13} color="#34D399" />
            <span>NIVEL 3 • NOMENCLATURA DE VARIABLES (S.I.)</span>
          </div>

          <div
            style={{
              background: 'rgba(16, 185, 129, 0.06)',
              border: '1px solid rgba(16, 185, 129, 0.22)',
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '8px'
            }}
          >
            {variables.map((v, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '6px',
                  fontSize: '0.78rem'
                }}
              >
                <span
                  style={{
                    fontFamily: "'KaTeX_Math', 'Cambria Math', 'Times New Roman', serif",
                    fontWeight: 900,
                    color: '#6EE7B7',
                    fontSize: '0.92rem'
                  }}
                >
                  {renderMath(v.simbolo, false)}:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: '#F1F5F9', fontWeight: 600 }}>{v.nombre}</span>
                  <span style={{ color: '#94A3B8', fontSize: '0.7rem' }}>{v.unidad}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nivel 4: Clave Fija de Admisión y Trampas de Conversión */}
      {fija_unsa && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1.5px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '12px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '9px',
            position: 'relative',
            zIndex: 2
          }}
        >
          <AlertCircle size={16} color="#F87171" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 900,
                color: '#F87171',
                textTransform: 'uppercase',
                marginBottom: '2px'
              }}
            >
              CLAVE FIJA CEPREUNSA (TRAMPA FRECUENTE)
            </div>
            <div style={{ fontSize: '0.8rem', color: '#FEE2E2', lineHeight: 1.45, fontWeight: 500 }}>
              {fija_unsa}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormulaDisplay;
