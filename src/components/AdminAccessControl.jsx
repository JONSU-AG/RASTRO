import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Unlock,
  AlertTriangle,
  Key,
  UserCheck,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  Info,
  Save,
  Users,
  Award,
  Search,
  Sparkles
} from 'lucide-react';
import {
  SECTIONS_CONFIG,
  subscribeToAccessSettings,
  saveAccessSettings,
  getCachedAccessSettings
} from '../lib/accessControl';

export const AdminAccessControl = ({ usersList = [] }) => {
  const [settings, setSettings] = useState(getCachedAccessSettings);
  const [selectedSection, setSelectedSection] = useState('cursos');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [newAllowedUser, setNewAllowedUser] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [suggestionSearch, setSuggestionSearch] = useState('');
  const [suggestionFilter, setSuggestionFilter] = useState('all'); // 'all' | 'allies' | 'uploaders'

  // Deduplicación estricta de usuarios registrados
  const uniqueUsers = useMemo(() => {
    const list = [];
    const seen = new Set();
    for (const u of (usersList || [])) {
      const email = (u.email || '').trim().toLowerCase();
      const id = (u.id || u.uid || '').trim();
      const primaryKey = email || id;
      if (!primaryKey || seen.has(primaryKey)) continue;
      seen.add(primaryKey);
      if (id) seen.add(id);
      list.push(u);
    }
    return list;
  }, [usersList]);

  const alliesList = useMemo(() => {
    return uniqueUsers.filter(u => u.isAlly || u.isPremiumAlly);
  }, [uniqueUsers]);

  // Formularios locales por sección
  const [formData, setFormData] = useState({
    status: 'active',
    maintenanceMessage: '',
    accessUser: '',
    accessPass: '',
    allowAllies: true,
    allowedUsers: []
  });

  useEffect(() => {
    const unsubscribe = subscribeToAccessSettings((latest) => {
      setSettings(latest);
    });
    return () => unsubscribe();
  }, []);

  // Cargar sección activa en el formulario local
  useEffect(() => {
    const secConfig = settings[selectedSection] || {
      status: 'active',
      maintenanceMessage: '',
      accessUser: '',
      accessPass: '',
      allowAllies: true,
      allowedUsers: []
    };
    setFormData({
      status: secConfig.status || 'active',
      maintenanceMessage: secConfig.maintenanceMessage || '',
      accessUser: secConfig.accessUser || '',
      accessPass: secConfig.accessPass || '',
      allowAllies: secConfig.allowAllies !== false,
      allowedUsers: Array.isArray(secConfig.allowedUsers) ? [...secConfig.allowedUsers] : []
    });
    setSaveSuccess(false);
  }, [selectedSection, settings]);

  const handleSave = async () => {
    setSaving(true);
    setStatusMessage('');
    try {
      await saveAccessSettings(selectedSection, formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving access settings:', err);
      setStatusMessage('Error al guardar configuración. Revisa tu conexión.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAllowedUser = (userIdentifier) => {
    const trimmed = (userIdentifier || newAllowedUser).trim();
    if (!trimmed) return;
    if (formData.allowedUsers.map(u => u.toLowerCase()).includes(trimmed.toLowerCase())) {
      setStatusMessage('Este correo/usuario ya tiene permiso en la lista.');
      return;
    }

    const updatedList = [...formData.allowedUsers, trimmed];
    setFormData(prev => ({ ...prev, allowedUsers: updatedList }));
    setNewAllowedUser('');
    setStatusMessage('');
  };

  const handleAddAllAllies = () => {
    const currentLower = new Set(formData.allowedUsers.map(u => u.toLowerCase()));
    const newItems = [];
    alliesList.forEach(ally => {
      const email = ally.email?.trim();
      if (email && !currentLower.has(email.toLowerCase())) {
        newItems.push(email);
        currentLower.add(email.toLowerCase());
      }
    });

    if (newItems.length === 0) {
      setStatusMessage('Todos los Aliados ya están autorizados en esta lista.');
      return;
    }

    setFormData(prev => ({ ...prev, allowedUsers: [...prev.allowedUsers, ...newItems] }));
    setStatusMessage(`Se agregaron ${newItems.length} Aliados a la lista de autorizados.`);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const handleRemoveAllowedUser = (targetUser) => {
    const updatedList = formData.allowedUsers.filter(u => u !== targetUser);
    setFormData(prev => ({ ...prev, allowedUsers: updatedList }));
  };

  const currentSectionMeta = SECTIONS_CONFIG.find(s => s.id === selectedSection);

  // Filtrado de sugerencias de usuarios únicos
  const filteredSuggestions = useMemo(() => {
    const term = suggestionSearch.trim().toLowerCase();
    return uniqueUsers.filter(u => {
      if (!u.email) return false;
      // Ya concedido
      if (formData.allowedUsers.some(a => a.toLowerCase() === u.email.toLowerCase())) return false;

      // Filtro de categoría
      if (suggestionFilter === 'allies' && !u.isAlly && !u.isPremiumAlly) return false;
      if (suggestionFilter === 'uploaders' && !(u.uploadCount > 0 || u.aportes > 0)) return false;

      if (!term) return true;
      const name = (u.displayName || u.nombre || '').toLowerCase();
      const mail = u.email.toLowerCase();
      return name.includes(term) || mail.includes(term);
    }).slice(0, 16);
  }, [uniqueUsers, formData.allowedUsers, suggestionSearch, suggestionFilter]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header explicativo discreto */}
      <div className="glass-card" style={{ padding: '20px 24px', borderRadius: '20px', border: '1.5px solid rgba(0, 122, 255, 0.25)', background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.05) 0%, var(--card-bg) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(0, 122, 255, 0.12)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
              Control de Accesos y Mantenimiento de Secciones
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', margin: 0 }}>
              Gestiona el bloqueo temporal por mantenimiento o restringe academias con credenciales y permisos por usuario (estudiantes y Aliados).
            </p>
          </div>
        </div>
      </div>

      {/* Selector de Sección o Academia */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        {SECTIONS_CONFIG.map((sec) => {
          const secStatus = settings[sec.id]?.status || 'active';
          const isSelected = selectedSection === sec.id;

          let badgeColor = '#10B981';
          let badgeBg = 'rgba(16, 185, 129, 0.12)';
          let badgeText = 'Acceso Libre';

          if (secStatus === 'maintenance') {
            badgeColor = '#F59E0B';
            badgeBg = 'rgba(245, 158, 11, 0.15)';
            badgeText = 'Mantenimiento';
          } else if (secStatus === 'credentials') {
            badgeColor = '#A855F7';
            badgeBg = 'rgba(168, 85, 247, 0.15)';
            badgeText = 'Con Clave / Permiso';
          }

          return (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id)}
              className="glass-card"
              style={{
                padding: '16px',
                borderRadius: '16px',
                border: isSelected ? '2px solid var(--accent-color)' : '1.5px solid var(--card-border)',
                background: isSelected ? 'rgba(0, 122, 255, 0.08)' : 'var(--card-bg)',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? '0 6px 18px rgba(0, 122, 255, 0.15)' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  {sec.category}
                </span>
                <span style={{ padding: '2px 8px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, color: badgeColor, background: badgeBg }}>
                  {badgeText}
                </span>
              </div>
              <strong style={{ fontSize: '0.98rem', color: isSelected ? 'var(--accent-color)' : 'var(--text-main)' }}>
                {sec.name}
              </strong>
            </button>
          );
        })}
      </div>

      {/* Editor de la Sección Seleccionada */}
      <div className="glass-card" style={{ padding: '24px', borderRadius: '24px', border: '1.5px solid var(--card-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-color)', textTransform: 'uppercase' }}>
              Configurando:
            </span>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-main)', margin: '2px 0 0' }}>
              {currentSectionMeta?.name}
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {saveSuccess && (
              <span style={{ color: '#10B981', fontSize: '0.84rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={16} /> Cambios guardados correctamente
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: '10px 20px',
                borderRadius: '14px',
                border: 'none',
                background: 'var(--accent-color)',
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: saving ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(0, 122, 255, 0.3)'
              }}
            >
              <Save size={16} />
              <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </div>
        </div>

        {statusMessage && (
          <div style={{ padding: '10px 14px', background: statusMessage.includes('Se agregaron') ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', color: statusMessage.includes('Se agregaron') ? '#10B981' : '#EF4444', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '16px' }}>
            {statusMessage}
          </div>
        )}

        {/* Selector de Modo de Acceso */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase' }}>
            1. Estado de Acceso a la Sección
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {/* Modo Activo */}
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px',
                borderRadius: '16px',
                border: formData.status === 'active' ? '2px solid #10B981' : '1.5px solid var(--card-border)',
                background: formData.status === 'active' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(120, 120, 128, 0.04)',
                cursor: 'pointer'
              }}
            >
              <input
                type="radio"
                name="sectionStatus"
                value="active"
                checked={formData.status === 'active'}
                onChange={() => setFormData(p => ({ ...p, status: 'active' }))}
                style={{ marginTop: '3px' }}
              />
              <div>
                <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                  🟢 Acceso Libre (Abierto)
                </strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>
                  Acceso disponible para todos los estudiantes que hayan iniciado sesión con Google.
                </span>
              </div>
            </label>

            {/* Modo Mantenimiento */}
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px',
                borderRadius: '16px',
                border: formData.status === 'maintenance' ? '2px solid #F59E0B' : '1.5px solid var(--card-border)',
                background: formData.status === 'maintenance' ? 'rgba(245, 158, 11, 0.08)' : 'rgba(120, 120, 128, 0.04)',
                cursor: 'pointer'
              }}
            >
              <input
                type="radio"
                name="sectionStatus"
                value="maintenance"
                checked={formData.status === 'maintenance'}
                onChange={() => setFormData(p => ({ ...p, status: 'maintenance' }))}
                style={{ marginTop: '3px' }}
              />
              <div>
                <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                  🟡 En Mantenimiento
                </strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>
                  Bloquea la sección con tu aviso personalizado explicativo.
                </span>
              </div>
            </label>

            {/* Modo Credenciales */}
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px',
                borderRadius: '16px',
                border: formData.status === 'credentials' ? '2px solid #A855F7' : '1.5px solid var(--card-border)',
                background: formData.status === 'credentials' ? 'rgba(168, 85, 247, 0.08)' : 'rgba(120, 120, 128, 0.04)',
                cursor: 'pointer'
              }}
            >
              <input
                type="radio"
                name="sectionStatus"
                value="credentials"
                checked={formData.status === 'credentials'}
                onChange={() => setFormData(p => ({ ...p, status: 'credentials' }))}
                style={{ marginTop: '3px' }}
              />
              <div>
                <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                  🟣 Con Clave / Autorización
                </strong>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.4, display: 'block', marginTop: '2px' }}>
                  Solicita usuario y contraseña, o permite paso directo a usuarios autorizados.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Parámetros de Mantenimiento */}
        {formData.status === 'maintenance' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ marginBottom: '24px', overflow: 'hidden' }}
          >
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
              2. Mensaje Personalizado de Mantenimiento
            </label>
            <textarea
              rows={3}
              value={formData.maintenanceMessage}
              onChange={(e) => setFormData(p => ({ ...p, maintenanceMessage: e.target.value }))}
              placeholder="Escribe el mensaje que verán los usuarios al intentar ingresar a esta sección..."
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '14px',
                border: '1.5px solid var(--card-border)',
                background: 'rgba(120, 120, 128, 0.06)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
                resize: 'vertical'
              }}
            />
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              💡 Este mensaje se presentará de forma elegante con un botón para regresar a otras áreas de la app.
            </p>
          </motion.div>
        )}

        {/* Parámetros de Credenciales */}
        {formData.status === 'credentials' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{ marginBottom: '24px', overflow: 'hidden' }}
          >
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '10px', textTransform: 'uppercase' }}>
              2. Credenciales Asignadas para esta Academia
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Usuario de Acceso
                </label>
                <input
                  type="text"
                  placeholder="Ej. esparta_2026"
                  value={formData.accessUser}
                  onChange={(e) => setFormData(p => ({ ...p, accessUser: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: '1.5px solid var(--card-border)',
                    background: 'rgba(120, 120, 128, 0.06)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Contraseña / Clave de Acceso
                </label>
                <input
                  type="text"
                  placeholder="Ej. ClaveSecreta123"
                  value={formData.accessPass}
                  onChange={(e) => setFormData(p => ({ ...p, accessPass: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: '1.5px solid var(--card-border)',
                    background: 'rgba(120, 120, 128, 0.06)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              🔒 Cualquier estudiante con estas credenciales podrá ingresar directamente tras verificar su acceso.
            </p>
          </motion.div>
        )}

        {/* ⭐ Control Global de Aliados Oficiales / Premium */}
        <div style={{ padding: '14px 18px', borderRadius: '18px', background: formData.allowAllies !== false ? 'rgba(168, 85, 247, 0.08)' : 'rgba(120, 120, 128, 0.04)', border: '1.5px solid rgba(168, 85, 247, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.15)', color: '#A855F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Award size={20} />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                ⭐ Acceso Automático para Aliados Oficiales / Premium
              </strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                Los usuarios nombrados como Aliados o Aliados Premium tienen acceso directo sin requerir contraseñas.
              </span>
            </div>
          </div>
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={formData.allowAllies !== false}
              onChange={(e) => setFormData(p => ({ ...p, allowAllies: e.target.checked }))}
              style={{ width: '18px', height: '18px', accentColor: '#A855F7', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: formData.allowAllies !== false ? '#A855F7' : 'var(--text-secondary)' }}>
              {formData.allowAllies !== false ? 'Habilitado' : 'Deshabilitado'}
            </span>
          </label>
        </div>

        {/* 3. Permisos Individuales Concedidos a Usuarios */}
        <div style={{ marginTop: '10px', paddingTop: '20px', borderTop: '1px solid var(--card-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '0.86rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserCheck size={18} style={{ color: 'var(--accent-color)' }} />
                3. Usuarios con Acceso Directo Concedido ({formData.allowedUsers.length})
              </label>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Entran automáticamente sin clave, incluso si la sección está protegida
              </span>
            </div>

            {/* Botón rápido para autorizar todos los Aliados */}
            {alliesList.length > 0 && (
              <button
                onClick={handleAddAllAllies}
                style={{
                  padding: '6px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid rgba(168, 85, 247, 0.3)',
                  background: 'rgba(168, 85, 247, 0.1)',
                  color: '#A855F7',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Sparkles size={14} /> Autorizar a Todos los Aliados ({alliesList.length})
              </button>
            )}
          </div>

          {/* Input para agregar usuario */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Correo electrónico (ej. estudiante@gmail.com) o UID"
              value={newAllowedUser}
              onChange={(e) => setNewAllowedUser(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddAllowedUser();
                }
              }}
              style={{
                flex: 1,
                minWidth: '240px',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1.5px solid var(--card-border)',
                background: 'rgba(120, 120, 128, 0.06)',
                color: 'var(--text-main)',
                fontSize: '0.88rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <button
              onClick={() => handleAddAllowedUser()}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(0, 122, 255, 0.15)',
                color: 'var(--accent-color)',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Plus size={16} /> Dar Permiso
            </button>
          </div>

          {/* Buscador y Filtro de sugerencias de usuarios registrados ÚNICOS */}
          {uniqueUsers && uniqueUsers.length > 0 && (
            <div style={{ marginBottom: '16px', padding: '12px', borderRadius: '14px', background: 'rgba(120, 120, 128, 0.04)', border: '1px solid var(--card-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Sugerencias de usuarios registrados (únicos, sin duplicar):
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setSuggestionFilter('all')}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      background: suggestionFilter === 'all' ? 'var(--accent-color)' : 'transparent',
                      color: suggestionFilter === 'all' ? '#fff' : 'var(--text-secondary)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Todos ({uniqueUsers.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSuggestionFilter('allies')}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      background: suggestionFilter === 'allies' ? '#A855F7' : 'transparent',
                      color: suggestionFilter === 'allies' ? '#fff' : 'var(--text-secondary)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    ⭐ Aliados ({alliesList.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSuggestionFilter('uploaders')}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      background: suggestionFilter === 'uploaders' ? '#10B981' : 'transparent',
                      color: suggestionFilter === 'uploaders' ? '#fff' : 'var(--text-secondary)',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    📚 Aportadores
                  </button>
                </div>
              </div>

              {/* Input de búsqueda rápida en sugerencias */}
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                <input
                  type="text"
                  placeholder="Buscar estudiante por nombre o correo..."
                  value={suggestionSearch}
                  onChange={(e) => setSuggestionSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px 6px 30px',
                    borderRadius: '8px',
                    border: '1px solid var(--card-border)',
                    background: 'var(--card-bg)',
                    color: 'var(--text-main)',
                    fontSize: '0.78rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '110px', overflowY: 'auto' }}>
                {filteredSuggestions.map(u => {
                  const isAllyUser = u.isAlly || u.isPremiumAlly;
                  const hasUploads = (u.uploadCount > 0 || u.aportes > 0);
                  return (
                    <button
                      key={u.id || u.uid || u.email}
                      onClick={() => handleAddAllowedUser(u.email)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '8px',
                        border: isAllyUser ? '1px solid rgba(168, 85, 247, 0.4)' : '1px solid var(--card-border)',
                        background: isAllyUser ? 'rgba(168, 85, 247, 0.08)' : 'var(--card-bg)',
                        color: isAllyUser ? '#A855F7' : 'var(--text-main)',
                        fontSize: '0.74rem',
                        fontWeight: isAllyUser ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Plus size={12} />
                      {isAllyUser && '⭐'}
                      {u.email}
                      {u.displayName ? ` (${u.displayName})` : ''}
                      {hasUploads && !isAllyUser && ` • 📚 ${u.uploadCount || u.aportes}`}
                    </button>
                  );
                })}
                {filteredSuggestions.length === 0 && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '4px' }}>
                    No se encontraron usuarios coincidentes o ya fueron autorizados.
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Lista de usuarios con permiso concedido */}
          {formData.allowedUsers.length === 0 ? (
            <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(120, 120, 128, 0.05)', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.84rem' }}>
              Ningún usuario individual agregado aún. Agrega correos arriba para darles acceso exclusivo.
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {formData.allowedUsers.map((usr) => (
                <div
                  key={usr}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    color: 'var(--text-main)',
                    fontSize: '0.84rem',
                    fontWeight: 600
                  }}
                >
                  <UserCheck size={14} style={{ color: '#10B981' }} />
                  <span>{usr}</span>
                  <button
                    onClick={() => handleRemoveAllowedUser(usr)}
                    title="Quitar permiso"
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#EF4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '2px'
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
