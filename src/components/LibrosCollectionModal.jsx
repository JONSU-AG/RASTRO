import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  BookOpen,
  ExternalLink,
  Download,
  Plus,
  Trash2,
  Edit3,
  FileText,
  Share2,
  Check,
  Sparkles,
  Search,
  UploadCloud,
  Layers
} from 'lucide-react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { uploadFileReliable } from '../lib/storageHelper';

export const LibrosCollectionModal = ({
  isOpen,
  onClose,
  collectionItem,
  onUpdateCollection,
  onNotice
}) => {
  const { user, isAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Form para agregar nuevo libro/tomo a la colección ("y así mediante le agrego")
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookUrl, setNewBookUrl] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookDesc, setNewBookDesc] = useState('');
  const [newBookCover, setNewBookCover] = useState('');
  const [uploadingBookFile, setUploadingBookFile] = useState(false);
  const [submittingBook, setSubmittingBook] = useState(false);

  if (!isOpen || !collectionItem) return null;

  const recursos = collectionItem.recursos || [];
  const filteredRecursos = recursos.filter((r) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (r.nombre || '').toLowerCase().includes(q) ||
      (r.autor || '').toLowerCase().includes(q) ||
      (r.desc || '').toLowerCase().includes(q)
    );
  });

  const handleCopyLink = (url, id) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    if (onNotice) onNotice('Enlace Copiado', 'El enlace al libro fue copiado al portapapeles.');
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBookFile(true);
    try {
      const url = await uploadFileReliable(file, null, 'libros_recursos');
      if (url) {
        setNewBookUrl(url);
        if (!newBookTitle) {
          const cleanName = file.name.replace(/\.[^/.]+$/, '');
          setNewBookTitle(cleanName);
        }
        if (onNotice) onNotice('Archivo Subido', 'Archivo cargado con éxito. Ahora puedes agregarlo a la colección.');
      }
    } catch (err) {
      if (onNotice) onNotice('Error al Subir', err.message);
    } finally {
      setUploadingBookFile(false);
    }
  };

  const handleAddBookToCollection = async (e) => {
    e.preventDefault();
    if (!newBookTitle.trim() || !newBookUrl.trim()) {
      if (onNotice) onNotice('Campos requeridos', 'Por favor ingresa el título y el enlace del libro o tomo.');
      return;
    }

    setSubmittingBook(true);
    try {
      const newBookObj = {
        id: 'book_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        nombre: newBookTitle.trim(),
        url: newBookUrl.trim(),
        autor: newBookAuthor.trim() || collectionItem.editorial || 'Editorial',
        desc: newBookDesc.trim(),
        portadaUrl: newBookCover.trim() || collectionItem.portadaUrl || '',
        addedAt: new Date().toISOString()
      };

      const docRef = doc(db, 'libros', collectionItem.id);
      await updateDoc(docRef, {
        recursos: arrayUnion(newBookObj),
        updatedAt: new Date()
      });

      // Actualizar estado local si está provisto
      if (onUpdateCollection) {
        onUpdateCollection({
          ...collectionItem,
          recursos: [...recursos, newBookObj]
        });
      }

      setNewBookTitle('');
      setNewBookUrl('');
      setNewBookAuthor('');
      setNewBookDesc('');
      setNewBookCover('');
      setShowAddForm(false);
      if (onNotice) onNotice('Libro Agregado', `"${newBookObj.nombre}" fue agregado exitosamente a la colección.`);
    } catch (err) {
      if (onNotice) onNotice('Error', 'No se pudo agregar el libro: ' + err.message);
    } finally {
      setSubmittingBook(false);
    }
  };

  const handleDeleteBook = async (bookItem) => {
    if (!isAdmin) return;
    try {
      const docRef = doc(db, 'libros', collectionItem.id);
      await updateDoc(docRef, {
        recursos: arrayRemove(bookItem)
      });
      if (onUpdateCollection) {
        onUpdateCollection({
          ...collectionItem,
          recursos: recursos.filter(r => (r.id ? r.id !== bookItem.id : r.nombre !== bookItem.nombre))
        });
      }
      if (onNotice) onNotice('Eliminado', 'El tomo fue eliminado de la colección.');
    } catch (err) {
      if (onNotice) onNotice('Error', err.message);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '12px'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '24px',
          border: '1.5px solid var(--card-border)',
          background: 'var(--card-bg)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.45)',
          overflow: 'hidden'
        }}
      >
        {/* Cabecera / Banner de la Colección */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--card-border)',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px'
          }}
        >
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            {/* Portada en miniatura con relieve de libro */}
            <div
              style={{
                width: '64px',
                height: '84px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
                overflow: 'hidden',
                flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              {collectionItem.portadaUrl ? (
                <img
                  src={collectionItem.portadaUrl}
                  alt={collectionItem.nombre}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <span style={{ fontSize: '1.8rem' }}>📕</span>
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: '8px',
                    background: 'rgba(168, 85, 247, 0.15)',
                    color: '#A855F7',
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    textTransform: 'uppercase'
                  }}
                >
                  {collectionItem.editorial || 'Colección de Libros'}
                </span>
                <span
                  style={{
                    padding: '3px 10px',
                    borderRadius: '8px',
                    background: 'rgba(0, 122, 255, 0.12)',
                    color: 'var(--accent-color)',
                    fontSize: '0.74rem',
                    fontWeight: 700
                  }}
                >
                  📚 {recursos.length} {recursos.length === 1 ? 'libro / tomo' : 'libros / tomos'}
                </span>
              </div>

              <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.25 }}>
                {collectionItem.nombre}
              </h2>
              {collectionItem.descripcion && (
                <p style={{ margin: '4px 0 0', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  {collectionItem.descripcion}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(120, 120, 128, 0.12)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--text-main)',
              flexShrink: 0
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Barra de herramientas y búsqueda dentro de la colección */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--card-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="🔍 Buscar tomo o asignatura en esta colección..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: '10px',
                border: '1px solid var(--card-border)',
                background: 'rgba(120, 120, 128, 0.05)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {(isAdmin || user) && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: 'none',
                background: showAddForm ? 'rgba(239, 68, 68, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                color: showAddForm ? '#EF4444' : '#A855F7',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {showAddForm ? <X size={15} /> : <Plus size={15} />}
              <span>{showAddForm ? 'Cancelar' : '+ Agregar Tomo / Libro'}</span>
            </button>
          )}
        </div>

        {/* Formulario desplegable para agregar nuevo libro ("y así mediante le agrego") */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAddBookToCollection}
              style={{
                padding: '16px 20px',
                background: 'rgba(168, 85, 247, 0.05)',
                borderBottom: '1.5px dashed rgba(168, 85, 247, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                overflow: 'hidden'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#A855F7" />
                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Agregar Nuevo Tomo o Libro a "{collectionItem.nombre}"
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Título del Tomo / Libro *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Álgebra - Tomo I (Lumbreras)"
                    value={newBookTitle}
                    onChange={(e) => setNewBookTitle(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
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
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Enlace Google Drive o PDF *
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://drive.google.com/file/d/..."
                    value={newBookUrl}
                    onChange={(e) => setNewBookUrl(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--card-border)',
                      background: 'var(--card-bg)',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <label
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    background: 'rgba(0, 122, 255, 0.12)',
                    color: 'var(--accent-color)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: uploadingBookFile ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <UploadCloud size={14} />
                  <span>{uploadingBookFile ? 'Subiendo archivo...' : 'O subir archivo PDF'}</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.zip,.rar"
                    onChange={handleUploadFile}
                    style={{ display: 'none' }}
                    disabled={uploadingBookFile}
                  />
                </label>

                <div style={{ flex: 1 }} />

                <button
                  type="submit"
                  disabled={submittingBook || uploadingBookFile}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'var(--accent-color)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: submittingBook ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Plus size={15} />
                  <span>{submittingBook ? 'Guardando...' : 'Guardar en Colección'}</span>
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Lista de Libros / Tomos que componen esta colección ("sale los libros") */}
        <div
          style={{
            padding: '20px',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {filteredRecursos.length === 0 ? (
            <div style={{ padding: '36px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '8px' }}>📖</span>
              <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.98rem' }}>
                {searchQuery ? 'No se encontraron tomos coincidentes.' : 'Aún no hay tomos agregados a esta colección.'}
              </strong>
              <p style={{ fontSize: '0.82rem', margin: '4px 0 0' }}>
                Pulsa "+ Agregar Tomo / Libro" para incorporar el primer libro con su enlace de Drive o PDF.
              </p>
            </div>
          ) : (
            filteredRecursos.map((libro, idx) => {
              const bookId = libro.id || `book_${idx}`;
              const isCopied = copiedId === bookId;

              return (
                <motion.div
                  key={bookId}
                  layout
                  whileHover={{ y: -1 }}
                  className="glass-card"
                  style={{
                    padding: '14px 18px',
                    borderRadius: '16px',
                    border: '1.5px solid var(--card-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '14px',
                    flexWrap: 'wrap',
                    background: 'var(--card-bg)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '220px' }}>
                    {/* Mini Portada del Tomo */}
                    <div
                      style={{
                        width: '42px',
                        height: '56px',
                        borderRadius: '6px',
                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(99, 102, 241, 0.2))',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem',
                        flexShrink: 0,
                        overflow: 'hidden',
                        position: 'relative'
                      }}
                    >
                      {(() => {
                        const getThumb = (url) => {
                          if (!url) return null;
                          const m = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                          if (!m) return null;
                          const covers = JSON.parse(localStorage.getItem('bookCovers') || '{}');
                          return covers[m[1]] || `https://drive.google.com/uc?export=view&id=${m[1]}`;
                        };
                        const src = libro.portadaUrl || libro.thumbUrl || getThumb(libro.url);
                        return src ? (
                          <>
                            <span style={{ position: 'absolute', zIndex: 1, opacity: 0.4 }}>📕</span>
                            <img
                              src={src}
                              alt={libro.nombre}
                              loading="lazy"
                              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 2 }}
                              onLoad={(e) => { e.target.previousElementSibling.style.display = 'none'; }}
                            />
                          </>
                        ) : <span>📕</span>;
                      })()}
                    </div>

                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.3 }}>
                        {libro.nombre}
                      </h4>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                        {libro.autor || collectionItem.editorial || 'Colección oficial'}
                        {libro.desc ? ` • ${libro.desc}` : ''}
                      </span>
                    </div>
                  </div>

                  {/* Acciones del libro */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Abrir / Leer */}
                    <a
                      href={libro.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '7px 14px',
                        borderRadius: '10px',
                        background: 'var(--accent-color)',
                        color: '#fff',
                        fontSize: '0.82rem',
                        fontWeight: 800,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 3px 10px rgba(0, 122, 255, 0.25)'
                      }}
                    >
                      <BookOpen size={14} />
                      <span>Leer / Abrir</span>
                    </a>

                    {/* Copiar enlace */}
                    <button
                      type="button"
                      onClick={() => handleCopyLink(libro.url, bookId)}
                      title="Copiar enlace"
                      style={{
                        padding: '7px 10px',
                        borderRadius: '10px',
                        border: '1px solid var(--card-border)',
                        background: isCopied ? 'rgba(16, 185, 129, 0.12)' : 'rgba(120, 120, 128, 0.08)',
                        color: isCopied ? '#10B981' : 'var(--text-secondary)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isCopied ? <Check size={14} /> : <Share2 size={14} />}
                      <span className="hide-mobile">{isCopied ? 'Copiado' : 'Compartir'}</span>
                    </button>

                    {/* Eliminar (Solo Admin) */}
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDeleteBook(libro)}
                        title="Eliminar tomo"
                        style={{
                          padding: '7px',
                          borderRadius: '10px',
                          border: 'none',
                          background: 'rgba(239, 68, 68, 0.12)',
                          color: '#EF4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
};
