/* =========================================================
   PALCOFY · Firebase Configuration
   Si no hay credenciales reales, todo funciona en DEMO
   con localStorage — sin backend, sin npm, sin CORS.
   ========================================================= */

const firebaseConfig = {
  apiKey:            "AIzaSyA3LvaI3SUnnumEND0g3syPmlclDB1ZetQ",
  authDomain:        "palcofy.firebaseapp.com",
  projectId:         "palcofy",
  storageBucket:     "palcofy.firebasestorage.app",
  messagingSenderId: "68674800381",
  appId:             "1:68674800381:web:8c34e693d54d3aa3944c94",
  measurementId:     "G-8E0HS7XQJD"
};

/* ¿Firebase está configurado? */
const isConfigured = firebaseConfig.apiKey !== 'TU_API_KEY' && firebaseConfig.apiKey.length > 10;

export const isFirebaseConfigured = isConfigured;

/* Exports que auth.js y data.js necesitan */
export let firebaseApp = null;
export let auth        = null;
export let db          = null;
export let fbAuth      = null;
export let fbFirestore = null;

if (isConfigured) {
  try {
    const appModule       = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
    const authModule      = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
    const firestoreModule = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');

    firebaseApp  = appModule.initializeApp(firebaseConfig);
    auth         = authModule.getAuth(firebaseApp);
    db           = firestoreModule.getFirestore(firebaseApp);
    fbAuth       = authModule;
    fbFirestore  = firestoreModule;

    console.info('PALCOFY ✓ Firebase conectado.');
  } catch (e) {
    console.warn('PALCOFY: Firebase init error → modo demo.', e);
  }
} else {
  console.info('PALCOFY ✓ Modo DEMO activo (localStorage).');
}
