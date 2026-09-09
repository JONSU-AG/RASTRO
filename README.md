# 🚀 RUMBO / RASTRO - Plataforma Preuniversitaria Gratuita & Colaborativa

[![Descargar Android APK](https://img.shields.io/badge/📱_Descargar_App_Android-APK_Instalable-success?style=for-the-badge&logo=android&logoColor=white)](https://github.com/JONSU-AG/RUMBO/actions/workflows/build-apk.yml)
[![PWA Web App](https://img.shields.io/badge/🌐_Web_App-Instalable_PWA-blue?style=for-the-badge&logo=googlechrome&logoColor=white)](https://rumbo.vercel.app)
[![React 18](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore_%26_Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)

![RUMBO Banner](public/assets/LOGOR.png)

> **RUMBO** (también conocida como **RASTRO**) es un ecosistema preuniversitario web y móvil moderno, interactivo y de acceso 100% libre. Ha sido diseñado especialmente para acompañar, optimizar y potenciar la preparación académica de postulantes a universidades públicas y privadas (UNSA, UNMSM, UNI, UNAC, UNHEVAL y más), centralizando bancos de materiales organizados, libros universitarios, simuladores de exámenes tipo admisión en tiempo real, salas de chat directo entre estudiantes y una vibrante red de aliados académicos.

---

## 📱 **Descargar Aplicación para Android (APK)**
- 📲 **[Haz clic aquí para descargar la última APK compilada](https://github.com/JONSU-AG/RUMBO/actions/workflows/build-apk.yml)**
- ⚡ **Compilación Continua (CI/CD):** Cada actualización en el repositorio genera automáticamente un instalador `app-debug.apk` firmado y optimizado para teléfonos inteligentes Android.
- 🌐 **Instalación como PWA:** También puedes abrir la app en cualquier navegador (Chrome, Safari, Edge) y pulsar **"Instalar aplicación"** o **"Añadir a pantalla de inicio"** para usarla en pantalla completa con soporte offline.

---

## 🌟 Módulos y Características Principales

### 📚 1. Banco de Cursos & Academias Preuniversitarias
- **Clasificación por Áreas Académicas:** Ingenierías, Biomédicas, Sociales y Humanidades.
- **Jerarquía Completa:** Organizado por academias oficiales, ciclos (intensivos, ordinarios, CEPRUNSA, CepreUNI, etc.) y semanas cronológicas de estudio.
- **Visualizador Integrado:** Apertura directa y segura de enlaces a Google Drive, carpetas compartidas, documentos PDF y clases en video.

### 📖 2. Biblioteca Digital & Apuntes Comunitarios
- **Banco de Libros y Separatas:** Colección exhaustiva de compendios, exámenes pasados, solucionarios y libros de teoría (Cuzcano, Lumbreras, Rueditas, Megaciencia, etc.).
- **Visor de PDF con Previsualización:** Lee e inspecciona documentos sin abandonar la plataforma.
- **Filtros Inteligentes:** Búsqueda rápida por materia (Álgebra, Geometría, Física, Química, Biología, Filosofía, Razonamiento Verbal y Matemático).

### 🎯 3. Simulador de Exámenes de Admisión
- **Cronómetro Tipo Admisión:** Simulación con tiempo real por pregunta y tiempo global límite.
- **Cálculo Oficial de Puntajes:** Calificación automatizada ponderada según respuestas correctas (+), respuestas incorrectas (-) y preguntas en blanco.
- **Retroalimentación Inmediata:** Desglose por áreas para que el estudiante identifique sus fortalezas y temas que requieren refuerzo.

### 💬 4. Chats Directos entre Estudiantes (1 a 1)
- **Mensajería Instantánea:** Conversaciones privadas en tiempo real respaldadas por Firebase Cloud Firestore.
- **Estados de Presencia:** Indicador visual de estado en línea / última conexión.
- **Compartir Archivos y Enlaces:** Soporte para adjuntar imágenes, apuntes y enlaces de estudio.
- **Bandeja de Mensajes No Leídos:** Contadores en tiempo real para no perderte ninguna consulta o debate académico.

### 🤝 5. Red y Carrusel de Aliados Oficiales
- **Espacio para la Comunidad:** Reconocimiento a estudiantes destacados, tutores, docentes y creadores de contenido preuniversitario.
- **Botones Directos a Redes:** Canales directos de difusión en **WhatsApp** y perfiles oficiales de **TikTok**.
- **Requisitos de Admisión:** Subir un mínimo de aportes verificados a la comunidad para postular al carrusel oficial.

### 🔔 6. Sistema Inteligente de Notificaciones y Avisos
- **Tablón de Avisos Oficiales:** Comunicados urgentes de administradores sobre fechas de admisión, subida de nuevo material y eventos.
- **Notificaciones PWA y del Dispositivo:** Alertas nativas con sonido para recordar simulacros y avisos importantes.
- **Diseño Adaptativo:** Ocultamiento automático de botones redundantes en pantallas reducidas para maximizar el área de lectura en móviles.

### 👤 7. Perfiles de Usuario y Onboarding Seguro
- **Autenticación con Google:** Inicio de sesión rápido y seguro con un solo toque.
- **Nombre de Usuario Único Obligatorio:** Todo usuario elige su `@identificador` público para interactuar sanamente en la comunidad y biblioteca.
- **Muro de Comentarios:** Mensajes de ánimo y feedback directamente en el perfil del usuario.
- **Colección de Favoritos:** Guarda tus libros y cursos favoritos para acceder a ellos rápidamente.

### 👑 8. Panel de Administración y Moderación (Admin)
- **Gestión de Aportes:** Revisión, aprobación y categorización del material subido por la comunidad.
- **Control de Accesos:** Asignación de rangos, verificación de aliados y moderación comunitaria con sistema de reportes integrado.
- **Avisos Broadcast:** Publicación instantánea de alertas para todos los usuarios de la plataforma.

### 🎨 9. Diseño iOS Liquid Glassmorphism
- **Estética Pulida:** Efectos de desenfoque dinámico (`backdrop-filter`), bordes luminosos y transiciones fluidas.
- **Barra de Navegación Líquida:** Navegación inferior ergonómica en teléfonos y barra superior centrada en tablets y monitores.
- **Soporte de Temas:** Conmutador instantáneo entre Modo Claro y Modo Oscuro.

---

## 🛠️ Stack Tecnológico

| Componente | Herramientas / Librerías |
| :--- | :--- |
| **Frontend Core** | [React 18](https://react.dev/), [Vite 6](https://vitejs.dev/), JavaScript moderno (ESM) |
| **Estilos & UI** | [Tailwind CSS](https://tailwindcss.com/), CSS Glassmorphism personalizado (`src/styles/ios-glass.css`) |
| **Animaciones** | [Framer Motion](https://www.framer.com/motion/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Iconos** | [Lucide React](https://lucide.dev/) |
| **Backend & Cloud** | [Google Firebase](https://firebase.google.com/) (Auth con Google, Cloud Firestore) |
| **PWA & Offline** | [Vite PWA Plugin](https://vite-pwa-org.netlify.app/), Service Workers, Workbox |
| **Enrutamiento** | [React Router DOM v6](https://reactrouter.com/) |

---

## 📁 Estructura del Proyecto

```text
RUMBO/
├── public/
│   ├── assets/              # Banners, logotipos e insignias gráficas
│   ├── applogo.png          # Icono oficial de la aplicación
│   └── manifest.json        # Manifiesto de la aplicación PWA
├── src/
│   ├── components/          # Componentes reutilizables e interactivos
│   │   ├── AliadosCarousel.jsx       # Carrusel móvil de creadores y aliados
│   │   ├── ChooseUsernameModal.jsx   # Modal obligatorio para fijar nombre de usuario
│   │   ├── FloatingWhatsApp.jsx      # Botón flotante para el canal de WhatsApp
│   │   ├── LiquidNavbar.jsx          # Barra flotante responsiva (Desktop / Mobile)
│   │   ├── NotificationsModal.jsx    # Centro de notificaciones y avisos
│   │   ├── UserDirectChat.jsx        # Sistema de mensajería directa 1 a 1
│   │   └── ...
│   ├── context/             # Contextos globales de React
│   │   ├── AuthContext.jsx           # Sesión, usuario y roles con Firebase
│   │   └── ThemeContext.jsx          # Estado del tema (Claro / Oscuro)
│   ├── data/                # Estructuras base, academias y temas
│   ├── lib/                 # Configuración de Firebase y utilitarios
│   ├── pages/               # Vistas principales de la aplicación
│   │   ├── Home.jsx                  # Página de inicio con buscador y accesos
│   │   ├── Cursos.jsx                # Explorador de academias y ciclos
│   │   ├── Biblioteca.jsx            # Catálogo de libros y apuntes
│   │   ├── Simulador.jsx             # Simulador de exámenes de admisión
│   │   ├── Chats.jsx                 # Sala principal de mensajes directos
│   │   ├── UserProfile.jsx           # Perfil público y privado del estudiante
│   │   └── Admin.jsx                 # Panel de moderación y administración
│   ├── styles/              # Hojas de estilo y reglas de diseño iOS Glass
│   ├── App.jsx              # Enrutador principal y configuración global
│   └── main.jsx             # Punto de arranque de React
├── .env.example             # Plantilla de variables de entorno requeridas
├── package.json             # Manifiesto de paquetes y dependencias
└── vite.config.js           # Configuración del empaquetador Vite y plugin PWA
```

---

## ⚙️ Instalación y Puesta en Marcha

### 1. Requisitos Previos
- **Node.js** 18.x o superior instalado.
- **npm** o **yarn**.

### 2. Clonar el repositorio
```bash
git clone https://github.com/JONSU-AG/RUMBO.git
cd RUMBO
```

### 3. Instalar dependencias
```bash
npm install
```

### 4. Configurar variables de entorno
Copia la plantilla de variables de entorno y completa tus credenciales de Firebase:

```bash
cp .env.example .env
```

Edita `.env` con los datos de tu consola de Firebase:
```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

### 5. Iniciar en modo desarrollo
```bash
npm run dev
```
Abre tu navegador en `http://localhost:3000` (o el puerto indicado por Vite).

### 6. Compilar para producción
```bash
npm run build
```
Los archivos optimizados y listos para despliegue se generarán en la carpeta `dist/`.

---

## 🔒 Políticas de Moderación y Filosofía Libre

1. **Acceso 100% Gratuito:** Todo el material reunido o compartido por la comunidad es para fines estrictamente educativos y sin fines de lucro.
2. **Prohibición de Comercialización:** Queda terminantemente prohibido vender, cobrar membresías o lucrar con el contenido publicado en la plataforma.
3. **Respeto a la Propiedad Intelectual:** Los créditos y derechos morales de los materiales corresponden a sus autores, docentes e instituciones educativas originales.
4. **Comunidad Segura:** Se aplican filtros automáticos y moderación constante para garantizar un espacio de estudio respetuoso, constructivo y libre de spam.

---

## 👨‍💻 Creador & Comunidad

- **Fundador & Desarrollador:** *Tu Buen Amigo Jonsu (Futuro Cachimbo)* 👑
- **Proyecto:** RUMBO / RASTRO - Educación Preuniversitaria Libre y Compartida
- **Canal Oficial de WhatsApp:** [Únete a la Comunidad en WhatsApp](https://www.whatsapp.com/channel/0029VbDFAEu7YScyVZBNul0X)
- **TikTok Oficial:** [@futurocachimbounsa](https://www.tiktok.com/@futurocachimbounsa)
#   a s t r o v 2  
 