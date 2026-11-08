export const ARTIST_CATEGORIES = [
  { value: 'dj', label: 'DJ' },
  { value: 'live-singer', label: 'Cantante en directo' },
  { value: 'mc-animation', label: 'Animación / MC' },
  { value: 'dj-singer', label: 'DJ + cantante (dos personas)' },
  { value: 'dj-live-singer-mc', label: 'DJ + cantante en directo + animación / MC' },
];

export const MEDIA_RULES = {
  image: { maxBytes: 8 * 1024 * 1024, types: ['image/jpeg', 'image/png', 'image/webp'] },
  video: { maxBytes: 50 * 1024 * 1024, types: ['video/mp4', 'video/webm', 'video/quicktime'] },
  document: { maxBytes: 10 * 1024 * 1024, types: ['application/pdf'] },
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d][\d\s().-]{7,19}$/;

export function isValidMediaFile(file, kind) {
  if (!file || !MEDIA_RULES[kind]) return false;
  const rule = MEDIA_RULES[kind];
  return rule.types.includes(file.type) && file.size > 0 && file.size <= rule.maxBytes;
}

export function isValidVideoUrl(value) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && /(^|\.)youtube\.com$|(^|\.)youtu\.be$|(^|\.)vimeo\.com$/.test(url.hostname);
  } catch {
    return false;
  }
}

export function validateArtistRegistration(input = {}) {
  const errors = {};
  const name = String(input.name || '').trim();
  const email = String(input.email || '').trim().toLowerCase();
  const phone = String(input.phone || '').trim();
  const city = String(input.city || '').trim();
  const category = String(input.category || '').trim();
  const cache = Number(input.cache);
  const radius = Number(input.radius);
  const videoUrl = String(input.videoUrl || '').trim();

  if (name.length < 2 || name.length > 120) errors.name = 'Indica un nombre artístico válido.';
  if (!EMAIL_PATTERN.test(email)) errors.email = 'Indica un email profesional válido.';
  if (!PHONE_PATTERN.test(phone)) errors.phone = 'Indica un teléfono profesional válido.';
  if (city.length < 2 || city.length > 80) errors.city = 'Indica tu ciudad.';
  if (!ARTIST_CATEGORIES.some(option => option.value === category)) errors.category = 'Selecciona una categoría.';
  if (!Number.isInteger(cache) || cache < 0 || cache > 100000) errors.cache = 'Indica un caché orientativo válido.';
  if (!Number.isInteger(radius) || radius < 5 || radius > 500) errors.radius = 'Indica un radio entre 5 y 500 km.';
  if (!videoUrl && !input.videoFile) errors.video = 'Añade un vídeo real de actuación o un enlace de YouTube/Vimeo.';
  if (videoUrl && !isValidVideoUrl(videoUrl)) errors.video = 'El enlace debe ser seguro y apuntar a YouTube o Vimeo.';
  if (input.videoFile && !isValidMediaFile(input.videoFile, 'video')) errors.video = 'El vídeo debe ser MP4, WebM o MOV y no superar 50 MB.';
  if (input.photoFile && !isValidMediaFile(input.photoFile, 'image')) errors.photo = 'La foto debe ser JPG, PNG o WEBP y no superar 8 MB.';
  if (input.materialFiles && input.materialFiles.some(file => !isValidMediaFile(file, file.type === 'application/pdf' ? 'document' : file.type.startsWith('video/') ? 'video' : 'image'))) {
    errors.materials = 'Hay un archivo adicional con formato o tamaño no válido.';
  }
  if (input.password && String(input.password).length < 6) errors.password = 'La contraseña debe tener al menos 6 caracteres.';
  if (!input.privacyAccepted) errors.privacy = 'Debes aceptar la política de privacidad para registrarte.';

  return { valid: Object.keys(errors).length === 0, errors };
}

export function normalizeArtistProfile(input = {}, media = []) {
  return {
    category: String(input.category || '').trim(),
    city: String(input.city || '').trim(),
    phone: String(input.phone || '').trim(),
    genre: String(input.genre || 'pop').trim(),
    cache: Number(input.cache) || 500,
    radius: Number(input.radius) || 50,
    photoUrl: String(input.photoUrl || '').trim(),
    videoUrl: String(input.videoUrl || '').trim(),
    availability: String(input.availability || 'available').trim(),
    available: input.availability !== 'unavailable',
    repertoire: String(input.repertoire || '').trim(),
    languages: String(input.languages || '').trim(),
    equipment: String(input.equipment || '').trim(),
    media,
    description: String(input.description || '').trim(),
  };
}
