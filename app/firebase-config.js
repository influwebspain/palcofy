/* =========================================================
   PALCOFY · Firebase Configuration
   Detecta si Firebase está configurado.
   Si no lo está, auth.js y data.js usan localStorage.
   ========================================================= */

const firebaseConfig = {
  apiKey:            "TU_API_KEY",
  authDomain:        "TU_PROYECTO.firebaseapp.com",
  projectId:         "TU_PROYECTO",
  storageBucket:     "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId:             "TU_APP_ID"
};

/* ¿Firebase está configurado con credenciales reales? */
export const isFirebaseConfigured =
  firebaseConfig.apiKey !== 'TU_API_KEY' && firebaseConfig.apiKey !== '';

/* Firebase instances (solo si está configurado) */
export let firebaseApp  = null;
export let auth         = null;
export let db           = null;

/* Firebase module references (se cargan dinámicamente) */
export let fbAuth = null;
export let fbFirestore = null;

if (isFirebaseConfigured) {
  try {
    const appModule     = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js');
    const authModule    = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js');
    const firestoreModule = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js');

    firebaseApp  = appModule.initializeApp(firebaseConfig);
    auth         = authModule.getAuth(firebaseApp);
    db           = firestoreModule.getFirestore(firebaseApp);
    fbAuth       = authModule;
    fbFirestore  = firestoreModule;

    console.info('PALCOFY: Firebase connected.');
  } catch (e) {
    console.warn('PALCOFY: Firebase init failed, running in demo mode.', e);
  }
} else {
  console.info('PALCOFY: No Firebase config found — running in DEMO mode (localStorage).');
}
