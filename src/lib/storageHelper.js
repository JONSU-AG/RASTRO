import { storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// ════════════════════════════════════════════════════════════
// RUMBO — Drive del PROPIO usuario → carpeta RUMBO única
// ════════════════════════════════════════════════════════════

const RUMBO_FOLDER_NAME = 'RUMBO';

// ── Extracción de IDs ──
export const getDriveFileId = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const m =
    rawUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
    rawUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
    rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
    rawUrl.match(/open\?id=([a-zA-Z0-9_-]+)/) ||
    rawUrl.match(/uc\?id=([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
};

export const getDriveFolderId = getDriveFileId;

// ── URLs Drive ──
export const getDriveViewUrl = (rawUrlOrId) => {
  const id = getDriveFileId(rawUrlOrId) || rawUrlOrId;
  if (!id || typeof id !== 'string' || id.length < 10) return rawUrlOrId || '';
  // Evitar ficheros locales
  if (String(rawUrlOrId).startsWith('data:') || String(rawUrlOrId).startsWith('blob:')) return rawUrlOrId;
  return `https://drive.google.com/file/d/${id}/view`;
};

export const getDrivePreviewUrl = (rawUrlOrId) => {
  const id = getDriveFileId(rawUrlOrId);
  if (!id) return null;
  return `https://drive.google.com/file/d/${id}/preview`;
};

// Para PDF/documentos: usar el visor preview de Drive (no binario roto)
export const getDocumentPreviewUrl = (rawUrlOrId) => getDrivePreviewUrl(rawUrlOrId);

export const getDriveDownloadUrl = (rawUrlOrId) => {
  const id = getDriveFileId(rawUrlOrId);
  if (!id) return rawUrlOrId || '';
  return `https://drive.google.com/uc?export=download&id=${id}`;
};

export const verifyPublicUrl = (rawUrl) => {
  const id = getDriveFileId(rawUrl);
  if (!id) return false;
  // Considera pública si es una URL de Drive view/preview/uc con ID válido
  return true;
};

// Imágenes: resolución directa vía lh3.googleusercontent (CORS friendly)
export const getDirectImageUrl = (rawUrl) => {
  if (!rawUrl) return '';
  if (typeof rawUrl !== 'string') return '';
  if (rawUrl.startsWith('data:') || rawUrl.startsWith('blob:') || rawUrl.includes('firebasestorage.googleapis.com')) {
    return rawUrl;
  }
  const id = getDriveFileId(rawUrl);
  if (id) return `https://lh3.googleusercontent.com/d/${id}`;
  return rawUrl;
};

export const getDriveThumbnailUrl = (rawUrl, size = 'w1000') => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const id = getDriveFileId(rawUrl);
  if (id) return `https://drive.google.com/thumbnail?id=${id}&sz=${size}`;
  return rawUrl;
};

export const getDriveExportUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const id = getDriveFileId(rawUrl);
  if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
  return rawUrl;
};

// ── Drive API — carpeta RUMBO única por usuario ──
const driveFetch = async (url, token, opts = {}) => {
  const res = await fetch(url, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`Drive API ${res.status}: ${txt.slice(0, 400)}`);
  }
  // 204 no content (permissions)
  if (res.status === 204) return null;
  return res.json();
};

export const findOrCreateRumboFolder = async (accessToken) => {
  if (!accessToken) throw new Error('Falta token de Google Drive del usuario');
  // 1. Buscar carpeta RUMBO existente (única por usuario, no duplicar)
  const q = encodeURIComponent(`mimeType='application/vnd.google-apps.folder' and name='${RUMBO_FOLDER_NAME}' and trashed=false`);
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)&pageSize=10&spaces=drive`;
  const data = await driveFetch(searchUrl, accessToken);
  const existing = data?.files?.[0];
  if (existing?.id) return existing.id;

  // 2. Crear carpeta RUMBO si no existe
  const createUrl = 'https://www.googleapis.com/drive/v3/files?fields=id,name';
  const created = await driveFetch(createUrl, accessToken, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: RUMBO_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });
  if (!created?.id) throw new Error('No se pudo crear la carpeta RUMBO en tu Drive');
  return created.id;
};

export const ensurePublicReader = async (fileId, accessToken) => {
  if (!fileId || !accessToken) return;
  const permUrl = `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`;
  try {
    await driveFetch(permUrl, accessToken, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'reader', type: 'anyone' }),
    });
  } catch (e) {
    // No bloqueante: archivo igual queda accesible si el dueño tiene enlace; pero logeamos
    console.warn('No se pudo setear permiso reader anyone:', e.message);
  }
};

// Crear carpeta dedicada en Google Drive para una publicación/galería específica
export const createPublicationDriveFolder = async (folderName, accessToken) => {
  if (!accessToken) throw new Error('Falta token de Google Drive');
  const parentFolderId = await findOrCreateRumboFolder(accessToken);
  const cleanTitle = folderName ? folderName.trim().replace(/[/\\?%*:|"<>]/g, '_') : '';
  const safeName = cleanTitle ? `Galería - ${cleanTitle}` : `Galería_${Date.now()}`;

  const created = await driveFetch('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink', accessToken, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: safeName,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentFolderId]
    })
  });
  if (!created?.id) throw new Error('No se pudo crear la carpeta en Google Drive');
  await ensurePublicReader(created.id, accessToken);
  const folderUrl = `https://drive.google.com/drive/folders/${created.id}`;
  return { folderId: created.id, folderUrl };
};

// ── Upload resumable/multipart a Drive del PROPIO usuario ──
export const uploadFileToUserDrive = async (file, accessToken, onProgress, targetFolderId = null) => {
  if (!file) throw new Error('Archivo vacío');
  if (!accessToken) throw new Error('Debes iniciar sesión con Google y autorizar Drive (drive.file)');

  const folderId = targetFolderId || await findOrCreateRumboFolder(accessToken);

  // Usar upload resumable con XHR para progreso real por bytes de red
  // Paso 1: metadata
  const safeName = file.name || `archivo_${Date.now()}`;
  const metadata = { name: safeName, parents: [folderId] };

  // Creamos multipart/related vía fetch con FormData? Necesitamos resumable para progreso.
  // Usamos XHR resumable approach: primero crear sesión sería ideal, pero multipart simple con XHR da progreso.

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;

  // Para progreso real sobre archivo grande, preferimos resumable upload:
  // 1) Iniciar sesión resumable
  const initRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id,name,webViewLink', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Type': file.type || 'application/octet-stream',
      'X-Upload-Content-Length': String(file.size),
    },
    body: JSON.stringify(metadata),
  });
  if (!initRes.ok) {
    const t = await initRes.text().catch(() => '');
    throw new Error(`Drive init resumable failed ${initRes.status}: ${t.slice(0, 400)}`);
  }
  const location = initRes.headers.get('Location') || initRes.headers.get('location');
  if (!location) throw new Error('Drive no retornó Location para upload resumable');

  // 2) Subir bytes con XHR para onProgress real
  const uploadResult = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', location, true);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    if (onProgress) onProgress(20);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        const pct = 20 + Math.round((e.loaded / e.total) * 75); // 20->95
        onProgress(Math.min(pct, 95));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try { resolve(JSON.parse(xhr.responseText)); } catch { resolve({}); }
      } else {
        reject(new Error(`Drive upload PUT ${xhr.status}: ${xhr.responseText?.slice(0, 400)}`));
      }
    };
    xhr.onerror = () => reject(new Error('Error de red subiendo a tu Google Drive'));
    xhr.send(file);
  });

  const fileId = uploadResult?.id;
  if (!fileId) throw new Error('Drive no retornó fileId');

  // 3. Hacer público solo lectura (reader/anyone) — NO writer
  await ensurePublicReader(fileId, accessToken);
  if (onProgress) onProgress(98);

  const driveUrl = `https://drive.google.com/file/d/${fileId}/view`;
  return { fileId, folderId, driveUrl, webViewLink: uploadResult.webViewLink || driveUrl };
};

// ── Fallback histórico: Apps Script / Firebase Storage (solo para avatar/banner) ──
export const uploadAvatarToFirebase = async (file, onProgress) => {
  if (!file) return '';
  const safeName = `avatars/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const fileRef = ref(storage, safeName);
  const task = uploadBytesResumable(fileRef, file);
  return new Promise((resolve, reject) => {
    task.on('state_changed', (snap) => {
      if (snap.totalBytes > 0 && onProgress) onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
    }, reject, async () => {
      try { resolve(await getDownloadURL(task.snapshot.ref)); } catch (e) { reject(e); }
    });
  });
};

// ── Wrapper compat: avatar/banner → Firebase Storage barato; materiales → Drive usuario ──
const AVATAR_CATEGORIES = new Set(['perfil', 'portada', 'avatar', 'banner', 'aliados_carrusel']);

export const uploadFileReliable = async (file, onProgress, category = 'variado', oldUrl = null, accessToken = null) => {
  // 1. Si es avatar/banner, usar Firebase Storage directamente (gratuito, no ocupa Drive de material)
  if (AVATAR_CATEGORIES.has(category) || category === 'perfil' || category === 'portada') {
    // Pequeños avatares/banner: Firebase Storage
    if (category === 'preguntas_examen') {
      // Imágenes de examen pequeñas también pueden ir a Firebase si no hay token
    } else {
      return uploadAvatarToFirebase(file, onProgress);
    }
  }
  if (accessToken) {
    const res = await uploadFileToUserDrive(file, accessToken, onProgress);
    if (onProgress) onProgress(100);
    return res.driveUrl;
  }
  // Intentar recuperar token de sessionStorage (capturado en login)
  try {
    const stored = sessionStorage.getItem('rumbo_drive_token');
    const exp = Number(sessionStorage.getItem('rumbo_drive_token_exp') || 0);
    const valid = stored && (!exp || Date.now() < exp);
    if (valid) {
      const res = await uploadFileToUserDrive(file, stored, onProgress);
      if (onProgress) onProgress(100);
      return res.driveUrl;
    }
  } catch (_) {}
  // Para materiales pesados: NO fallback a Apps Script ni a Storage (exige Drive del usuario)
  // Pero para compatibilidad temporal de imágenes pequeñas sin token, fallback a Firebase
  if (file && file.size < 2 * 1024 * 1024) {
    console.warn('uploadFileReliable sin token Drive — fallback Firebase para archivo pequeño');
    return uploadAvatarToFirebase(file, onProgress);
  }
  throw new Error('Tu sesión de Google Drive expiró. Por favor vuelve a iniciar sesión con Google para subir a TU carpeta RUMBO.');
};

export const uploadMultipleFilesToDrive = async (files = [], accessToken = null, publicationTitle = '', onProgress = null) => {
  if (!files || files.length === 0) return { folderId: null, folderUrl: '', images: [] };

  // Intentar recuperar token si no se suministró explícitamente
  let token = accessToken;
  if (!token) {
    try {
      const stored = sessionStorage.getItem('rumbo_drive_token');
      const exp = Number(sessionStorage.getItem('rumbo_drive_token_exp') || 0);
      if (stored && (!exp || Date.now() < exp)) token = stored;
    } catch (_) {}
  }

  // Si tenemos token de Google Drive, crear la carpeta dedicada de la publicación
  if (token) {
    let folderInfo = { folderId: null, folderUrl: '' };
    try {
      folderInfo = await createPublicationDriveFolder(publicationTitle, token);
    } catch (err) {
      console.warn('No se pudo crear carpeta dedicada, usando carpeta RUMBO principal:', err);
    }

    const uploadedImages = [];
    const totalFiles = files.length;

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      const fileProgress = (pct) => {
        if (onProgress) {
          const overall = Math.round(((i + pct / 100) / totalFiles) * 100);
          onProgress(overall);
        }
      };

      const res = await uploadFileToUserDrive(file, token, fileProgress, folderInfo.folderId);
      uploadedImages.push({
        url: getDirectImageUrl(res.driveUrl),
        driveUrl: res.driveUrl,
        driveFileId: res.fileId,
        name: file.name
      });
    }

    if (onProgress) onProgress(100);
    return {
      folderId: folderInfo.folderId,
      folderUrl: folderInfo.folderUrl || (folderInfo.folderId ? `https://drive.google.com/drive/folders/${folderInfo.folderId}` : ''),
      images: uploadedImages
    };
  }

  // Fallback: Si no hay token de Google Drive, subir archivos con uploadFileReliable
  const uploadedImages = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileProgress = (pct) => {
      if (onProgress) {
        const overall = Math.round(((i + pct / 100) / files.length) * 100);
        onProgress(overall);
      }
    };
    const url = await uploadFileReliable(file, fileProgress);
    uploadedImages.push({
      url: getDirectImageUrl(url),
      driveUrl: url,
      driveFileId: getDriveFileId(url) || null,
      name: file.name
    });
  }

  if (onProgress) onProgress(100);
  return {
    folderId: null,
    folderUrl: '',
    images: uploadedImages
  };
};

