import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Save,
  RotateCcw,
  Search,
  CheckCircle2,
  Sparkles,
  Layout,
  BookOpen,
  HelpCircle,
  Plus,
  Trash2,
  Edit3
} from 'lucide-react';
import {
  DEFAULT_SITE_TEXTS,
  subscribeToSiteTexts,
  saveSiteTexts,
  getCachedSiteTexts
} from '../lib/siteTexts';

const TEXT_SECTIONS = [
  {
    id: 'hero',
    name: '🏠 Inicio & Encabezado Principal (Hero)',
    keys: [
      { key: 'home_welcome_badge', label: 'Badge superior de bienvenida', multiline: false },
      { key: 'home_hero_title_prefix', label: 'Prefijo del Título Principal', multiline: false },
      { key: 'home_hero_subtitle', label: 'Subtítulo descriptivo de la plataforma', multiline: true },
      { key: 'home_legal_title', label: 'Título de la tarjeta legal / informativa', multiline: false },
      { key: 'home_legal_desc', label: 'Descripción de la tarjeta legal / informativa', multiline: true },
      { key: 'home_courses_title', label: 'Título de la sección de cursos y academias', multiline: false },
      { key: 'home_courses_subtitle', label: 'Subtítulo de la sección de cursos', multiline: false }
    ]
  },
  {
    id: 'biblioteca',
    name: '📚 Biblioteca & Aportes de la Comunidad',
    keys: [
      { key: 'biblio_title', label: 'Título principal de la Biblioteca', multiline: false },
      { key: 'biblio_subtitle', label: 'Subtítulo de la Biblioteca', multiline: true },
      { key: 'biblio_tab_docs', label: 'Etiqueta pestaña "Documentos"', multiline: false },
      { key: 'biblio_tab_community', label: 'Etiqueta pestaña "Comunidad"', multiline: false },
      { key: 'biblio_tab_books', label: 'Etiqueta pestaña "Libros y Colecciones"', multiline: false },
      { key: 'biblio_upload_prompt', label: 'Frase de motivación para aportar material', multiline: false }
    ]
  },
  {
    id: 'libros',
    name: '📕 Colecciones de Libros & Tomos',
    keys: [
      { key: 'books_section_title', label: 'Título de la sección de Libros', multiline: false },
      { key: 'books_section_desc', label: 'Descripción de la sección de Libros', multiline: true },
      { key: 'books_empty_title', label: 'Título cuando no hay libros disponibles', multiline: false },
      { key: 'books_empty_desc', label: 'Mensaje cuando no hay libros disponibles', multiline: false }
    ]
  },
  {
    id: 'simulador',
    name: '🎯 Simulador de Exámenes',
    keys: [
      { key: 'simulador_title', label: 'Título del Simulador', multiline: false },
      { key: 'simulador_subtitle', label: 'Subtítulo del Simulador', multiline: true }
    ]
  },
  {
    id: 'footer',
    name: '🔻 Pie de Página & Avisos Generales',
    keys: [
      { key: 'footer_text', label: 'Texto principal del pie de página', multiline: false },
      { key: 'footer_disclaimer', label: 'Aviso legal / Descargo de responsabilidad', multiline: true }
    ]
  }
];

export const AdminTextControl = () => {
  const [texts, setTexts] = useState(getCachedSiteTexts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Claves dinámicas personalizadas añadidas por el admin
  const [customKeyName, setCustomKeyName] = useState('');
  const [customKeyValue, setCustomKeyValue] = useState('');

  useEffect(() => {
    const unsub = subscribeToSiteTexts((latest) => {
      setTexts(latest);
    });
    return () => unsub();
  }, []);

  const handleChange = (key, value) => {
    setTexts(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetKey = (key) => {
    const defaultVal = DEFAULT_SITE_TEXTS[key] || '';
    handleChange(key, defaultVal);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setStatusMessage('');
    try {
      await saveSiteTexts(texts);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
      setStatusMessage('✅ Todos los textos se guardaron y sincronizaron en tiempo real.');
    } catch (err) {
      console.error(err);
      setStatusMessage('❌ Error al guardar los textos. Verifica tu conexión.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCustomKey = () => {
    const trimmedKey = customKeyName.trim().toLowerCase().replace(/\s+/g, '_');
    if (!trimmedKey) return;
    if (texts[trimmedKey] !== undefined) {
      setStatusMessage(`La clave "${trimmedKey}" ya existe.`);
      return;
    }
    setTexts(prev => ({
      ...prev,
      [trimmedKey]: customKeyValue.trim()
    }));
    setCustomKeyName('');
    setCustomKeyValue('');
    setStatusMessage(`Clave "${trimmedKey}" agregada. Recuerda pulsar "Guardar Textos".`);
  };

  const handleDeleteCustomKey = (key) => {
    setTexts(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  // Identificar claves personalizadas que no están en DEFAULT_SITE_TEXTS
  const customKeys = Object.keys(texts).filter(k => DEFAULT_SITE_TEXTS[k] === undefined);

  // Filtrado de secciones según búsqueda
  const filteredSections = TEXT_SECTIONS.map(sec => {
    if (selectedSection !== 'all' && selectedSection !== sec.id) {
      return null;
    }
    const filteredKeys = sec.keys.filter(item => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const currentVal = (texts[item.key] || '').toLowerCase();
      const label = item.label.toLowerCase();
      const keyName = item.key.toLowerCase();
      return label.includes(q) || currentVal.includes(q) || keyName.includes(q);
    });
    if (filteredKeys.length === 0) return null;
    return { ...sec, keys: filteredKeys };
  }).filter(Boolean);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '960px', margin: '0 auto' }}>
      {/* Header explicativo */}
      <div
        className="glass-card"
        style={{
          padding: '24px',
          borderRadius: '24px',
          border: '1.5px solid rgba(168, 85, 247, 0.3)',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, var(--card-bg) 100%)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '16px',
                background: 'rgba(168, 85, 247, 0.15)',
                color: '#A855F7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Edit3 size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
                Control Total de Textos (Editor CMS del Sitio) ✍️
              </h2>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                Edita cualquier título, subtítulo o frase de la plataforma sin necesidad de tocar código. Los cambios se reflejan al instante.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {saveSuccess && (
              <span style={{ color: '#10B981', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={16} /> ¡Guardado!
              </span>
            )}
            <button
              onClick={handleSaveAll}
              disabled={saving}
              style={{
                padding: '12px 22px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #A855F7, #6366F1)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: saving ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 6px 18px rgba(168, 85, 247, 0.35)'
              }}
            >
              <Save size={18} />
              <span>{saving ? 'Guardando...' : 'Guardar Todos los Textos'}</span>
            </button>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '12px',
            background: statusMessage.includes('✅') ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            color: statusMessage.includes('✅') ? '#10B981' : '#EF4444',
            fontSize: '0.88rem',
            fontWeight: 700
          }}
        >
          {statusMessage}
        </div>
      )}

      {/* Barra de Filtros y Búsqueda */}
      <div
        className="glass-card"
        style={{
          padding: '16px',
          borderRadius: '18px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder="🔍 Buscar texto o frase a corregir..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: '12px',
              border: '1.5px solid var(--card-border)',
              background: 'rgba(120, 120, 128, 0.05)',
              color: 'var(--text-main)',
              fontSize: '0.88rem',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedSection('all')}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              border: 'none',
              background: selectedSection === 'all' ? 'var(--accent-color)' : 'rgba(120, 120, 128, 0.08)',
              color: selectedSection === 'all' ? '#fff' : 'var(--text-main)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Todas las Secciones
          </button>
          {TEXT_SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedSection(s.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '10px',
                border: 'none',
                background: selectedSection === s.id ? '#A855F7' : 'rgba(120, 120, 128, 0.08)',
                color: selectedSection === s.id ? '#fff' : 'var(--text-main)',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {s.name.split(' ')[0]} {s.id.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Secciones con sus Inputs Editables */}
      {filteredSections.map(sec => (
        <div
          key={sec.id}
          className="glass-card"
          style={{
            padding: '22px',
            borderRadius: '20px',
            border: '1.5px solid var(--card-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {sec.name}
            </h3>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {sec.keys.length} campos editables
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {sec.keys.map(item => {
              const currentVal = texts[item.key] !== undefined ? texts[item.key] : (DEFAULT_SITE_TEXTS[item.key] || '');
              const isModified = currentVal !== DEFAULT_SITE_TEXTS[item.key];

              return (
                <div
                  key={item.key}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    padding: '14px',
                    borderRadius: '14px',
                    background: 'rgba(120, 120, 128, 0.03)',
                    border: isModified ? '1.5px solid rgba(168, 85, 247, 0.35)' : '1px solid var(--card-border)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <label style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-main)' }}>
                        {item.label}
                      </label>
                      <code style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', background: 'rgba(120, 120, 128, 0.1)', padding: '2px 6px', borderRadius: '6px' }}>
                        {item.key}
                      </code>
                    </div>

                    {isModified && (
                      <button
                        type="button"
                        onClick={() => handleResetKey(item.key)}
                        title="Restaurar valor original por defecto"
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#F59E0B',
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <RotateCcw size={12} /> Restaurar original
                      </button>
                    )}
                  </div>

                  {item.multiline ? (
                    <textarea
                      rows={3}
                      value={currentVal}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      placeholder={`Escribe el texto para ${item.label}...`}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid var(--card-border)',
                        background: 'var(--card-bg)',
                        color: 'var(--text-main)',
                        fontSize: '0.88rem',
                        lineHeight: 1.5,
                        outline: 'none',
                        boxSizing: 'border-box',
                        resize: 'vertical'
                      }}
                    />
                  ) : (
                    <input
                      type="text"
                      value={currentVal}
                      onChange={(e) => handleChange(item.key, e.target.value)}
                      placeholder={`Escribe el texto para ${item.label}...`}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid var(--card-border)',
                        background: 'var(--card-bg)',
                        color: 'var(--text-main)',
                        fontSize: '0.88rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Sección de Claves de Texto Personalizadas (Dinámicas) */}
      <div
        className="glass-card"
        style={{
          padding: '22px',
          borderRadius: '20px',
          border: '1.5px solid var(--card-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={20} color="#A855F7" />
          <h3 style={{ margin: 0, fontSize: '1.08rem', fontWeight: 800, color: 'var(--text-main)' }}>
            Campos de Texto Personalizados Adicionales
          </h3>
        </div>
        <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
          ¿Quieres guardar otro texto libre para la plataforma? Ingresa una clave (ej: <code>aviso_urgente_marzo</code>) y su contenido.
        </p>

        {/* Input para agregar nueva clave */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr)) auto', gap: '8px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Identificador Clave (sin espacios)
            </label>
            <input
              type="text"
              placeholder="ej: anuncio_especial_unsa"
              value={customKeyName}
              onChange={(e) => setCustomKeyName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid var(--card-border)',
                background: 'var(--card-bg)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Texto o Mensaje
            </label>
            <input
              type="text"
              placeholder="Escribe el texto..."
              value={customKeyValue}
              onChange={(e) => setCustomKeyValue(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid var(--card-border)',
                background: 'var(--card-bg)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleAddCustomKey}
            style={{
              padding: '10px 16px',
              borderRadius: '10px',
              border: 'none',
              background: 'rgba(168, 85, 247, 0.15)',
              color: '#A855F7',
              fontWeight: 800,
              fontSize: '0.86rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '42px'
            }}
          >
            <Plus size={16} /> Agregar Clave
          </button>
        </div>

        {/* Lista de claves personalizadas existentes */}
        {customKeys.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-secondary)' }}>
              Claves registradas ({customKeys.length}):
            </span>
            {customKeys.map(k => (
              <div
                key={k}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(120, 120, 128, 0.05)',
                  border: '1px solid var(--card-border)'
                }}
              >
                <div style={{ flex: 1 }}>
                  <code style={{ fontSize: '0.82rem', fontWeight: 700, color: '#A855F7' }}>{k}</code>
                  <input
                    type="text"
                    value={texts[k] || ''}
                    onChange={(e) => handleChange(k, e.target.value)}
                    style={{
                      width: '100%',
                      marginTop: '4px',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: '1px solid var(--card-border)',
                      background: 'var(--card-bg)',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteCustomKey(k)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#EF4444',
                    cursor: 'pointer',
                    padding: '6px'
                  }}
                  title="Eliminar clave personalizada"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón flotante inferior para guardar */}
      <div style={{ position: 'sticky', bottom: '20px', zIndex: 10, display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          style={{
            padding: '14px 28px',
            borderRadius: '30px',
            border: 'none',
            background: 'linear-gradient(135deg, #A855F7, #6366F1)',
            color: '#fff',
            fontWeight: 900,
            fontSize: '0.98rem',
            cursor: saving ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 30px rgba(168, 85, 247, 0.45)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Save size={20} />
          <span>{saving ? 'Guardando...' : 'Guardar Todos los Cambios'}</span>
        </button>
      </div>
    </div>
  );
};
