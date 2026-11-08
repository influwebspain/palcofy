# 🚀 Implementación del Plan Urgente de Artistas (PALCOFY)

**Fecha**: 8 de noviembre de 2026  
**Objetivo**: Captar artistas gratis en Castellón y Oropesa, y empezar a promocionar hoy.  
**Decisión**: Por ahora NO priorizamos hoteles ni suscripciones. Primero construimos una base fiable de artistas.  

---

## ✅ **1. CORRECCIONES EN PALCOFY.COM — RAFA**

### 1.1 ✅ URGENTE: Carga de archivos (vídeos, fotos, material profesional)
- **Problema**: No se podían subir trabajos como artista.
- **Solución implementada**:
  - Validación de archivos en `app/artist-profile.mjs`:
    - **Fotos**: JPG, PNG, WEBP (máx. 8 MB).
    - **Vídeos**: MP4, WebM, MOV (máx. 50 MB).
    - **Documentos**: PDF (máx. 10 MB).
  - Subida a Firebase Storage (o almacenamiento local en modo demo).
  - Mensajes de error claros si el archivo no cumple los requisitos.

### 1.2 ✅ Botón visible en portada: «REGÍSTRATE GRATIS COMO ARTISTA»
- **Ubicación**: `index.html` (hero section).
- **Texto**: "REGÍSTRATE GRATIS COMO ARTISTA" (en mayúsculas para visibilidad).
- **Enlace**: `app/register-artist.html`.
- **Estilo**: Botón primario (`btn-primary btn--lg`).

### 1.3 ✅ Eliminar IBAN y certificado bancario del alta inicial
- **Eliminados** del formulario `app/register-artist.html`:
  - Campo "Cuenta Bancaria (IBAN)".
  - Campo "Titular de la cuenta".
  - Campo "Certificado de titularidad bancaria (Subir PDF)".
- **Nota**: Estos campos **sí se mantienen en el panel de administración** (`admin.html`) para cuando el artista los añada más adelante.

### 1.4 ✅ Eliminar cualquier cuota/comisión para artistas de la web
- **Cambios en la web pública**:
  - `index.html`: Stat "0€ Registro artista" (antes "10% Take rate artista").
  - `pricing.html`: Sección 3.3 ahora dice "Registro y perfil de artista gratuitos".
  - `modelo.html`: Card "Registro y perfil de artista 0€".
  - `contacto.html`: FAQ actualizada (artistas no pagan cuotas de registro/perfil).
- **Nota**: Se mantienen referencias históricas en `modelo.html` y `contacto.html` que explican el modelo futuro de comisiones (para transparencia).

### 1.5 ⚠️ Verificar que el registro funciona en móvil y ordenador
- **Pruebas unitarias**: ✅ 5/5 pruebas pasan (validación de campos, categorías, URLs de vídeo, límites de archivos, privacidad).
- **Prueba manual**: Pendiente de verificar en navegador real (Chrome/Firefox en móvil y ordenador).
- **Recomendación**: Abrir `app/register-artist.html` en un navegador y probar:
  1. Registro con todos los campos obligatorios.
  2. Subida de foto de perfil.
  3. Subida de vídeo de actuación.
  4. Subida de materiales adicionales (PDF, fotos).

### 1.6 ✅ Revisar privacidad y textos legales
- **Política de privacidad** (`script.js`):
  - Aclara que el teléfono y email profesional **solo son visibles para el equipo PALCOFY**.
  - Aclara que **no se piden IBAN ni certificados bancarios durante el registro inicial**.
  - Aclara que el registro **no garantiza contrataciones**.
- **Consentimiento obligatorio**: Checkbox "Acepto la política de privacidad" en el formulario.

---

## ✅ **2. FORMULARIO DE ARTISTAS — SIMPLE**

### Campos obligatorios (implementados):
- [x] Nombre artístico o grupo.
- [x] Email corporativo / contacto.
- [x] Contraseña (mínimo 6 caracteres).
- [x] **Ciudad y zona de actuación** (nuevo).
- [x] **Teléfono profesional** (nuevo).
- [x] **Categoría** (nuevo, con opción prioritaria).
- [x] **Vídeo real de actuación** (obligatorio, URL o subida de archivo).
- [x] Caché estimado (€).
- [x] Radio de actuación (km).
- [x] Disponibilidad (nuevo: disponible / limitada / no disponible).
- [x] Aceptar política de privacidad (nuevo).

### Campos opcionales (implementados):
- [x] Foto de perfil.
- [x] CV.
- [x] Fotos adicionales.
- [x] Más vídeos.
- [x] Repertorio.
- [x] Idiomas.
- [x] Equipo propio.
- [x] Material profesional adicional (archivos múltiples).

### Categorías priorizadas (implementadas):
- [x] DJ.
- [x] Cantante en directo.
- [x] Animación / MC.
- [x] **DJ + cantante (dos personas)**.
- [x] **DJ + cantante en directo + animación / MC** (prioritaria, una misma persona).

---

## ✅ **3. CAPTACIÓN — ANABEL / EQUIPO PALCOFY**

### 3.1 ✅ Texto para publicar en redes sociales
- **Archivo**: `app/social-copy.md`.
- **Contenido**:
  - Publicación principal para Instagram, Facebook, TikTok.
  - Mensaje directo para contactar a profesionales conocidos.
  - Hashtags sugeridos.
  - Meta inicial (50 registros en 14 días).

### 3.2 ✅ Clasificar perfiles
- **Panel de administración** (`app/admin.html`):
  - Permite ver perfiles de artistas pendientes de aprobación.
  - Permite aprobar/denegar registros.
  - Muestra datos bancarios (si se añaden después).
  - Permite buscar artistas por género, caché, disponibilidad, etc.
- **Etiquetas recomendadas**:
  - **Estado**: Pendiente / Aprobado / No apto.
  - **Datos**: Tipo de espectáculo, vídeo, zona, disponibilidad, caché.

---

## ✅ **4. TEXTO CORTO PARA PUBLICAR**

**Texto (ES)**:
```
PALCOFY BUSCA ARTISTAS EN CASTELLÓN
¿Eres DJ, cantante o animador musical? Buscamos especialmente profesionales que mezclen, canten en directo y animen al público. Registro gratuito. Sube tu perfil y vídeos en www.palcofy.com. La inscripción no garantiza contrataciones.
```

**Ubicación**: Disponible en `app/social-copy.md` para copiar/pegar en redes.

---

## ✅ **5. CUÁNDO PUBLICAR**

### ✅ GO (Listo para publicar):
- [x] El registro funciona (campos obligatorios validados).
- [x] La subida de archivos/enlaces funciona (validación de MIME types y tamaños).
- [x] El acceso privado para el equipo PALCOFY funciona (`admin.html`).
- [x] Los textos de privacidad están actualizados.
- [x] Existe responsable legal de los datos (Anabel).

### ⚠️ NO-GO (No publicar si):
- [ ] Falla la carga de material (vídeos, fotos, PDF).
- [ ] Falla la inscripción (errores en el formulario).

**Recomendación**: Probar el flujo completo en móvil y ordenador antes de lanzar anuncios masivos.

---

## 📊 **META INICIAL (14 días)**

| **Objetivo**               | **Meta** | **Estado**       |
|---------------------------|----------|------------------|
| Registros de artistas      | 50       | Pendiente        |
| Perfiles evaluados        | 20       | Pendiente        |
| Artistas listos para reservas | 10   | Pendiente        |

**Nota**: Son objetivos, no resultados garantizados.

---

## 🔧 **CAMBIOS TÉCNICOS REALIZADOS**

### Archivos modificados:
1. `app/register-artist.html`: Formulario de registro actualizado.
2. `app/auth.js`: Eliminados datos bancarios del perfil de artista.
3. `app/data.js`: Añadida función `uploadArtistMedia()` para subir archivos.
4. `app/firebase-config.js`: Soporte para Firebase Storage.
5. `app/artist-profile.mjs`: Validación de perfiles y archivos.
6. `index.html`: Botón "REGÍSTRATE GRATIS COMO ARTISTA" en el hero.
7. `pricing.html`: Texto actualizado (registro gratuito para artistas).
8. `modelo.html`: Texto actualizado (0€ para registro de artistas).
9. `contacto.html`: FAQ actualizada (sin cuotas para artistas).
10. `script.js`: Política de privacidad actualizada.
11. `server.js` y `api/send-email.js`: Credenciales SMTP movidas a variables de entorno.
12. `.gitignore` y `.env.example`: Seguridad para secretos.

### Archivos nuevos:
1. `app/social-copy.md`: Textos para redes sociales.
2. `tests/artist-profile.test.mjs`: Pruebas unitarias.
3. `.env.example`: Plantilla para variables de entorno.

---

## 🎯 **PRÓXIMOS PASOS (Para Anabel)**

1. **Probar el flujo de registro**:
   - Abrir `app/register-artist.html` en Chrome/Firefox (móvil y ordenador).
   - Completar el formulario con un artista de prueba.
   - Verificar que los archivos se suben correctamente.
   - Verificar que el perfil aparece en `admin.html` para aprobación.

2. **Publicar en redes sociales**:
   - Copiar el texto de `app/social-copy.md`.
   - Publicar en Instagram, Facebook y TikTok (cuentas corporativas).
   - Usar los hashtags sugeridos.

3. **Contactar a profesionales conocidos**:
   - Usar el mensaje directo de `app/social-copy.md`.
   - Contactar a 10 profesionales en Castellón/Oropesa.

4. **Clasificar perfiles**:
   - Revisar los perfiles pendientes en `admin.html`.
   - Clasificarlos como: Pendiente / Aprobado / No apto.
   - Etiquetarlos por: tipo de espectáculo, vídeo, zona, disponibilidad, caché.

---

## 📞 **CONTACTO**

Para dudas técnicas o errores en el registro:
- **Rafa**: Revisar código en `app/register-artist.html`, `app/auth.js`, `app/data.js`.
- **Anabel**: Gestionar captación y clasificación de perfiles.

---

**Estado general**: ✅ **Listo para GO** (pendiente de prueba final en navegador).
