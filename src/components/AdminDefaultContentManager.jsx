import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Trash2, RotateCcw, Sparkles, BookOpen, Layers, HelpCircle, Check, AlertCircle } from 'lucide-react';
import { DEFAULT_FLASHCARDS, DEFAULT_EXAM_QUESTIONS } from '../data/simuladorData';
import { TOMOS, PRACTICAS } from '../data/legacyData';
import { subscribeToSiteSettings, toggleHideDefaultItem, isDefaultItemHidden, getCachedSiteSettings } from '../lib/siteSettings';

export const AdminDefaultContentManager = () => {
  const [siteSettings, setSiteSettings] = useState(getCachedSiteSettings);
  const [subTab, setSubTab] = useState('flashcards'); // 'flashcards' | 'exam' | 'tomos' | 'practicas'
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    const unsub = subscribeToSiteSettings((s) => setSiteSettings(s));
    return () => unsub();
  }, []);

  const showNotification = (msg) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleToggle = async (itemId, itemName) => {
    try {
      const isCurrentlyHidden = isDefaultItemHidden(itemId, siteSettings);
      await toggleHideDefaultItem(itemId);
      showNotification(isCurrentlyHidden ? `"${itemName}" restaurado y visible para todos.` : `"${itemName}" ocultado para todos.`);
    } catch (err) {
      alert("Error al cambiar visibilidad: " + err.message);
    }
  };

  const flashcardsList = DEFAULT_FLASHCARDS.map(fc => {
    const defaultId = `default_fc_${fc.id}`;
    const hidden = isDefaultItemHidden(defaultId, siteSettings) || isDefaultItemHidden(fc.id, siteSettings);
    return {
      id: defaultId,
      originalId: fc.id,
      title: fc.q,
      subtitle: `${fc.subject} • ${fc.a}`,
      hidden
    };
  });

  const examList = DEFAULT_EXAM_QUESTIONS.map(ex => {
    const defaultId = `default_exam_${ex.id}`;
    const hidden = isDefaultItemHidden(defaultId, siteSettings) || isDefaultItemHidden(ex.id, siteSettings);
    return {
      id: defaultId,
      originalId: ex.id,
      title: ex.q,
      subtitle: `Opciones: ${ex.options.join(', ')} • Clave: ${ex.options[ex.answer] || ex.answer}`,
      hidden
    };
  });

  const tomosList = TOMOS.map((tomo, idx) => {
    const title = tomo[0];
    const tomoId = `official-tomo-${(title || '').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || idx}`;
    const hidden = isDefaultItemHidden(tomoId, siteSettings) || isDefaultItemHidden(`default_tomo_${idx}`, siteSettings);
    return {
      id: tomoId,
      originalId: idx,
      title: title,
      subtitle: tomo[1],
      hidden
    };
  });

  const practicasList = PRACTICAS.map((practica, idx) => {
    const title = practica.titulo || practica[0];
    const practicaId = `official-practica-${(title || '').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase() || idx}`;
    const hidden = isDefaultItemHidden(practicaId, siteSettings) || isDefaultItemHidden(`default_practica_${idx}`, siteSettings);
    return {
      id: practicaId,
      originalId: idx,
      title: title,
      subtitle: practica.descripcion || practica[1],
      hidden
    };
  });

  const getActiveList = () => {
    switch (subTab) {
      case 'flashcards': return flashcardsList;
      case 'exam': return examList;
      case 'tomos': return tomosList;
      case 'practicas': return practicasList;
      default: return [];
    }
  };

  const activeList = getActiveList();
  const hiddenCount = activeList.filter(i => i.hidden).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Cabecera Informativa */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(245, 158, 11, 0.08) 100%)', 
        border: '1.5px solid rgba(239, 68, 68, 0.25)', 
        borderRadius: '20px', 
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            width: '38px', 
            height: '38px', 
            borderRadius: '12px', 
            background: 'rgba(239, 68, 68, 0.15)', 
            color: '#EF4444', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <EyeOff size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Gestión de Contenido Predeterminado del Sistema
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Controla qué elementos por defecto (Flashcards, Exámenes rápidos, Tomos y Prácticas oficiales) se muestran u ocultan a los estudiantes en toda la plataforma.
            </p>
          </div>
        </div>

        {actionSuccess && (
          <div style={{ 
            marginTop: '8px', 
            padding: '8px 14px', 
            borderRadius: '10px', 
            background: 'rgba(52, 199, 89, 0.12)', 
            border: '1px solid rgba(52, 199, 89, 0.3)', 
            color: '#34C759', 
            fontSize: '0.85rem', 
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Check size={16} /> {actionSuccess}
          </div>
        )}
      </div>

      {/* Sub-Tabs Selector */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => setSubTab('flashcards')}
          style={{
            padding: '10px 16px',
            borderRadius: '14px',
            border: subTab === 'flashcards' ? 'none' : '1.5px solid var(--card-border)',
            background: subTab === 'flashcards' ? 'linear-gradient(135deg, #007AFF 0%, #00C6FF 100%)' : 'var(--card-bg)',
            color: subTab === 'flashcards' ? '#fff' : 'var(--text-main)',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: subTab === 'flashcards' ? '0 4px 12px rgba(0,122,255,0.3)' : 'none'
          }}
        >
          <Layers size={16} /> Flashcards ({flashcardsList.length})
        </button>

        <button
          type="button"
          onClick={() => setSubTab('exam')}
          style={{
            padding: '10px 16px',
            borderRadius: '14px',
            border: subTab === 'exam' ? 'none' : '1.5px solid var(--card-border)',
            background: subTab === 'exam' ? 'linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)' : 'var(--card-bg)',
            color: subTab === 'exam' ? '#fff' : 'var(--text-main)',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: subTab === 'exam' ? '0 4px 12px rgba(236,72,153,0.3)' : 'none'
          }}
        >
          <HelpCircle size={16} /> Examen Rápido ({examList.length})
        </button>

        <button
          type="button"
          onClick={() => setSubTab('tomos')}
          style={{
            padding: '10px 16px',
            borderRadius: '14px',
            border: subTab === 'tomos' ? 'none' : '1.5px solid var(--card-border)',
            background: subTab === 'tomos' ? 'linear-gradient(135deg, #FF3B30 0%, #FF6B6B 100%)' : 'var(--card-bg)',
            color: subTab === 'tomos' ? '#fff' : 'var(--text-main)',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: subTab === 'tomos' ? '0 4px 12px rgba(255,59,48,0.3)' : 'none'
          }}
        >
          <BookOpen size={16} /> Tomos Oficiales ({tomosList.length})
        </button>

        <button
          type="button"
          onClick={() => setSubTab('practicas')}
          style={{
            padding: '10px 16px',
            borderRadius: '14px',
            border: subTab === 'practicas' ? 'none' : '1.5px solid var(--card-border)',
            background: subTab === 'practicas' ? 'linear-gradient(135deg, #34C759 0%, #30D158 100%)' : 'var(--card-bg)',
            color: subTab === 'practicas' ? '#fff' : 'var(--text-main)',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: subTab === 'practicas' ? '0 4px 12px rgba(52,199,89,0.3)' : 'none'
          }}
        >
          <Sparkles size={16} /> Prácticas Oficiales ({practicasList.length})
        </button>
      </div>

      {/* Info de Estado actual */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
        <span>Mostrando {activeList.length} elementos predeterminados del sistema</span>
        {hiddenCount > 0 && (
          <span style={{ color: '#EF4444', fontWeight: 700 }}>
            {hiddenCount} oculto{hiddenCount > 1 ? 's' : ''} para los estudiantes
          </span>
        )}
      </div>

      {/* Lista de Elementos Predeterminados */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
        {activeList.map((item) => (
          <div
            key={item.id}
            style={{
              background: item.hidden ? 'rgba(239, 68, 68, 0.04)' : 'var(--card-bg)',
              border: item.hidden ? '1.5px dashed rgba(239, 68, 68, 0.35)' : '1.5px solid var(--card-border)',
              borderRadius: '18px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
              opacity: item.hidden ? 0.75 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: item.hidden ? 'rgba(239, 68, 68, 0.12)' : 'rgba(52, 199, 89, 0.12)',
                  color: item.hidden ? '#EF4444' : '#34C759',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {item.hidden ? <EyeOff size={12} /> : <Eye size={12} />}
                  {item.hidden ? 'OCULTO AL PÚBLICO' : 'VISIBLE'}
                </span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  ID: {item.originalId}
                </span>
              </div>

              <h4 style={{ margin: '0 0 6px', fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3 }}>
                {item.title}
              </h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {item.subtitle}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--card-border)' }}>
              <button
                type="button"
                onClick={() => handleToggle(item.id, item.title)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: item.hidden 
                    ? 'linear-gradient(135deg, #34C759, #30D158)' 
                    : 'rgba(239, 68, 68, 0.12)',
                  color: item.hidden ? '#FFFFFF' : '#EF4444',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                {item.hidden ? (
                  <>
                    <RotateCcw size={14} /> Restaurar y Mostrar
                  </>
                ) : (
                  <>
                    <EyeOff size={14} /> Ocultar / Eliminar de Vista
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
