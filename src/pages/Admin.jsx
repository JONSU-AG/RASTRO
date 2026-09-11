import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Search, 
  CheckCircle, 
  AlertTriangle, 
  Trash2, 
  Edit3, 
  Eye, 
  ExternalLink, 
  Users, 
  FileText, 
  Save, 
  X, 
  RefreshCw,
  Award,
  UserX,
  UserCheck,
  Ban,
  Plus,
  Star,
  Sparkles,
  UploadCloud,
  Megaphone,
  Flag,
  MessageSquare,
  Bell,
  Send,
  ShieldAlert,
  Check,
  Copy,
  Code,
  Download,
  Lock,
  BookOpen
} from 'lucide-react';
import { db } from '../lib/firebase';
import { uploadFileReliable, getDirectImageUrl } from '../lib/storageHelper';
import { searchMatches } from '../lib/searchHelper';
import { useAuth, ADMIN_EMAILS } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { LiveUserAvatar } from '../components/LiveUserAvatar';
import { AdminAccessControl } from '../components/AdminAccessControl';
import { AdminTextControl } from '../components/AdminTextControl';
import { AdminCursosManager } from '../components/AdminCursosManager';
import { AdminBricenoManager } from '../components/AdminBricenoManager';
import { AdminAcademiasManager } from '../components/AdminAcademiasManager';
import { AdminDefaultContentManager } from '../components/AdminDefaultContentManager';
import { LibrosCollectionModal } from '../components/LibrosCollectionModal';
import { subscribeToSiteSettings, saveSiteSettings, getCachedSiteSettings } from '../lib/siteSettings';
import { 
  collection, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc, 
  addDoc,
  setDoc,
  query, 
  orderBy,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { ConfirmModal, NoticeModal } from '../components/ConfirmModal';

const LibrosAdminPanel = ({ onNotice }) => {
  const [nombre, setNombre] = React.useState('');
  const [editorial, setEditorial] = React.useState('');
  const [portadaUrl, setPortadaUrl] = React.useState('');
  const [descripcion, setDescripcion] = React.useState('');
  const [uploadingCover, setUploadingCover] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [libros, setLibros] = React.useState([]);
  const [selectedCollection, setSelectedCollection] = React.useState(null);
  const [bulkJson, setBulkJson] = React.useState('');
  const [bulkEditorial, setBulkEditorial] = React.useState('');
  const [bulkImporting, setBulkImporting] = React.useState(false);
  const [showBulk, setShowBulk] = React.useState(false);
  const [editingCollectionId, setEditingCollectionId] = React.useState(null);
  const [editArrayJson, setEditArrayJson] = React.useState('');
  const [savingEdit, setSavingEdit] = React.useState(false);

  React.useEffect(() => {
    const q = query(collection(db, 'libros'), orderBy('orden', 'asc'));
    const u = onSnapshot(q, (s) => setLibros(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => u();
  }, []);

  const handleUploadCover = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const url = await uploadFileReliable(file, null, 'libros_portadas');
      if (url) {
        setPortadaUrl(url);
        if (onNotice) onNotice('Portada Subida', 'Imagen de portada cargada exitosamente.');
      }
    } catch (err) {
      if (onNotice) onNotice('Error al Subir', err.message);
    } finally {
      setUploadingCover(false);
    }
  };

  const addLibro = async (e) => {
    e?.preventDefault();
    if (!nombre.trim()) return;
    setCreating(true);
    try {
      await addDoc(collection(db, 'libros'), {
        nombre: nombre.trim(),
        editorial: editorial.trim() || 'Editorial Oficial',
        portadaUrl: portadaUrl.trim() || '',
        descripcion: descripcion.trim() || '',
        orden: libros.length,
        recursos: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setNombre('');
      setEditorial('');
      setPortadaUrl('');
      setDescripcion('');
      if (onNotice) onNotice('Colección Creada', `La colección "${nombre}" fue creada exitosamente.`);
    } catch (err) {
      if (onNotice) onNotice('Error', err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleBulkImport = async () => {
    if (!bulkJson.trim()) return;
    setBulkImporting(true);
    try {
      let raw = bulkJson.trim();
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        try {
          let fixed = raw.replace(/'/g, '"');
          fixed = fixed.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
          fixed = fixed.replace(/([{,]\s*)([a-zA-Z_]\w*)\s*:/g, '$1"$2":');
          parsed = JSON.parse(fixed);
        } catch {
          throw new Error('Formato no válido. Asegúrate de pegar un JSON válido (array de libros o colecciones/cursos).');
        }
      }

      let editorialBase = bulkEditorial.trim();
      let collectionsMap = parsed;

      // Normalización de estructuras anidadas con "items"
      if (Array.isArray(collectionsMap) && collectionsMap.length > 0) {
        // Caso A: Array donde cada elemento es una colección con "items": [{ nombre: "LUMBRERAS AZULES", items: [...] }, { nombre: "LUMBRERAS ROJOS", items: [...] }]
        if (collectionsMap.every(el => typeof el === 'object' && (Array.isArray(el.items) || Array.isArray(el.recursos)))) {
          const newMap = {};
          collectionsMap.forEach(group => {
            const groupName = group.nombre || group.title || 'General';
            const groupBooks = group.items || group.recursos || [];
            
            // Si además tiene sub-grupos con "items": [{ nombre: "CUZCANO", items: [{ nombre: "QUÍMICA", items: [...] }] }]
            if (groupBooks.length > 0 && Array.isArray(groupBooks[0]?.items)) {
              groupBooks.forEach(sub => {
                const subName = `${groupName} - ${sub.nombre || sub.title || 'General'}`;
                newMap[subName] = sub.items || sub.recursos || [];
              });
            } else {
              newMap[groupName] = groupBooks;
            }
          });
          collectionsMap = newMap;
        }
      }

      if (!editorialBase) editorialBase = 'Editorial Oficial';

      // CASO A: Objeto con claves por curso/colección. Ej: { "Álgebra": [...], "Física": [...] }
      if (typeof collectionsMap === 'object' && !Array.isArray(collectionsMap)) {
        let totalCount = 0;
        for (const [colName, colBooks] of Object.entries(collectionsMap)) {
          if (!Array.isArray(colBooks)) continue;
          const validBooks = colBooks.filter(b => b.nombre || b.title).map((b, i) => ({
            id: 'book_' + Date.now() + '_' + i + '_' + Math.random().toString(36).substring(2, 7),
            nombre: b.nombre || b.title || '',
            url: b.url || b.link || b.driveUrl || b.enlace || '',
            autor: b.autor || b.author || editorialBase,
            desc: b.desc || b.descripcion || b.description || '',
            portadaUrl: b.portadaUrl || b.portada || b.cover || '',
            addedAt: new Date().toISOString()
          }));
          if (validBooks.length === 0) continue;

          const fullName = (editorialBase === 'Editorial Oficial' || colName.toLowerCase().startsWith(editorialBase.toLowerCase())) 
            ? colName 
            : `${editorialBase} - ${colName}`;
          let targetCollection = libros.find(l => l.nombre.toLowerCase() === fullName.toLowerCase() || l.nombre.toLowerCase() === colName.toLowerCase());

          if (!targetCollection) {
            await addDoc(collection(db, 'libros'), {
              nombre: fullName,
              editorial: editorialBase !== 'Editorial Oficial' ? editorialBase : 'Editorial Oficial',
              portadaUrl: '',
              descripcion: `Colección de ${colName} (${editorialBase})`,
              orden: libros.length,
              recursos: validBooks,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          } else {
            const existingRecursos = [...(targetCollection.recursos || [])];
            validBooks.forEach(nb => {
              const idx = existingRecursos.findIndex(r => r.nombre === nb.nombre);
              if (idx >= 0) {
                if (!existingRecursos[idx].url && nb.url) {
                  existingRecursos[idx] = { ...existingRecursos[idx], url: nb.url, link: nb.url };
                }
              } else {
                existingRecursos.push(nb);
              }
            });
            const docRef = doc(db, 'libros', targetCollection.id);
            await updateDoc(docRef, { recursos: existingRecursos, updatedAt: new Date() });
          }
          totalCount += validBooks.length;
        }

        if (onNotice) onNotice('Importación Múltiple Completada', `Se procesaron las colecciones organizadas de ${editorialBase} con un total de ${totalCount} tomos.`);
      }
      // CASO B: Array de colecciones agrupadas [{ nombre: "Álgebra", recursos: [...] }]
      else if (Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0].recursos)) {
        let totalCount = 0;
        for (const colObj of parsed) {
          const colName = colObj.nombre || colObj.title || colObj.coleccion || 'General';
          const validBooks = (colObj.recursos || []).filter(b => b.nombre || b.title).map((b, i) => ({
            id: 'book_' + Date.now() + '_' + i + '_' + Math.random().toString(36).substring(2, 7),
            nombre: b.nombre || b.title || '',
            url: b.url || b.link || b.driveUrl || b.enlace || '',
            autor: b.autor || b.author || colObj.editorial || editorialBase,
            desc: b.desc || b.descripcion || b.description || '',
            portadaUrl: b.portadaUrl || b.portada || b.cover || '',
            addedAt: new Date().toISOString()
          }));
          if (validBooks.length === 0) continue;

          const fullName = colObj.editorial ? `${colObj.editorial} - ${colName}` : (editorialBase !== 'Editorial Oficial' ? `${editorialBase} - ${colName}` : colName);
          let targetCollection = libros.find(l => l.nombre.toLowerCase() === fullName.toLowerCase() || l.nombre.toLowerCase() === colName.toLowerCase());

          if (!targetCollection) {
            await addDoc(collection(db, 'libros'), {
              nombre: fullName,
              editorial: colObj.editorial || editorialBase,
              portadaUrl: colObj.portadaUrl || '',
              descripcion: colObj.descripcion || `Colección de ${colName}`,
              orden: libros.length,
              recursos: validBooks,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          } else {
            const existingRecursos = [...(targetCollection.recursos || [])];
            validBooks.forEach(nb => {
              const idx = existingRecursos.findIndex(r => r.nombre === nb.nombre);
              if (idx >= 0) {
                if (!existingRecursos[idx].url && nb.url) {
                  existingRecursos[idx] = { ...existingRecursos[idx], url: nb.url, link: nb.url };
                }
              } else {
                existingRecursos.push(nb);
              }
            });
            const docRef = doc(db, 'libros', targetCollection.id);
            await updateDoc(docRef, { recursos: existingRecursos, updatedAt: new Date() });
          }
          totalCount += validBooks.length;
        }

        if (onNotice) onNotice('Importación de Grupos Exitosa', `Se procesaron las colecciones organizadas con ${totalCount} tomos.`);
      }
      // CASO C: Array de libros simple [{ nombre: "Libro 1", url: "..." }]
      else {
        const arr = Array.isArray(parsed) ? parsed : [parsed];
        const validBooks = arr.filter(b => b.nombre || b.title).map((b, i) => ({
          id: 'book_' + Date.now() + '_' + i + '_' + Math.random().toString(36).substring(2, 7),
          nombre: b.nombre || b.title || '',
          url: b.url || b.link || b.driveUrl || b.enlace || '',
          autor: b.autor || b.author || editorialBase,
          desc: b.desc || b.descripcion || b.description || '',
          portadaUrl: b.portadaUrl || b.portada || b.cover || '',
          addedAt: new Date().toISOString()
        }));
        if (validBooks.length === 0) throw new Error('No se encontraron libros válidos.');

        let targetCollection = libros.find(l => l.nombre.toLowerCase() === editorialBase.toLowerCase());

        if (!targetCollection) {
          await addDoc(collection(db, 'libros'), {
            nombre: editorialBase,
            editorial: editorialBase,
            portadaUrl: '',
            descripcion: '',
            orden: libros.length,
            recursos: validBooks,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          if (onNotice) onNotice('Colección Creada + Importados', `"${editorialBase}" creada con ${validBooks.length} libros.`);
        } else {
          const existingRecursos = [...(targetCollection.recursos || [])];
          let updatedCount = 0;
          let addedCount = 0;

          validBooks.forEach(nb => {
            const idx = existingRecursos.findIndex(r => r.nombre === nb.nombre);
            if (idx >= 0) {
              // Si ya existía pero no tenía URL y ahora sí viene URL, lo actualizamos
              if (!existingRecursos[idx].url && nb.url) {
                existingRecursos[idx] = { ...existingRecursos[idx], url: nb.url, link: nb.url };
                updatedCount++;
              }
            } else {
              existingRecursos.push(nb);
              addedCount++;
            }
          });

          if (updatedCount === 0 && addedCount === 0) throw new Error('Todos los libros ya existen en esa colección y no tenían nuevas URLs.');
          const docRef = doc(db, 'libros', targetCollection.id);
          await updateDoc(docRef, { recursos: existingRecursos, updatedAt: new Date() });
          if (onNotice) onNotice('Colección Actualizada', `Se agregaron ${addedCount} libros nuevos y se actualizaron las URLs de ${updatedCount} libros.`);
        }
      }

      setBulkJson('');
      setBulkEditorial('');
      setShowBulk(false);
    } catch (err) {
      if (onNotice) onNotice('Error de Importación', err.message);
    } finally {
      setBulkImporting(false);
    }
  };

  const handleSaveEditedArray = async (collectionId) => {
    if (!editArrayJson.trim()) return;
    setSavingEdit(true);
    try {
      let raw = editArrayJson.trim();
      const firstBracket = raw.indexOf('[');
      const lastBracket = raw.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket !== -1) raw = raw.substring(firstBracket, lastBracket + 1);
      let parsed;
      try { parsed = JSON.parse(raw); } catch {
        try {
          let fixed = raw.replace(/'/g, '"');
          fixed = fixed.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');
          fixed = fixed.replace(/([{,]\s*)([a-zA-Z_]\w*)\s*:/g, '$1"$2":');
          parsed = JSON.parse(fixed);
        } catch { throw new Error('Formato no válido.'); }
      }
      const arr = Array.isArray(parsed) ? parsed : [parsed];
      const validBooks = arr.filter(b => b.nombre || b.title).map((b, i) => ({
        id: 'book_' + Date.now() + '_' + i + '_' + Math.random().toString(36).substring(2, 7),
        nombre: b.nombre || b.title || '',
        url: b.url || b.enlace || '',
        autor: b.autor || b.author || '',
        desc: b.desc || b.descripcion || b.description || '',
        portadaUrl: b.portadaUrl || b.portada || b.cover || '',
        addedAt: new Date().toISOString()
      }));
      const docRef = doc(db, 'libros', collectionId);
      await updateDoc(docRef, { recursos: validBooks, updatedAt: new Date() });
      const col = libros.find(l => l.id === collectionId);
      if (onNotice) onNotice('Guardado', `"${col?.nombre}" actualizada con ${validBooks.length} libros.`);
      setEditingCollectionId(null);
      setEditArrayJson('');
    } catch (err) {
      if (onNotice) onNotice('Error al Guardar', err.message);
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h3 style={{ margin: 0, fontWeight: 900, fontSize: '1.25rem', color: 'var(--text-main)' }}>
            📚 Gestor de Colecciones de Libros & Tomos
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            Crea colecciones (ej. "Lumbreras Libros Rojos", "Cuzcano") y agrega tomos con sus portadas y enlaces de lectura.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => {
              const promptText = `Por favor formatea la siguiente lista de libros en un JSON agrupado por CURSOS bajo una EDITORIAL PRINCIPAL.

Puedes usar cualquiera de las siguientes estructuras válidas:

Estructura Opción 1 (Lista con items):
[
  {
    "nombre": "EDITORIAL CUZCANO",
    "items": [
      {
        "nombre": "QUÍMICA",
        "items": [
          { "nombre": "Tomo 1 Química", "link": "https://drive.google.com/file/d/..." }
        ]
      },
      {
        "nombre": "FÍSICA",
        "items": [
          { "nombre": "Tomo 1 Física", "link": "https://drive.google.com/file/d/..." }
        ]
      }
    ]
  }
]

Estructura Opción 2 (Objeto por Cursos):
{
  "EDITORIAL CUZCANO": {
    "Álgebra": [
      { "nombre": "Tomo 1", "link": "https://drive.google.com/file/d/..." }
    ],
    "Química": [
      { "nombre": "Tomo 1", "link": "https://drive.google.com/file/d/..." }
    ]
  }
}

Responde ÚNICAMENTE con el código JSON sin texto adicional ni explicaciones.
Aquí está la lista de archivos:
[PEGA AQUÍ TU LISTA DE LIBROS Y ENLACES]`;
              navigator.clipboard.writeText(promptText);
              if (onNotice) onNotice('📋 Prompt Copiado', 'Prompt para Colección Anidada (ej. CUZCANO con Cursos) copiado al portapapeles.');
            }}
            style={{
              padding: '9px 16px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #10B981, #059669)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
            }}
          >
            <Copy size={15} />
            <span>Prompt IA: Editorial + Cursos Anidados</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const promptText = `Por favor formatea la siguiente lista de libros/archivos en un arreglo de objetos en formato JSON limpio y válido para importar a mi aplicación.

Estructura requerida:
[
  {
    "nombre": "Nombre del Libro o Tomo",
    "link": "https://drive.google.com/file/d/..."
  }
]

Responde ÚNICAMENTE con el código JSON sin texto adicional ni explicaciones.
Aquí está la lista de archivos:
[PEGA AQUÍ TU LISTA DE LIBROS Y ENLACES]`;
              navigator.clipboard.writeText(promptText);
              if (onNotice) onNotice('📋 Prompt Copiado', 'Prompt para Array Simple copiado al portapapeles.');
            }}
            style={{
              padding: '9px 16px',
              borderRadius: '14px',
              border: 'none',
              background: 'linear-gradient(135deg, #A855F7, #6366F1)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(168, 85, 247, 0.3)'
            }}
          >
            <Copy size={15} />
            <span>Prompt IA: Lista Simple</span>
          </button>
        </div>
      </div>

      {/* Formulario para crear nueva colección */}
      <form onSubmit={addLibro} className="glass-card" style={{ padding: '18px', borderRadius: '18px', border: '1.5px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
          + Crear Nueva Colección de Libros
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px', minWidth: 0 }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Nombre de la Colección *
              </label>
              <input
                required
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Ej. Lumbreras - Libros Rojos"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-main)', fontSize: '0.86rem', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ flex: '1 1 200px', minWidth: 0 }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Editorial o Autor
              </label>
              <input
                value={editorial}
                onChange={e => setEditorial(e.target.value)}
                placeholder="Ej. Lumbreras Editores / Cuzcano"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-main)', fontSize: '0.86rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 200px', minWidth: 0 }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                URL de Portada
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  value={portadaUrl}
                  onChange={e => setPortadaUrl(e.target.value)}
                  placeholder="https://... o sube una imagen"
                  style={{ flex: 1, padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-main)', fontSize: '0.86rem', boxSizing: 'border-box' }}
                />
                <label style={{ padding: '8px 12px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.12)', color: '#A855F7', fontSize: '0.8rem', fontWeight: 700, cursor: uploadingCover ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                  <UploadCloud size={14} />
                  <span>{uploadingCover ? 'Subiendo...' : 'Subir'}</span>
                  <input type="file" accept="image/*" onChange={handleUploadCover} style={{ display: 'none' }} disabled={uploadingCover} />
                </label>
              </div>
            </div>

            <div style={{ flex: '1 1 200px', minWidth: 0 }}>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Descripción Breve
              </label>
              <input
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                placeholder="Ej. Tomos completos de teoría y problemas resueltos"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-main)', fontSize: '0.86rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
          <button
            type="submit"
            disabled={creating || !nombre.trim()}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #A855F7, #6366F1)',
              color: '#fff',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: creating ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Plus size={16} />
            <span>{creating ? 'Creando...' : 'Crear Colección'}</span>
          </button>
        </div>
      </form>

      {/* Importación masiva de libros */}
      <div className="glass-card" style={{ padding: '18px', borderRadius: '18px', border: '1.5px solid var(--card-border)' }}>
        <button
          type="button"
          onClick={() => setShowBulk(!showBulk)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', width: '100%', textAlign: 'left', padding: 0
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>📋</span>
          <span>Importar Array de Libros (JSON)</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'var(--text-secondary)', transition: 'transform 0.2s', transform: showBulk ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
        </button>

        {showBulk && (
          <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Nombre de la Editorial / Colección *
              </label>
              <input
                value={bulkEditorial}
                onChange={e => setBulkEditorial(e.target.value)}
                placeholder="Ej. EDITORIAL UNI"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-main)', fontSize: '0.86rem', boxSizing: 'border-box' }}
              />
              <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                Si no existe se crea automáticamente. Si ya existe, actualiza los tomos y sus URLs.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Pega el array JSON:
              </span>
              <button
                type="button"
                onClick={() => {
                  const promptText = `Por favor formatea la siguiente lista de libros/archivos en un arreglo de objetos en formato JSON limpio y válido para importar a mi aplicación.

Estructura requerida:
[
  {
    "nombre": "Nombre del Libro o Tomo",
    "link": "https://drive.google.com/file/d/..."
  }
]

O si son varios cursos agrupados:
{
  "Álgebra": [
    { "nombre": "Tomo 1", "link": "https://drive.google.com/..." }
  ],
  "Física": [
    { "nombre": "Tomo 1", "link": "https://drive.google.com/..." }
  ]
}

Responde ÚNICAMENTE con el código JSON sin texto adicional ni explicaciones.
Aquí está la lista de archivos:
[PEGA AQUÍ TU LISTA DE LIBROS Y ENLACES]`;
                  navigator.clipboard.writeText(promptText);
                  if (onNotice) onNotice('📋 Prompt Copiado', 'Copiado al portapapeles. Pégalo en ChatGPT, Claude o Gemini adjuntando tu lista de libros.');
                }}
                style={{
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: '1px solid #A855F7',
                  background: 'rgba(168, 85, 247, 0.12)',
                  color: '#A855F7',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Copy size={12} /> Copiar Prompt para IA
              </button>
            </div>

            <textarea
              value={bulkJson}
              onChange={e => setBulkJson(e.target.value)}
              placeholder={`[\n  { "nombre": "Libro 1", "link": "https://drive.google.com/..." },\n  { "nombre": "Libro 2", "link": "https://drive.google.com/..." }\n]`}
              rows={8}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--card-border)',
                background: 'var(--card-bg)', color: 'var(--text-main)', fontSize: '0.82rem',
                fontFamily: 'monospace', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.5
              }}
            />

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => { setBulkJson(''); setBulkEditorial(''); setShowBulk(false); }}
                style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-secondary)', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleBulkImport}
                disabled={bulkImporting || !bulkJson.trim() || !bulkEditorial.trim()}
                style={{
                  padding: '8px 14px', borderRadius: '10px', border: 'none',
                  background: (!bulkEditorial.trim() || !bulkJson.trim()) ? '#888' : 'linear-gradient(135deg, #F59E0B, #EF4444)',
                  color: '#fff', fontWeight: 800,
                  fontSize: '0.82rem', cursor: bulkImporting || !bulkEditorial.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px', opacity: (!bulkEditorial.trim() || !bulkJson.trim()) ? 0.5 : 1
                }}
              >
                <BookOpen size={14} />
                {bulkImporting ? 'Importando...' : 'Importar'}
              </button>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)' }}>
          Colecciones Registradas ({libros.length})
        </h4>

        {libros.length === 0 ? (
          <div className="glass-card" style={{ padding: '30px', textAlign: 'center', borderRadius: '16px' }}>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
              Aún no has creado colecciones de libros. Crea una arriba para que aparezca en la Biblioteca.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: '14px' }}>
            {libros.map((l, idx) => (
              <div
                key={l.id}
                className="glass-card"
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  border: '1.5px solid var(--card-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '54px',
                      height: '72px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                    }}
                  >
                    {l.portadaUrl ? (
                      <img src={l.portadaUrl} alt={l.nombre} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '1.6rem' }}>📕</span>
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {l.nombre}
                    </h4>
                    <span style={{ fontSize: '0.76rem', color: '#A855F7', fontWeight: 700, display: 'block', marginTop: '2px' }}>
                      {l.editorial || 'Colección'}
                    </span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                      📚 {l.recursos?.length || 0} tomos/libros
                    </span>
                  </div>
                </div>

                {l.descripcion && (
                  <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.35, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {l.descripcion}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '6px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={async () => {
                        if (idx === 0) return;
                        const prev = libros[idx - 1];
                        const current = l;
                        await updateDoc(doc(db, 'libros', current.id), { orden: idx - 1 });
                        await updateDoc(doc(db, 'libros', prev.id), { orden: idx });
                      }}
                      style={{
                        padding: '6px 8px', borderRadius: '8px', border: 'none',
                        background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-main)',
                        opacity: idx === 0 ? 0.3 : 1, cursor: idx === 0 ? 'default' : 'pointer'
                      }}
                      title="Mover arriba"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={idx === libros.length - 1}
                      onClick={async () => {
                        if (idx === libros.length - 1) return;
                        const next = libros[idx + 1];
                        const current = l;
                        await updateDoc(doc(db, 'libros', current.id), { orden: idx + 1 });
                        await updateDoc(doc(db, 'libros', next.id), { orden: idx });
                      }}
                      style={{
                        padding: '6px 8px', borderRadius: '8px', border: 'none',
                        background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-main)',
                        opacity: idx === libros.length - 1 ? 0.3 : 1, cursor: idx === libros.length - 1 ? 'default' : 'pointer'
                      }}
                      title="Mover abajo"
                    >
                      ▼
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCollection(l)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'rgba(168, 85, 247, 0.15)',
                      color: '#A855F7',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <BookOpen size={14} />
                    <span>Ver / Agregar ({l.recursos?.length || 0})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (editingCollectionId === l.id) {
                        setEditingCollectionId(null);
                        setEditArrayJson('');
                      } else {
                        setEditingCollectionId(l.id);
                        setEditArrayJson(JSON.stringify(l.recursos || [], null, 2));
                      }
                    }}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: editingCollectionId === l.id ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.12)',
                      color: '#F59E0B',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Edit3 size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm(`¿Eliminar la colección "${l.nombre}"?`)) {
                        await deleteDoc(doc(db, 'libros', l.id));
                        if (onNotice) onNotice('Eliminado', 'La colección fue eliminada.');
                      }
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'rgba(239, 68, 68, 0.12)',
                      color: '#EF4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Eliminar Colección"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {editingCollectionId === l.id && (
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.06)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <label style={{ fontSize: '0.76rem', fontWeight: 700, color: '#F59E0B' }}>
                      Editar array de "{l.nombre}"
                    </label>
                    <textarea
                      value={editArrayJson}
                      onChange={e => setEditArrayJson(e.target.value)}
                      rows={6}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-main)', fontSize: '0.78rem', fontFamily: 'monospace', resize: 'vertical', boxSizing: 'border-box' }}
                    />
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      <button type="button" onClick={() => { setEditingCollectionId(null); setEditArrayJson(''); }} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--text-secondary)', fontSize: '0.78rem', cursor: 'pointer' }}>
                        Cancelar
                      </button>
                      <button type="button" onClick={() => handleSaveEditedArray(l.id)} disabled={savingEdit} style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', background: '#F59E0B', color: '#fff', fontWeight: 800, fontSize: '0.78rem', cursor: savingEdit ? 'wait' : 'pointer' }}>
                        {savingEdit ? 'Guardando...' : 'Guardar'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal interactivo de la colección seleccionada */}
      {selectedCollection && (
        <LibrosCollectionModal
          isOpen={!!selectedCollection}
          onClose={() => setSelectedCollection(null)}
          collectionItem={selectedCollection}
          onUpdateCollection={(updated) => {
            setSelectedCollection(updated);
            setLibros(prev => prev.map(item => item.id === updated.id ? updated : item));
          }}
          onNotice={onNotice}
        />
      )}
    </div>
  );
};

export const Admin = () => {
  const { user, isAdmin, loading: authLoading, loginWithGoogle, claimAdminRole } = useAuth();
  const [activeTab, setActiveTab] = useState('reportes'); // 'reportes' | 'pendientes' | 'reportados' | 'aprobados' | 'usuarios' | 'carrusel' | 'anuncios'
  const [reportsList, setReportsList] = useState([]);
  const [reportFilter, setReportFilter] = useState('todos'); // 'todos' | 'perfil' | 'material' | 'pendiente'
  const [warningModal, setWarningModal] = useState({
    isOpen: false,
    targetUid: '',
    targetName: '',
    targetEmail: '',
    reportId: null,
    motivoReporte: '',
    customMessage: '',
    submitting: false
  });
  const [uploads, setUploads] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [solicitudesAliados, setSolicitudesAliados] = useState([]);
  const [classComments, setClassComments] = useState([]);
  const [profileComments, setProfileComments] = useState([]);
  const [foroPosts, setForoPosts] = useState([]);
  const [sentBroadcasts, setSentBroadcasts] = useState([]);
  const [anuncioTitle, setAnuncioTitle] = useState('');
  const [anuncioMessage, setAnuncioMessage] = useState('');
  const [isSubmittingAnuncio, setIsSubmittingAnuncio] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', author: '', url: '', desc: '' });
  const [loading, setLoading] = useState(true);
  const [claimKey, setClaimKey] = useState('');
  const [claimMsg, setClaimMsg] = useState(null);

  // Modal for adding/editing Carrusel Ally Cards
  const [allyModal, setAllyModal] = useState({
    isOpen: false,
    isEdit: false,
    id: null,
    form: {
      name: '',
      role: 'Aliado Oficial RASTRO',
      badge: '⭐ Aliado Comunitario',
      specialty: '',
      desc: '',
      whatsappChannel: '',
      tiktokUrl: '',
      phone: '',
      avatar: './assets/LOGOR.png',
      uid: ''
    }
  });

  // Modal states replacing native dialogs
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null, confirmText: 'Confirmar' });
  const [noticeModal, setNoticeModal] = useState({ isOpen: false, title: '', message: '' });

  const showNotice = (title, message) => setNoticeModal({ isOpen: true, title, message });

  const [siteSettings, setSiteSettings] = useState(getCachedSiteSettings);

  useEffect(() => {
    const unsub = subscribeToSiteSettings((s) => setSiteSettings(s));
    return () => unsub();
  }, []);

  const handleToggleAutoApprove = async () => {
    const nextVal = siteSettings.autoApproveUploads === false;
    try {
      await saveSiteSettings({ autoApproveUploads: nextVal });
      showNotice(
        nextVal ? "Auto-Aprobación Activada ⚡" : "Revisión Manual Activada ⏳",
        nextVal
          ? "A partir de ahora, todo material subido por los usuarios se publicará de forma automática e inmediata sin pasar por revisión."
          : "A partir de ahora, los nuevos aportes quedarán en 'En Revisión' hasta que un administrador los apruebe manualmente."
      );
    } catch (err) {
      showNotice("Error", err.message);
    }
  };

  const handleApproveAllPending = () => {
    if (pendientesList.length === 0) return;
    setConfirmModal({
      isOpen: true,
      title: '¿Aprobar todos los aportes pendientes?',
      message: `Se marcarán como aprobados ${pendientesList.length} aportes pendientes para que sean visibles inmediatamente en la comunidad.`,
      confirmText: 'Aprobar Todos',
      onConfirm: async () => {
        try {
          for (const item of pendientesList) {
            await updateDoc(doc(db, 'uploads', item.id), {
              status: 'aprobado',
              enRevision: false
            });
          }
          showNotice("Completado", `Se aprobaron exitosamente ${pendientesList.length} aportes.`);
        } catch (err) {
          showNotice("Error", err.message);
        }
      }
    });
  };

  // Subscribe to uploads collection
  useEffect(() => {
    const q = query(collection(db, 'uploads'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setUploads(docs);
      setLoading(false);
    }, (err) => {
      console.warn("Firestore error in Admin uploads:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to usuarios collection
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'usuarios'), (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setUsersList(docs);
    }, (err) => {
      console.warn("Firestore error in Admin usuarios:", err);
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to solicitudes_aliados collection (Carrusel de Aliados)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'solicitudes_aliados'), (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setSolicitudesAliados(docs);
    }, (err) => {
      console.warn("Firestore error in Admin solicitudes_aliados:", err);
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to reportes collection (Bandeja de Reportes)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'reportes'), (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => {
        const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.timestamp || 0);
        const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.timestamp || 0);
        return tB - tA;
      });
      setReportsList(docs);
    }, (err) => {
      console.warn("Firestore error in Admin reportes:", err);
    });

    return () => unsubscribe();
  }, []);

  // Ally Modal Handlers
  const openNewAllyModal = () => {
    setAllyModal({
      isOpen: true,
      isEdit: false,
      id: null,
      form: {
        name: '',
        role: 'Aliado Oficial RASTRO',
        badge: '⭐ Aliado Comunitario',
        specialty: 'Material Preuniversitario UNSA',
        desc: '',
        whatsappChannel: '',
        tiktokUrl: '',
        phone: '',
        avatar: './assets/LOGOR.png',
        uid: ''
      }
    });
  };

  const openEditAllyModal = (ally) => {
    setAllyModal({
      isOpen: true,
      isEdit: true,
      id: ally.id,
      form: {
        name: ally.name || ally.displayName || '',
        role: ally.role || 'Aliado Oficial RASTRO',
        badge: ally.badge || '⭐ Aliado Comunitario',
        specialty: ally.specialty || ally.subject || '',
        desc: ally.desc || '',
        whatsappChannel: ally.whatsappChannel || '',
        tiktokUrl: ally.tiktokUrl || '',
        phone: ally.phone || '',
        avatar: ally.avatar || ally.photoURL || './assets/LOGOR.png',
        uid: ally.uid || ally.id || ''
      }
    });
  };

  const handleSaveAllyModal = async (e) => {
    e.preventDefault();
    if (!allyModal.form.name.trim()) {
      showNotice("Campo Requerido", "Por favor ingresa un nombre para el Aliado.");
      return;
    }

    try {
      if (allyModal.isEdit && allyModal.id) {
        await updateDoc(doc(db, 'solicitudes_aliados', allyModal.id), {
          ...allyModal.form,
          status: 'aprobado',
          updatedAt: new Date()
        });
        showNotice("Actualizado", "Tarjeta de Aliado editada con éxito.");
      } else {
        await addDoc(collection(db, 'solicitudes_aliados'), {
          ...allyModal.form,
          status: 'aprobado',
          createdAt: new Date()
        });
        showNotice("Creado", "Nueva Tarjeta de Aliado agregada al carrusel.");
      }
      setAllyModal(prev => ({ ...prev, isOpen: false }));
    } catch (err) {
      showNotice("Error", "Error al guardar la tarjeta: " + err.message);
    }
  };

  const [isUploadingAllyImage, setIsUploadingAllyImage] = useState(false);

  const handleAllyImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAllyImage(true);
    try {
      const uploadedUrl = await uploadFileReliable(file, null, 'aliados_carrusel', allyModal.form.avatar);
      if (uploadedUrl) {
        const directUrl = getDirectImageUrl(uploadedUrl);
        setAllyModal(prev => ({
          ...prev,
          form: {
            ...prev.form,
            avatar: directUrl
          }
        }));
        showNotice("Foto Subida", "Imagen de aliado cargada con éxito.");
      }
    } catch (err) {
      showNotice("Error", "Error al subir la imagen: " + err.message);
    } finally {
      setIsUploadingAllyImage(false);
    }
  };

  const handleDeleteAllyCard = (id, name) => {
    setConfirmModal({
      isOpen: true,
      title: '¿Eliminar del Carrusel?',
      message: `¿Seguro que deseas eliminar la tarjeta de "${name}" del carrusel de aliados?`,
      confirmText: 'Eliminar',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'solicitudes_aliados', id));
          showNotice("Eliminado", "Tarjeta eliminada del carrusel.");
        } catch (e) {
          showNotice("Error", "Error al eliminar: " + e.message);
        }
      }
    });
  };

  // Subscribe to other community collections for triple reports
  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, 'clase_comentarios'), (snapshot) => {
      setClassComments(snapshot.docs.map(d => ({ id: d.id, ...d.data(), _collection: 'clase_comentarios', _typeLabel: '💬 Comentario de Clase' })));
    }, err => console.warn(err));

    const unsub2 = onSnapshot(collection(db, 'perfil_comentarios'), (snapshot) => {
      setProfileComments(snapshot.docs.map(d => ({ id: d.id, ...d.data(), _collection: 'perfil_comentarios', _typeLabel: '👤 Comentario de Perfil' })));
    }, err => console.warn(err));

    const unsub3 = onSnapshot(collection(db, 'foro_preguntas'), (snapshot) => {
      setForoPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data(), _collection: 'foro_preguntas', _typeLabel: '❓ Pregunta de Foro' })));
    }, err => console.warn(err));

    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, []);

  // Subscribe to sent broadcast community announcements
  useEffect(() => {
    try {
      const q = query(
        collection(db, 'notificaciones'),
        where('recipientUid', '==', 'all')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        docs.sort((a, b) => {
          const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : (a.timestamp || 0);
          const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : (b.timestamp || 0);
          return timeB - timeA;
        });
        setSentBroadcasts(docs);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Broadcasts listener error:", e);
    }
  }, []);

  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!anuncioTitle.trim() || !anuncioMessage.trim()) {
      showNotice("Campo Requerido", "Por favor completa el título y mensaje del aviso a la comunidad.");
      return;
    }
    setIsSubmittingAnuncio(true);
    try {
      await addDoc(collection(db, 'notificaciones'), {
        recipientUid: 'all',
        type: 'admin_broadcast',
        title: anuncioTitle.trim(),
        message: anuncioMessage.trim(),
        senderUid: user?.uid || 'admin',
        senderName: 'ADMINISTRACIÓN RASTRO',
        senderPhoto: './assets/LOGOR.png',
        read: false,
        createdAt: serverTimestamp(),
        timestamp: Date.now()
      });
      setAnuncioTitle('');
      setAnuncioMessage('');
      showNotice("Aviso Publicado", "¡El aviso a la comunidad fue enviado con éxito a la campanita de todos los estudiantes!");
    } catch (err) {
      showNotice("Error", "Error al publicar aviso: " + err.message);
    } finally {
      setIsSubmittingAnuncio(false);
    }
  };

  // Actions
  const handleApprove = async (id) => {
    try {
      await updateDoc(doc(db, 'uploads', id), {
        status: 'aprobado',
        enRevision: false,
        oculto: false,
        reportsCount: 0
      });
    } catch (e) {
      showNotice("Error", "Error al aprobar: " + e.message);
    }
  };

  const handleHide = async (id) => {
    try {
      await updateDoc(doc(db, 'uploads', id), {
        oculto: true,
        enRevision: true
      });
    } catch (e) {
      showNotice("Error", "Error al ocultar: " + e.message);
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: '¿Eliminar aporte?',
      message: '¿Seguro que deseas eliminar este aporte permanentemente?',
      confirmText: 'Eliminar',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'uploads', id));
          showNotice("Aporte Eliminado", "El aporte se eliminó permanentemente.");
        } catch (e) {
          showNotice("Error", "Error al eliminar: " + e.message);
        }
      }
    });
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditForm({
      title: item.title || '',
      author: item.author || '',
      url: item.url || '',
      desc: item.desc || ''
    });
  };

  const saveEdit = async (id) => {
    try {
      await updateDoc(doc(db, 'uploads', id), {
        title: editForm.title,
        author: editForm.author,
        url: editForm.url,
        desc: editForm.desc
      });
      setEditingId(null);
    } catch (e) {
      showNotice("Error", "Error al guardar edición: " + e.message);
    }
  };

  const toggleAllyUser = async (uid, currentStatus, isPremium = false) => {
    try {
      if (currentStatus && !isPremium) {
        // Quitar aliado
        await updateDoc(doc(db, 'usuarios', uid), {
          isAlly: false,
          isPremiumAlly: false,
          badge: null
        });
        showNotice("Rango Actualizado", "Se retiró el rango de Aliado al usuario.");
      } else {
        // Asignar o elevar a Aliado / Aliado Premium
        await updateDoc(doc(db, 'usuarios', uid), {
          isAlly: true,
          isPremiumAlly: isPremium,
          badge: isPremium ? '⭐ Aliado Premium' : '🌟 Aliado Oficial'
        });
        showNotice(
          isPremium ? "⭐ Aliado Premium Nombrado" : "🌟 Aliado Oficial Nombrado",
          `El usuario ha sido nombrado ${isPremium ? 'Aliado Premium con Acceso Total' : 'Aliado Oficial de la comunidad'}.`
        );
      }
    } catch (e) {
      showNotice("Error", "Error al cambiar estado de Aliado: " + e.message);
    }
  };

  const openWarningModal = (targetUser, report = null) => {
    const uid = targetUser?.uid || targetUser?.id || report?.reportedUser?.uid || (report?.targetType === 'perfil' || report?.targetType === 'user' ? report?.targetId : null);
    const name = targetUser?.displayName || targetUser?.name || report?.reportedUser?.displayName || report?.targetTitle || 'Usuario';
    const email = targetUser?.email || report?.reportedUser?.email || '';
    const reason = report?.reasonLabel || report?.reason || 'Normas comunitarias y contenido';
    const detail = report?.details ? `Detalle: "${report.details}".` : '';

    const defaultMsg = `Hola ${name}, la administración de RASTRO te notifica que tu perfil/actividad ha recibido un reporte por el siguiente motivo: "${reason}". ${detail} Te recordamos mantener tus datos y aportes acordes a las normas comunitarias.`;

    setWarningModal({
      isOpen: true,
      targetUid: uid,
      targetName: name,
      targetEmail: email,
      reportId: report?.id || null,
      motivoReporte: reason,
      customMessage: defaultMsg,
      submitting: false
    });
  };

  const handleSendWarning = (uid, userName, optionalEmail = '') => {
    openWarningModal({ id: uid, uid, displayName: userName, email: optionalEmail });
  };

  const handleSendWarningFromModal = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!warningModal.targetUid) {
      showNotice("Error", "No se encontró el UID del usuario a notificar.");
      return;
    }
    if (!warningModal.customMessage.trim()) {
      showNotice("Campo Requerido", "Por favor ingresa el texto del aviso que se mostrará en pantalla.");
      return;
    }

    setWarningModal(prev => ({ ...prev, submitting: true }));
    try {
      // 1. Actualizar usuario para que active el WarningBanner en pantalla
      await updateDoc(doc(db, 'usuarios', warningModal.targetUid), {
        hasWarning: true,
        warningMessage: warningModal.customMessage.trim(),
        warningDismissed: false,
        warningReason: warningModal.motivoReporte,
        banned: false,
        lastWarningAt: new Date().toISOString()
      });

      // 2. Si proviene de un reporte, actualizar estado del reporte
      if (warningModal.reportId) {
        await updateDoc(doc(db, 'reportes', warningModal.reportId), {
          status: 'aviso_enviado',
          adminWarningSent: true,
          adminWarningMessage: warningModal.customMessage.trim(),
          resolvedAt: serverTimestamp(),
          resolvedBy: user?.email || 'admin'
        });
      }

      // 3. Notificación a la campanita
      try {
        await addDoc(collection(db, 'notificaciones'), {
          recipientUid: warningModal.targetUid,
          type: 'admin_warning',
          title: '⚠️ Aviso de Moderación RASTRO',
          message: warningModal.customMessage.trim(),
          senderUid: user?.uid || 'admin',
          senderName: 'ADMINISTRACIÓN RASTRO',
          senderPhoto: './assets/LOGOR.png',
          read: false,
          createdAt: serverTimestamp(),
          timestamp: Date.now()
        });
      } catch (errNotif) {
        console.warn("Could not add notification record:", errNotif);
      }

      showNotice("Aviso Enviado", `El aviso en pantalla fue enviado exitosamente a "${warningModal.targetName}".`);
      setWarningModal(prev => ({ ...prev, isOpen: false, submitting: false }));
    } catch (err) {
      showNotice("Error", "Error al enviar aviso: " + err.message);
      setWarningModal(prev => ({ ...prev, submitting: false }));
    }
  };

  const handleDismissReport = async (reportId) => {
    try {
      await updateDoc(doc(db, 'reportes', reportId), {
        status: 'desestimado',
        resolvedAt: serverTimestamp(),
        resolvedBy: user?.email || 'admin'
      });
      showNotice("Reporte Desestimado", "El reporte fue desestimado sin ninguna sanción para el usuario.");
    } catch (err) {
      showNotice("Error", "Error al desestimar reporte: " + err.message);
    }
  };

  const handleMarkReportReviewed = async (reportId) => {
    try {
      await updateDoc(doc(db, 'reportes', reportId), {
        status: 'revisado',
        resolvedAt: serverTimestamp(),
        resolvedBy: user?.email || 'admin'
      });
      showNotice("Reporte Revisado", "El reporte fue marcado como revisado.");
    } catch (err) {
      showNotice("Error", "Error al actualizar reporte: " + err.message);
    }
  };

  const handleClearWarning = (uid, userName) => {
    setConfirmModal({
      isOpen: true,
      title: '¿Retirar aviso?',
      message: `¿Deseas retirar el aviso a "${userName}"?`,
      confirmText: 'Retirar',
      onConfirm: async () => {
        try {
          await updateDoc(doc(db, 'usuarios', uid), {
            hasWarning: false,
            warningMessage: '',
            warningDismissed: true,
            banned: false
          });
          showNotice("Aviso Retirado", `Aviso retirado para "${userName}".`);
        } catch (e) {
          showNotice("Error", "Error al retirar aviso: " + e.message);
        }
      }
    });
  };

  const handleRestoreGeneric = async (item) => {
    try {
      const targetCol = item._collection || 'uploads';
      await updateDoc(doc(db, targetCol, item.id), {
        oculto: false,
        hidden: false,
        autoHidden: false,
        tripleReported: false,
        reportsCount: 0,
        enRevision: false,
        status: 'aprobado'
      });
      showNotice("Restaurado", "Elemento restaurado con éxito. Ya es visible públicamente nuevamente.");
    } catch (e) {
      showNotice("Error", "Error al restaurar: " + e.message);
    }
  };

  const handleDeleteGeneric = (item) => {
    setConfirmModal({
      isOpen: true,
      title: '¿Eliminar contenido?',
      message: '¿Seguro que deseas eliminar permanentemente este contenido?',
      confirmText: 'Eliminar',
      onConfirm: async () => {
        try {
          const targetCol = item._collection || 'uploads';
          await deleteDoc(doc(db, targetCol, item.id));
          showNotice("Eliminado", "Contenido eliminado permanentemente.");
        } catch (e) {
          showNotice("Error", "Error al eliminar: " + e.message);
        }
      }
    });
  };

  // Filtered lists
  const reportadosList = uploads.filter(u => (u.reportsCount > 0 || u.enRevision) && !u.oculto && !u.hidden && (u.reportsCount || 0) < 3);
  const pendientesList = uploads.filter(u => (u.enRevision || u.status === 'pendiente' || u.reportsCount === 1) && !u.oculto && !u.hidden && (u.reportsCount || 0) < 3);
  const aprobadosList = uploads.filter(u => !u.oculto && !u.hidden && !u.enRevision && (u.reportsCount || 0) < 3);

  // Triple reports (3+ reports or auto-hidden across community content)
  const triplesUploads = uploads.filter(u => Boolean(u.oculto || u.hidden || u.autoHidden || u.tripleReported || (u.reportsCount && u.reportsCount >= 3))).map(u => ({ ...u, _collection: 'uploads', _typeLabel: '📚 Material de Biblioteca' }));
  const triplesClassComments = classComments.filter(c => Boolean(c.oculto || c.hidden || c.autoHidden || c.tripleReported || (c.reportsCount && c.reportsCount >= 3)));
  const triplesProfileComments = profileComments.filter(c => Boolean(c.oculto || c.hidden || c.autoHidden || c.tripleReported || (c.reportsCount && c.reportsCount >= 3)));
  const triplesForo = foroPosts.filter(f => Boolean(f.oculto || f.hidden || f.autoHidden || f.tripleReported || (f.reportsCount && f.reportsCount >= 3)));
  const triplesUsers = usersList.filter(u => Boolean(u.oculto || u.hidden || u.autoHidden || u.tripleReported || (u.reportsCount && u.reportsCount >= 3))).map(u => ({ ...u, _collection: 'usuarios', _typeLabel: '👤 Perfil de Usuario' }));

  const triplesList = [...triplesUploads, ...triplesClassComments, ...triplesProfileComments, ...triplesForo, ...triplesUsers];

  const pendingReportsCount = reportsList.filter(r => r.status === 'pendiente' || !r.status).length;

  const filteredReports = reportsList.filter(rep => {
    if (reportFilter === 'perfil' && !(rep.targetType === 'perfil' || rep.targetType === 'user')) return false;
    if (reportFilter === 'material' && rep.targetType !== 'material') return false;
    if (reportFilter === 'pendiente' && (rep.status === 'revisado' || rep.status === 'desestimado' || rep.status === 'aviso_enviado')) return false;

    if (searchQuery) {
      const match = searchMatches([
        rep.targetTitle,
        rep.reportedUser?.displayName,
        rep.reportedUser?.email,
        rep.reporterEmail,
        rep.reason,
        rep.reasonLabel,
        rep.details,
        rep.targetType
      ], searchQuery);
      if (!match) return false;
    }
    return true;
  });

  const currentList = activeTab === 'pendientes' 
    ? pendientesList 
    : activeTab === 'reportados' 
    ? reportadosList 
    : activeTab === 'triples'
    ? triplesList
    : aprobadosList;

  const filteredItems = currentList.filter(item => {
    const textTarget = item.title || item.texto || item.text || item.pregunta || item.content || item.desc || item.displayName || '';
    const authorTarget = item.author || item.userName || item.userEmail || item.authorName || item.uploadedBy?.name || item.uploadedBy?.email || '';
    return searchMatches([textTarget, authorTarget, item.category, item._typeLabel], searchQuery);
  });

  const filteredUsers = usersList.filter(u => {
    return searchMatches([u.displayName, u.email, u.id], searchQuery);
  });

  // Access control guard: Autor y Administrador de Firebase
  if (!authLoading && !isAdmin) {
    const handleVerifyClaim = async (e) => {
      e.preventDefault();
      const res = await claimAdminRole(claimKey);
      setClaimMsg(res);
    };

    return (
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 120px)', padding: '24px' }}>
        <div className="glass-card" style={{ maxWidth: '520px', padding: '36px', textAlign: 'center', borderRadius: '32px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'rgba(0, 122, 255, 0.12)', color: 'var(--accent-color)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <Shield size={36} />
          </div>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, margin: '0 0 10px', color: 'var(--text-main)' }}>
            Panel de Administrador RASTRO 🔒
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5, marginBottom: '20px' }}>
            Este panel está reservado para el <strong>Autor y Creador del Proyecto Firebase</strong>.
          </p>

          {user && (
            <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(120,120,128,0.08)', borderRadius: '14px', fontSize: '0.85rem' }}>
              Sesión activa con: <br /><strong>{user.email}</strong>
            </div>
          )}

          {/* Formulario de Activación de Autor de Firebase */}
          <form onSubmit={handleVerifyClaim} style={{ marginBottom: '20px', textAlign: 'left', background: 'rgba(0,122,255,0.05)', padding: '18px', borderRadius: '20px', border: '1px solid var(--card-border)' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
              🔑 Verificar como Autor de Firebase:
            </label>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 10px 0' }}>
              Ingresa el <strong>Project ID</strong> de Firebase (<code>rumbo-jonsu</code>) o tu clave de autorización:
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Ej: rumbo-jonsu"
                value={claimKey}
                onChange={(e) => setClaimKey(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--card-border)',
                  background: 'var(--card-bg)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '10px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'var(--accent-color)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                Verificar
              </button>
            </div>
            {claimMsg && (
              <div style={{
                marginTop: '10px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: claimMsg.success ? '#34A853' : '#EF4444'
              }}>
                {claimMsg.message}
              </div>
            )}
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link
              to="/auth"
              style={{
                padding: '12px',
                borderRadius: '16px',
                background: 'rgba(120, 120, 128, 0.12)',
                color: 'var(--text-main)',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'block',
                fontSize: '0.88rem'
              }}
            >
              Cambiar de Cuenta Google
            </Link>
            <Link
              to="/"
              style={{
                padding: '10px',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                textDecoration: 'none',
                display: 'block',
                fontSize: '0.85rem'
              }}
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ padding: '16px 12px', paddingBottom: '120px', maxWidth: '1000px', margin: '0 auto', boxSizing: 'border-box', overflowX: 'hidden' }}>
      {/* Header */}
      <header style={{ marginBottom: '24px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          padding: '14px',
          borderRadius: '20px',
          background: 'rgba(168, 85, 247, 0.12)',
          color: '#A855F7',
          marginBottom: '12px'
        }}>
          <Shield size={32} />
        </div>
        <h1 style={{ fontSize: 'clamp(1.4rem, 5vw, 2.2rem)', fontWeight: 800, margin: '0 0 8px', color: 'var(--text-main)', wordBreak: 'break-word' }}>
          Panel de Administración RASTRO 🛠️
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(0.85rem, 3vw, 1.05rem)', margin: 0, lineHeight: 1.4 }}>
          Revisión total, moderación de reportes y gestión de Aliados.
        </p>
      </header>

      {/* Admin organizado: Usuarios / Contenido / Configuración — reutiliza mismos tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        {[
          { title: '👥 Usuarios', tabs: [{ id: 'usuarios', label: `👥 Usuarios (${usersList.length})` }] },
          { title: '📚 Contenido', tabs: [
            { id: 'reportes', label: `🚩 Reportes (${pendingReportsCount})` },
            { id: 'pendientes', label: `⏳ En Revisión (${pendientesList.length})` },
            { id: 'reportados', label: `🚩 Reportados (${reportadosList.length})` },
            { id: 'triples', label: `🚨 Triples 3+ (${triplesList.length})` },
            { id: 'aprobados', label: `✅ Activos (${aprobadosList.length})` },
            { id: 'carrusel', label: `🎯 Carrusel (${1 + (solicitudesAliados?.length || 0)})` },
            { id: 'briceno', label: `🎓 Briceño` },
            { id: 'academias', label: `🏛️ Academias` },
            { id: 'cursosAdmin', label: `🎓 Gestor de Cursos` },
            { id: 'librosAdmin', label: `📚 Libros` },
            { id: 'defaultContent', label: `🗂️ Contenido del Sistema` },
          ]},
          { title: '⚙️ Configuración', tabs: [
            { id: 'anuncios', label: `📢 Avisos (${sentBroadcasts.length})` },
            { id: 'accesos', label: `🔒 Control de Accesos` },
            { id: 'textos', label: `📝 Textos del Sitio` }
          ]},
        ].map(group => (
          <div key={group.title} style={{ background: 'var(--card-bg)', border: '1.5px solid var(--card-border)', borderRadius: '16px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{group.title}</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {group.tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--card-border)',
                    background: activeTab === tab.id ? 'var(--accent-color)' : 'rgba(120,120,128,0.06)',
                    color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-main)',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,122,255,0.25)' : 'none',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Universal Search Input */}
      <div style={{ maxWidth: '600px', margin: '0 auto 24px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            placeholder={activeTab === 'usuarios' ? "🔍 Buscar usuario por nombre, correo o UID..." : "🔍 Buscar aporte por título, autor o contenido..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 44px 12px 44px',
              borderRadius: '16px',
              border: '1.5px solid var(--card-border)',
              background: 'var(--card-bg)',
              color: 'var(--text-main)',
              fontSize: '0.9rem',
              outline: 'none',
              boxSizing: 'border-box',
              boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(120,120,128,0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 700
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ──────────────── TAB: BANDEJA DE REPORTES (PERFILES Y CONTENIDO) ──────────────── */}
      {activeTab === 'reportes' && (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '22px 24px', borderRadius: '24px', border: '1.5px solid rgba(239, 68, 68, 0.25)', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(245, 158, 11, 0.05))' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <ShieldAlert size={24} color="#EF4444" />
              <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Bandeja de Reportes de Moderación ({reportsList.length})
              </h3>
            </div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5 }}>
              🛡️ <strong>Regla para Perfiles de Usuario:</strong> Los perfiles de usuario <u>nunca se cierran ni se ocultan automáticamente</u>. Como Administrador, puedes revisar cada reporte recibido y, <strong>de manera opcional</strong>, enviarle un aviso en pantalla al usuario indicándole el motivo para que verifique y ajuste su cuenta.
            </p>

            {/* Sub-filtros */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
              {[
                { id: 'todos', label: `Todos (${reportsList.length})` },
                { id: 'pendiente', label: `⏳ Pendientes (${pendingReportsCount})` },
                { id: 'perfil', label: `👤 Perfiles (${reportsList.filter(r => r.targetType === 'perfil' || r.targetType === 'user').length})` },
                { id: 'material', label: `📚 Materiales (${reportsList.filter(r => r.targetType === 'material').length})` }
              ].map(flt => (
                <button
                  key={flt.id}
                  type="button"
                  onClick={() => setReportFilter(flt.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    border: reportFilter === flt.id ? '1.5px solid #EF4444' : '1px solid var(--card-border)',
                    background: reportFilter === flt.id ? 'rgba(239, 68, 68, 0.15)' : 'var(--card-bg)',
                    color: reportFilter === flt.id ? '#DC2626' : 'var(--text-main)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {flt.label}
                </button>
              ))}
            </div>
          </div>

          {filteredReports.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', borderRadius: '24px' }}>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontWeight: 600 }}>
                {searchQuery ? `No hay reportes que coincidan con "${searchQuery}".` : 'No hay reportes en esta sección.'}
              </p>
            </div>
          ) : (
            filteredReports.map((rep) => {
              const isProfileReport = rep.targetType === 'perfil' || rep.targetType === 'user';
              const targetUserUid = rep.reportedUser?.uid || (isProfileReport ? rep.targetId : null);
              const targetUserName = rep.reportedUser?.displayName || rep.targetTitle || 'Usuario';
              const targetUserEmail = rep.reportedUser?.email || '';

              return (
                <div
                  key={rep.id}
                  className="glass-card"
                  style={{
                    padding: '22px 24px',
                    borderRadius: '22px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    border: rep.status === 'aviso_enviado' 
                      ? '1.5px solid rgba(245, 158, 11, 0.4)' 
                      : rep.status === 'desestimado'
                      ? '1px solid var(--card-border)'
                      : '1.5px solid rgba(239, 68, 68, 0.35)',
                    background: 'var(--card-bg)'
                  }}
                >
                  {/* Header of Report Card */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '10px',
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        background: isProfileReport ? 'rgba(168, 85, 247, 0.15)' : 'rgba(0, 122, 255, 0.15)',
                        color: isProfileReport ? '#9333EA' : 'var(--accent-color)'
                      }}>
                        {isProfileReport ? '👤 REPORTE DE PERFIL' : `📌 REPORTE (${rep.targetType?.toUpperCase() || 'CONTENIDO'})`}
                      </span>

                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '10px',
                        fontSize: '0.74rem',
                        fontWeight: 800,
                        background: rep.status === 'aviso_enviado' 
                          ? 'rgba(245, 158, 11, 0.18)' 
                          : rep.status === 'desestimado' 
                          ? 'rgba(120, 120, 128, 0.15)' 
                          : rep.status === 'revisado' 
                          ? 'rgba(52, 168, 83, 0.18)' 
                          : 'rgba(239, 68, 68, 0.18)',
                        color: rep.status === 'aviso_enviado' 
                          ? '#D97706' 
                          : rep.status === 'desestimado' 
                          ? 'var(--text-secondary)' 
                          : rep.status === 'revisado' 
                          ? '#059669' 
                          : '#DC2626'
                      }}>
                        {rep.status === 'aviso_enviado' 
                          ? '✉️ Aviso Enviado' 
                          : rep.status === 'desestimado' 
                          ? '✓ Desestimado' 
                          : rep.status === 'revisado' 
                          ? '✓ Revisado' 
                          : '⏳ Pendiente'}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                      {rep.createdAt?.toDate ? rep.createdAt.toDate().toLocaleString('es-PE') : (rep.timestamp ? new Date(rep.timestamp).toLocaleString('es-PE') : '')}
                    </span>
                  </div>

                  {/* Target & Reason Info */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      Elemento Reportado: <span style={{ color: 'var(--accent-color)' }}>{rep.targetTitle || targetUserName}</span>
                      {targetUserUid && (
                        <Link
                          to={`/usuario/${targetUserUid}`}
                          target="_blank"
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: 'var(--accent-color)',
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 10px',
                            borderRadius: '10px',
                            background: 'rgba(0,122,255,0.1)'
                          }}
                        >
                          <ExternalLink size={13} /> Ver Perfil
                        </Link>
                      )}
                    </div>

                    {/* Reason Box */}
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#DC2626' }}>
                        Motivo del Reporte: {rep.reasonLabel || rep.reason || 'No especificado'}
                      </div>
                      {rep.details && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', fontStyle: 'italic' }}>
                          "{rep.details}"
                        </div>
                      )}
                    </div>

                    {/* Reporter Info */}
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Reportado por: <strong>{rep.reporterEmail || rep.reporterUid || 'Estudiante'}</strong>
                    </div>

                    {rep.adminWarningMessage && (
                      <div style={{
                        padding: '8px 12px',
                        borderRadius: '10px',
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.25)',
                        fontSize: '0.8rem',
                        color: '#92400E'
                      }}>
                        <strong>Aviso en pantalla enviado por Admin:</strong> "{rep.adminWarningMessage}"
                      </div>
                    )}
                  </div>

                  {/* Admin Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', paddingTop: '10px', borderTop: '1px solid var(--card-border)' }}>
                    {/* Optional Notice Button */}
                    {targetUserUid && (
                      <button
                        type="button"
                        onClick={() => openWarningModal({
                          id: targetUserUid,
                          uid: targetUserUid,
                          displayName: targetUserName,
                          email: targetUserEmail
                        }, rep)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '12px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                          color: '#fff',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)'
                        }}
                      >
                        <Send size={15} /> Enviar Aviso en Pantalla (Opcional)
                      </button>
                    )}

                    {/* Dismiss Button */}
                    <button
                      type="button"
                      onClick={() => handleDismissReport(rep.id)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '12px',
                        border: '1px solid var(--card-border)',
                        background: 'transparent',
                        color: 'var(--text-secondary)',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <CheckCircle size={15} /> Desestimar (Sin sanción)
                    </button>

                    {/* Mark Reviewed */}
                    <button
                      type="button"
                      onClick={() => handleMarkReportReviewed(rep.id)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '12px',
                        border: '1px solid rgba(52, 168, 83, 0.4)',
                        background: 'rgba(52, 168, 83, 0.08)',
                        color: '#059669',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      Marcar Atendido
                    </button>

                    {/* Delete Report Record */}
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmModal({
                          isOpen: true,
                          title: '¿Eliminar registro de reporte?',
                          message: '¿Seguro que deseas eliminar este reporte de la bandeja?',
                          confirmText: 'Eliminar',
                          onConfirm: async () => {
                            try {
                              await deleteDoc(doc(db, 'reportes', rep.id));
                              showNotice("Eliminado", "Registro de reporte eliminado.");
                            } catch (e) {
                              showNotice("Error", e.message);
                            }
                          }
                        });
                      }}
                      style={{
                        marginLeft: 'auto',
                        padding: '8px 10px',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'transparent',
                        color: '#EF4444',
                        cursor: 'pointer'
                      }}
                      title="Eliminar reporte de la lista"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ──────────────── TAB: UPLOADS LIST ──────────────── */}
      {activeTab === 'cursosAdmin' && (
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <AdminCursosManager onNotice={showNotice} />
        </div>
      )}
      {activeTab === 'librosAdmin' && (
        <div style={{ maxWidth:'900px', width:'100%', margin:'0 auto', boxSizing:'border-box', padding:'0 12px' }} className="glass-card" >
          <LibrosAdminPanel onNotice={showNotice} />
        </div>
      )}
      {['pendientes', 'reportados', 'triples', 'aprobados'].includes(activeTab) && (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Banner de Control de Auto-Aprobación Supermanejable */}
          <div
            className="glass-card"
            style={{
              padding: '16px 20px',
              borderRadius: '20px',
              border: siteSettings.autoApproveUploads !== false
                ? '1.5px solid rgba(16, 185, 129, 0.35)'
                : '1.5px solid rgba(245, 158, 11, 0.35)',
              background: siteSettings.autoApproveUploads !== false
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, var(--card-bg) 100%)'
                : 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, var(--card-bg) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '260px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '14px',
                  background: siteSettings.autoApproveUploads !== false ? 'rgba(16, 185, 129, 0.18)' : 'rgba(245, 158, 11, 0.18)',
                  color: siteSettings.autoApproveUploads !== false ? '#10B981' : '#F59E0B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <Sparkles size={20} />
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Modo de Aprobación de Aportes:
                  </span>
                  <span
                    style={{
                      padding: '3px 10px',
                      borderRadius: '8px',
                      background: siteSettings.autoApproveUploads !== false ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: siteSettings.autoApproveUploads !== false ? '#10B981' : '#F59E0B',
                      fontSize: '0.78rem',
                      fontWeight: 800
                    }}
                  >
                    {siteSettings.autoApproveUploads !== false ? '⚡ AUTO-APROBACIÓN ACTIVA (Automático)' : '⏳ MODERACIÓN PREVIA (Manual)'}
                  </span>
                </div>
                <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {siteSettings.autoApproveUploads !== false
                    ? 'Los archivos que suben los usuarios se aprueban y publican de inmediato sin esperar revisión.'
                    : 'Los nuevos aportes se guardan en "En Revisión" hasta que un administrador los apruebe.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleToggleAutoApprove}
                style={{
                  padding: '9px 16px',
                  borderRadius: '12px',
                  border: 'none',
                  background: siteSettings.autoApproveUploads !== false ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                  color: siteSettings.autoApproveUploads !== false ? '#D97706' : '#10B981',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                {siteSettings.autoApproveUploads !== false ? '🔄 Cambiar a Revisión Manual' : '⚡ Activar Auto-Aprobación'}
              </button>

              {pendientesList.length > 0 && (
                <button
                  type="button"
                  onClick={handleApproveAllPending}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <CheckCircle size={15} />
                  <span>Aprobar Todos ({pendientesList.length})</span>
                </button>
              )}
            </div>
          </div>
          {filteredItems.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', borderRadius: '24px' }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0 }}>
                No hay aportes en esta sección.
              </p>
            </div>
          ) : (
            filteredItems.map(item => {
              const isEditing = editingId === item.id;

              return (
                <motion.div
                  key={item.id}
                  layout
                  className="glass-card"
                  style={{
                    padding: '24px',
                    borderRadius: '24px',
                    border: (item.reportsCount >= 3 || item.tripleReported || activeTab === 'triples') ? '2px solid rgba(239, 68, 68, 0.6)' : item.reportsCount >= 1 ? '1.5px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--card-border)',
                    background: (item.reportsCount >= 3 || item.tripleReported || activeTab === 'triples') ? 'rgba(239, 68, 68, 0.08)' : item.reportsCount >= 1 ? 'rgba(239, 68, 68, 0.04)' : 'var(--card-bg)'
                  }}
                >
                  {activeTab === 'triples' ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            background: '#EF4444',
                            color: '#FFFFFF',
                            fontSize: '0.8rem',
                            fontWeight: 800
                          }}>
                            🚨 TRIPLE REPORTE ({item.reportsCount || 3} reportes) - AUTO-OCULTADO
                          </span>
                          <span style={{
                            padding: '4px 12px',
                            borderRadius: '12px',
                            background: 'rgba(0, 122, 255, 0.12)',
                            color: 'var(--accent-color)',
                            fontSize: '0.8rem',
                            fontWeight: 700
                          }}>
                            {item._typeLabel || 'Contenido de la Comunidad'}
                          </span>
                        </div>
                      </div>

                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 8px', color: 'var(--text-main)' }}>
                        {item.title || item.texto || item.text || item.pregunta || item.content || item.comment || item.displayName || 'Sin título'}
                      </h3>

                      {(item.desc || item.subtitulo) && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 12px', fontStyle: 'italic' }}>
                          "{item.desc || item.subtitulo}"
                        </p>
                      )}

                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        👤 Autor / Usuario: <strong>{item.userName || item.author || item.userEmail || item.uploadedBy?.name || item.uploadedBy?.email || 'Comunidad'}</strong>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '8px 14px',
                              borderRadius: '10px',
                              background: 'rgba(0, 122, 255, 0.1)',
                              color: 'var(--accent-color)',
                              textDecoration: 'none',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <ExternalLink size={15} /> Ver Enlace
                          </a>
                        )}

                        <button
                          onClick={() => handleRestoreGeneric(item)}
                          style={{
                            padding: '10px 18px',
                            borderRadius: '12px',
                            border: 'none',
                            background: '#10B981',
                            color: '#FFFFFF',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 12px rgba(16,185,129,0.25)'
                          }}
                        >
                          <CheckCircle size={16} /> ✅ Restaurar y Aprobar (Hacer Visible)
                        </button>

                        <button
                          onClick={() => handleDeleteGeneric(item)}
                          style={{
                            padding: '10px 18px',
                            borderRadius: '12px',
                            border: 'none',
                            background: '#EF4444',
                            color: '#FFFFFF',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 12px rgba(239,68,68,0.25)'
                          }}
                        >
                          <Trash2 size={16} /> 🗑️ Eliminar Definitivamente
                        </button>
                      </div>
                    </div>
                  ) : isEditing ? (
                    /* Edit Mode Form */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <h4 style={{ margin: '0 0 4px', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        ✏️ Editando Aporte
                      </h4>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Título</label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'rgba(120,120,128,0.08)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Autor / Créditos</label>
                        <input
                          type="text"
                          value={editForm.author}
                          onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'rgba(120,120,128,0.08)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Enlace / URL</label>
                        <input
                          type="url"
                          value={editForm.url}
                          onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'rgba(120,120,128,0.08)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Descripción / Relato</label>
                        <textarea
                          rows={2}
                          value={editForm.desc}
                          onChange={(e) => setEditForm({ ...editForm, desc: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'rgba(120,120,128,0.08)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                        <button
                          onClick={() => saveEdit(item.id)}
                          style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', background: '#34A853', color: '#fff', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <Save size={16} /> Guardar Cambios
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Display Mode */
                    <div>
                      {/* Top badges */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            background: 'rgba(0, 122, 255, 0.12)',
                            color: 'var(--accent-color)',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            textTransform: 'uppercase'
                          }}>
                            {item.type || 'RECURSO'}
                          </span>
                          {item.reportsCount > 0 && (
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '12px',
                              background: 'rgba(239, 68, 68, 0.15)',
                              color: '#EF4444',
                              fontSize: '0.75rem',
                              fontWeight: 800
                            }}>
                              🚩 {item.reportsCount} Reporte{item.reportsCount > 1 ? 's' : ''}
                            </span>
                          )}
                          {item.enRevision && (
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '12px',
                              background: 'rgba(245, 158, 11, 0.15)',
                              color: '#F59E0B',
                              fontSize: '0.75rem',
                              fontWeight: 800
                            }}>
                              ⏳ En Revisión
                            </span>
                          )}
                        </div>

                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Subido por: <strong>{item.uploadedBy?.name || 'Comunidad'}</strong>
                        </span>
                      </div>

                      {/* Title & Author */}
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--text-main)' }}>
                        {item.title}
                      </h3>
                      <div style={{ fontSize: '0.9rem', color: 'var(--accent-color)', fontWeight: 600, marginBottom: '10px' }}>
                        ✍️ Autor Original / Crédito: <strong>{item.author || 'Sin especificar'}</strong>
                      </div>

                      {item.desc && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 16px', lineHeight: 1.5, fontStyle: 'italic' }}>
                          "{item.desc}"
                        </p>
                      )}

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                        {item.url && (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '8px 14px',
                              borderRadius: '10px',
                              background: 'rgba(0, 122, 255, 0.1)',
                              color: 'var(--accent-color)',
                              textDecoration: 'none',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <ExternalLink size={15} /> Abrir Enlace
                          </a>
                        )}

                        <button
                          onClick={() => startEdit(item)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'rgba(245, 158, 11, 0.15)',
                            color: '#D97706',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Edit3 size={15} /> Editar
                        </button>

                        <button
                          onClick={() => handleApprove(item.id)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '10px',
                            border: 'none',
                            background: '#10B981',
                            color: '#FFFFFF',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <CheckCircle size={15} /> Aprobar / Activar
                        </button>

                        <button
                          onClick={() => handleHide(item.id)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'rgba(239, 68, 68, 0.12)',
                            color: '#EF4444',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Eye size={15} /> Ocultar
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '10px',
                            border: 'none',
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: '#EF4444',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Trash2 size={15} /> Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>
      )}

      {/* ──────────────── TAB: CARRUSEL DE ALIADOS ──────────────── */}
      {activeTab === 'carrusel' && (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ padding: '24px', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={22} color="#F59E0B" /> Gestión del Carrusel de Aliados
              </h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.4 }}>
                Edita, crea o elimina tarjetas del carrusel oficial RASTRO. La tarjeta oficial de JOSNU se mantiene fijada como #1.
              </p>
            </div>
            <button
              onClick={openNewAllyModal}
              style={{
                padding: '12px 20px',
                borderRadius: '16px',
                border: 'none',
                background: 'linear-gradient(135deg, #007AFF 0%, #00C6FF 100%)',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 6px 18px rgba(0,122,255,0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              <Plus size={18} /> Agregar Nuevo Aliado al Carrusel
            </button>
          </div>

          {/* List of Ally Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* 1. Official JOSNU Founder Card */}
            <div className="glass-card" style={{ padding: '20px 24px', borderRadius: '20px', border: '2px solid rgba(245, 158, 11, 0.5)', background: 'rgba(245, 158, 11, 0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <LiveUserAvatar
                    uid={(user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) ? user.uid : 'josnu-admin'}
                    fallbackName="JOSNU"
                    fallbackPhoto="./assets/LOGOR.png"
                    fallbackFrame="fuego_creador"
                    size={48}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        FUTURO CACHIMBO UNSA (JOSNU)
                      </h4>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.2)', color: '#D97706' }}>
                        👑 CREADOR RASTRO (#1)
                      </span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Fundador & Creador RASTRO • Dirige al perfil oficial de Jonsu
                    </p>
                  </div>
                </div>
                <Link
                  to={`/usuario/${(user?.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) ? user.uid : 'josnu-admin'}`}
                  target="_blank"
                  style={{
                    padding: '8px 14px',
                    borderRadius: '12px',
                    background: 'rgba(0,122,255,0.1)',
                    color: 'var(--accent-color)',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <ExternalLink size={15} /> Ver Perfil Jonsu
                </Link>
              </div>
            </div>

            {/* 2. Dynamic Solicitudes Aliados */}
            {solicitudesAliados.map(ally => (
              <div key={ally.id} className="glass-card" style={{ padding: '20px 24px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <LiveUserAvatar
                    uid={ally.uid}
                    fallbackName={ally.name}
                    fallbackPhoto={ally.avatar}
                    fallbackFrame={ally.avatarFrame || (ally.isCreator || ally.name?.toLowerCase().includes('jonsu') ? 'fuego_creador' : 'carmesi')}
                    size={48}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {ally.name}
                      </h4>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 10px', borderRadius: '12px', background: 'rgba(0,122,255,0.12)', color: 'var(--accent-color)' }}>
                        {ally.badge || '⭐ Aliado'}
                      </span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {ally.role || 'Aliado RASTRO'} • {ally.specialty || 'General'}
                    </p>
                    {ally.desc && (
                      <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        "{ally.desc}"
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => openEditAllyModal(ally)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#D97706',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Edit3 size={15} /> Editar
                  </button>

                  <button
                    onClick={() => handleDeleteAllyCard(ally.id, ally.name)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'rgba(239, 68, 68, 0.15)',
                      color: '#EF4444',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Trash2 size={15} /> Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ──────────────── TAB: USUARIOS & ALIADOS ──────────────── */}
      {activeTab === 'usuarios' && (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-card" style={{ padding: '24px', borderRadius: '24px', marginBottom: '12px' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Regla de Aliado Oficial:
            </h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Cualquier usuario que alcance <strong>10 aportes de material</strong> se convierte automáticamente en <strong>Aliado Oficial</strong> y su tarjeta se muestra en la plataforma. Aquí puedes activar o desactivar su insignia manualmente.
            </p>
          </div>

          {filteredUsers.length === 0 ? (
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center', borderRadius: '24px' }}>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                {searchQuery ? `No se encontraron usuarios para "${searchQuery}".` : 'No hay usuarios registrados aún.'}
              </p>
            </div>
          ) : (
            filteredUsers.map(u => (
              <div
                key={u.id}
                className="glass-card"
                style={{
                  padding: '20px 24px',
                  borderRadius: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                  border: u.banned ? '1.5px solid rgba(239, 68, 68, 0.5)' : '1px solid var(--card-border)',
                  background: u.banned ? 'rgba(239, 68, 68, 0.05)' : 'var(--card-bg)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {u.photoURL ? (
                    <img src={u.photoURL} alt="Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
                  ) : (
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'var(--accent-color)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.2rem'
                    }}>
                      {(u.displayName || u.email || 'U')[0].toUpperCase()}
                    </div>
                  )}

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {u.displayName || 'Usuario RASTRO'}
                      </h4>
                      {u.isAlly && (
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '3px 9px',
                          borderRadius: '10px',
                          background: u.isPremiumAlly ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(99, 102, 241, 0.2))' : 'rgba(52, 168, 83, 0.15)',
                          color: u.isPremiumAlly ? '#A855F7' : '#34A853',
                          border: u.isPremiumAlly ? '1px solid rgba(168, 85, 247, 0.35)' : 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {u.isPremiumAlly ? '⭐ ALIADO PREMIUM' : '🌟 ALIADO OFICIAL'}
                        </span>
                      )}
                      {(u.hasWarning || u.banned) && (
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '10px',
                          background: 'rgba(245, 158, 11, 0.2)',
                          color: '#D97706'
                        }}>
                          ⚠️ CON AVISO ACTIVO
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{u.email}</span>
                    {(u.hasWarning || u.banned) && (u.warningMessage || u.banReason) && (
                      <div style={{ fontSize: '0.8rem', color: '#D97706', marginTop: '4px', fontWeight: 600 }}>
                        Aviso: "{u.warningMessage || u.banReason}"
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'right', marginRight: '6px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--accent-color)' }}>
                      {u.uploadCount || 0}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Aportes</div>
                  </div>

                  {/* Profile Link */}
                  <Link
                    to={`/usuario/${u.id}`}
                    target="_blank"
                    style={{
                      padding: '9px 12px',
                      borderRadius: '12px',
                      background: 'rgba(0,122,255,0.1)',
                      color: 'var(--accent-color)',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <ExternalLink size={15} /> Ver Perfil
                  </Link>

                  {/* Ally Toggles: Nombrar Aliado / Nombrar Aliado Premium / Quitar */}
                  {!u.isAlly ? (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => toggleAllyUser(u.id, false, false)}
                        title="Nombrar como Aliado Oficial de la comunidad"
                        style={{
                          padding: '9px 12px',
                          borderRadius: '12px',
                          border: 'none',
                          background: 'rgba(52, 168, 83, 0.15)',
                          color: '#34A853',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <Award size={15} />
                        Aliado
                      </button>
                      <button
                        onClick={() => toggleAllyUser(u.id, false, true)}
                        title="Nombrar como Aliado Premium (Acceso Total a las secciones protegidas)"
                        style={{
                          padding: '9px 12px',
                          borderRadius: '12px',
                          border: '1px solid rgba(168, 85, 247, 0.4)',
                          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.18), rgba(99, 102, 241, 0.18))',
                          color: '#A855F7',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <Award size={15} />
                        ⭐ Aliado Premium
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {!u.isPremiumAlly && (
                        <button
                          onClick={() => toggleAllyUser(u.id, false, true)}
                          title="Elevar este Aliado a categoría Premium (Acceso Total)"
                          style={{
                            padding: '9px 12px',
                            borderRadius: '12px',
                            border: '1px solid rgba(168, 85, 247, 0.4)',
                            background: 'rgba(168, 85, 247, 0.15)',
                            color: '#A855F7',
                            fontWeight: 800,
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <Award size={15} />
                          Elevar a Premium ⭐
                        </button>
                      )}
                      <button
                        onClick={() => toggleAllyUser(u.id, true)}
                        title="Quitar rango de Aliado"
                        style={{
                          padding: '9px 12px',
                          borderRadius: '12px',
                          border: 'none',
                          background: 'rgba(239, 68, 68, 0.12)',
                          color: '#EF4444',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <Award size={15} />
                        Quitar Aliado
                      </button>
                    </div>
                  )}

                  {/* Warning / Clear Warning Button */}
                  {(u.hasWarning || u.banned) ? (
                    <button
                      onClick={() => handleClearWarning(u.id, u.displayName || u.email)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '14px',
                        border: 'none',
                        background: 'rgba(52, 168, 83, 0.15)',
                        color: '#34A853',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <CheckCircle size={16} /> Limpiar Aviso
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSendWarning(u.id, u.displayName || u.email)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '14px',
                        border: 'none',
                        background: 'rgba(245, 158, 11, 0.15)',
                        color: '#D97706',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <AlertTriangle size={16} /> Enviar Aviso en Pantalla
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Ally Add / Edit Modal */}
      {allyModal.isOpen && (
        <div 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setAllyModal(prev => ({ ...prev, isOpen: false }));
            }
          }}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div 
            className="glass-card" 
            style={{ 
              width: '100%', 
              maxWidth: '520px', 
              padding: '24px', 
              borderRadius: '28px', 
              maxHeight: '85vh', 
              display: 'flex',
              flexDirection: 'column',
              boxSizing: 'border-box',
              background: 'var(--card-bg)',
              border: '1.5px solid var(--card-border)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexShrink: 0 }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {allyModal.isEdit ? '✏️ Editar Tarjeta de Aliado' : '➕ Crear Tarjeta de Aliado'}
              </h3>
              <button
                type="button"
                onClick={() => setAllyModal(prev => ({ ...prev, isOpen: false }))}
                style={{ 
                  background: 'rgba(120,120,128,0.15)', 
                  border: 'none', 
                  borderRadius: '50%', 
                  width: '32px', 
                  height: '32px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'var(--text-main)', 
                  cursor: 'pointer' 
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveAllyModal} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto', paddingRight: '4px', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Nombre del Aliado / Canal *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Profe Pedro UNSA"
                  value={allyModal.form.name}
                  onChange={(e) => setAllyModal({ ...allyModal, form: { ...allyModal.form, name: e.target.value } })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--bg-main)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Rol / Título
                </label>
                <input
                  type="text"
                  placeholder="Ej: Docente de Matemática & Física"
                  value={allyModal.form.role}
                  onChange={(e) => setAllyModal({ ...allyModal, form: { ...allyModal.form, role: e.target.value } })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--bg-main)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Insignia / Badge
                </label>
                <input
                  type="text"
                  placeholder="Ej: ⭐ Aliado Comunitario"
                  value={allyModal.form.badge}
                  onChange={(e) => setAllyModal({ ...allyModal, form: { ...allyModal.form, badge: e.target.value } })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--bg-main)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Especialidad / Áreas
                </label>
                <input
                  type="text"
                  placeholder="Ej: Razonamiento Matemático, Física Pre"
                  value={allyModal.form.specialty}
                  onChange={(e) => setAllyModal({ ...allyModal, form: { ...allyModal.form, specialty: e.target.value } })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--bg-main)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Descripción Corta
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Brindo resúmenes y simulacros tipo UNSA..."
                  value={allyModal.form.desc}
                  onChange={(e) => setAllyModal({ ...allyModal, form: { ...allyModal.form, desc: e.target.value } })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--bg-main)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Enlace de Canal WhatsApp
                </label>
                <input
                  type="url"
                  placeholder="https://whatsapp.com/channel/..."
                  value={allyModal.form.whatsappChannel}
                  onChange={(e) => setAllyModal({ ...allyModal, form: { ...allyModal.form, whatsappChannel: e.target.value } })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--bg-main)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Enlace de TikTok / Red Social
                </label>
                <input
                  type="url"
                  placeholder="https://tiktok.com/@..."
                  value={allyModal.form.tiktokUrl}
                  onChange={(e) => setAllyModal({ ...allyModal, form: { ...allyModal.form, tiktokUrl: e.target.value } })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--bg-main)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Imagen de Perfil / Logo del Aliado
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="./assets/LOGOR.png o pega una URL https://..."
                    value={allyModal.form.avatar}
                    onChange={(e) => setAllyModal({ ...allyModal, form: { ...allyModal.form, avatar: e.target.value } })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--card-border)', background: 'var(--bg-main)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                  />

                  {/* File upload button */}
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    borderRadius: '12px',
                    background: 'rgba(0,122,255,0.12)',
                    color: 'var(--accent-color)',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    cursor: isUploadingAllyImage ? 'wait' : 'pointer',
                    border: '1.5px dashed var(--accent-color)',
                    transition: 'all 0.2s ease'
                  }}>
                    {isUploadingAllyImage ? <RefreshCw size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                    {isUploadingAllyImage ? 'Subiendo imagen a Drive...' : '📁 Subir Imagen desde Galería / Dispositivo'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAllyImageFileChange}
                      disabled={isUploadingAllyImage}
                      style={{ display: 'none' }}
                    />
                  </label>

                  {/* Live Avatar Preview */}
                  {allyModal.form.avatar && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', padding: '8px 12px', background: 'rgba(120,120,128,0.06)', borderRadius: '12px' }}>
                      <img
                        src={getDirectImageUrl(allyModal.form.avatar)}
                        alt="Vista previa"
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--accent-color)' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Vista previa de la imagen cargada</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sticky Footer Buttons inside form */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)', flexShrink: 0 }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'var(--accent-color)',
                    color: '#FFF',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0,122,255,0.3)'
                  }}
                >
                  {allyModal.isEdit ? 'Guardar Cambios' : 'Agregar al Carrusel'}
                </button>
                <button
                  type="button"
                  onClick={() => setAllyModal(prev => ({ ...prev, isOpen: false }))}
                  style={{
                    padding: '12px 18px',
                    borderRadius: '14px',
                    border: '1px solid var(--card-border)',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────────── TAB: GESTOR BRICEÑO 2027 (OFICIAL) ──────────────── */}
      {activeTab === "briceno" && (
        <AdminBricenoManager onNotice={showNotice} setConfirmModal={setConfirmModal} />
      )}

      {/* ──────────────── TAB: GESTOR DE ACADEMIAS (PLANTILLA BRICEÑO) ──────────────── */}
      {activeTab === "academias" && (
        <AdminAcademiasManager onNotice={showNotice} setConfirmModal={setConfirmModal} />
      )}

      {/* ──────────────── TAB: ANUNCIOS Y AVISOS A LA COMUNIDAD ──────────────── */}
      {activeTab === 'anuncios' && (
        <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Form Box */}
          <div className="glass-card" style={{ padding: '24px', borderRadius: '24px', border: '1.5px solid #A855F7', background: 'var(--card-bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #A855F7, #6366F1)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Megaphone size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Publicar Aviso a Toda la Comunidad
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Envía un comunicado oficial a la campanita de notificaciones de todos los estudiantes.
                </p>
              </div>
            </div>

            <form onSubmit={handleSendBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Título del Aviso *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. 📢 Novedades RASTRO 2026: Nuevos simuladores y tomos disponibles"
                  value={anuncioTitle}
                  onChange={(e) => setAnuncioTitle(e.target.value)}
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
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.82rem', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                  Mensaje Completo del Comunicado *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Escribe aquí el contenido detallado del aviso. Los estudiantes lo verán en una ventana flotante (popup) al hacer clic..."
                  value={anuncioMessage}
                  onChange={(e) => setAnuncioMessage(e.target.value)}
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
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmittingAnuncio || !anuncioTitle.trim() || !anuncioMessage.trim()}
                style={{
                  padding: '12px 20px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #A855F7, #6366F1)',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  cursor: isSubmittingAnuncio ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 18px rgba(168, 85, 247, 0.35)'
                }}
              >
                <Megaphone size={18} />
                {isSubmittingAnuncio ? 'Publicando...' : '📢 Emitir Comunicado a la Comunidad'}
              </motion.button>
            </form>
          </div>

          {/* List of Sent Broadcasts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h4 style={{ margin: '8px 0 4px', fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Avisos Emitidos ({sentBroadcasts.length})
            </h4>

            {sentBroadcasts.length === 0 ? (
              <div className="glass-card" style={{ padding: '24px', textAlign: 'center', borderRadius: '18px', color: 'var(--text-secondary)' }}>
                No has emitido avisos a la comunidad aún.
              </div>
            ) : (
              sentBroadcasts.map(b => (
                <div
                  key={b.id}
                  className="glass-card"
                  style={{
                    padding: '18px',
                    borderRadius: '20px',
                    border: '1px solid var(--card-border)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, padding: '2px 8px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.15)', color: '#A855F7' }}>
                      📢 AVISO PÚBLICO
                    </span>
                    <button
                      onClick={() => {
                        setConfirmModal({
                          isOpen: true,
                          title: "Eliminar Aviso",
                          message: "¿Deseas eliminar este aviso de las notificaciones de la comunidad?",
                          confirmText: "Eliminar",
                          onConfirm: async () => {
                            try {
                              await deleteDoc(doc(db, 'notificaciones', b.id));
                              showNotice("Eliminado", "Aviso retirado con éxito.");
                            } catch (e) {
                              showNotice("Error", e.message);
                            }
                          }
                        });
                      }}
                      style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {b.title || 'Aviso RASTRO'}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.4, whiteSpace: 'pre-wrap' }}>
                    {b.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab: Control de Accesos y Mantenimiento */}
      {activeTab === 'accesos' && (
        <AdminAccessControl usersList={usersList} />
      )}

      {/* Tab: Control Total de Textos (Editor CMS) */}
      {activeTab === 'textos' && (
        <AdminTextControl />
      )}

      {/* Tab: Gestión de Contenido Predeterminado del Sistema (Flashcards, Examen, Tomos, Prácticas) */}
      {activeTab === 'defaultContent' && (
        <AdminDefaultContentManager />
      )}

      {/* Modal: Enviar Aviso en Pantalla Personalizado al Usuario */}
      {warningModal.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px'
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '560px',
            padding: '28px',
            borderRadius: '24px',
            border: '1.5px solid rgba(245, 158, 11, 0.4)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
            background: 'var(--card-bg)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '14px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.18rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    Enviar Aviso en Pantalla
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Notificación de moderación para: <strong>{warningModal.targetName}</strong> {warningModal.targetEmail && `(${warningModal.targetEmail})`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWarningModal(prev => ({ ...prev, isOpen: false }))}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSendWarningFromModal} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Motivo o Causa del Reporte:
                </label>
                <input
                  type="text"
                  value={warningModal.motivoReporte}
                  onChange={(e) => setWarningModal(prev => ({ ...prev, motivoReporte: e.target.value }))}
                  placeholder="Ej: Foto o nombre inapropiado, spam en perfil, etc."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid var(--card-border)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  Mensaje que se mostrará en pantalla al usuario (Aviso obligatorio para él): *
                </label>
                <textarea
                  rows={4}
                  required
                  value={warningModal.customMessage}
                  onChange={(e) => setWarningModal(prev => ({ ...prev, customMessage: e.target.value }))}
                  placeholder="Escribe el aviso que se desplegará en la cabecera de la aplicación para este usuario..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: '1px solid var(--card-border)',
                    background: 'var(--bg-main)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem',
                    resize: 'vertical',
                    lineHeight: 1.4
                  }}
                />
              </div>

              <div style={{
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'rgba(0, 122, 255, 0.08)',
                border: '1px solid rgba(0, 122, 255, 0.2)',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.4
              }}>
                ℹ️ <strong>Recordatorio:</strong> Los perfiles nunca se cierran automáticamente. Este mensaje aparecerá como un banner amarillo en la parte superior de la pantalla del usuario la próxima vez que abra RASTRO para advertirle del reporte de forma opcional.
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setWarningModal(prev => ({ ...prev, isOpen: false }))}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    border: '1px solid var(--card-border)',
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={warningModal.submitting}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.86rem',
                    cursor: warningModal.submitting ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(217, 119, 6, 0.3)'
                  }}
                >
                  <Send size={16} />
                  {warningModal.submitting ? 'Enviando Aviso...' : 'Enviar Aviso en Pantalla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ConfirmModal & NoticeModal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />

      <NoticeModal
        isOpen={noticeModal.isOpen}
        title={noticeModal.title}
        message={noticeModal.message}
        onClose={() => setNoticeModal({ isOpen: false, title: '', message: '' })}
      />
    </div>
  );
};
