/* =========================================================
   PALCOFY · Auth Module
   Firebase real o DEMO (localStorage) — misma interfaz.
   ========================================================= */

import {
  isFirebaseConfigured,
  auth, db,
  fbAuth, fbFirestore
} from './firebase-config.js';

/* =========================================================
   DEMO helpers
   ========================================================= */
const DEMO_USERS_KEY    = 'palcofy.demo.users';
const DEMO_SESSION_KEY  = 'palcofy.demo.session';

function demoUsers() {
  try { return JSON.parse(localStorage.getItem(DEMO_USERS_KEY)) || {}; }
  catch { return {}; }
}
function demoSave(u) { localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(u)); }
function demoSession() {
  try { return JSON.parse(localStorage.getItem(DEMO_SESSION_KEY)); } catch { return null; }
}
function demoSetSession(uid) { localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify({ uid })); }
function demoClearSession()  { localStorage.removeItem(DEMO_SESSION_KEY); }
function demoUid() { return 'demo_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8); }

/* Observer */
let _authCb = null;
function _notify(user) { if (_authCb) _authCb(user); }

/* =========================================================
   PUBLIC API
   ========================================================= */

export async function register({ name, email, password, role }) {
  if (isFirebaseConfigured && fbAuth) {
    const cred = await fbAuth.createUserWithEmailAndPassword(auth, email, password);

    /* Fire-and-forget: perfil + Firestore en background (no bloquear UI) */
    const profileData = {
      name, email, role,
      createdAt: new Date().toISOString(),
      ...(role === 'venue'
        ? { venueName: name, plan: 'piloto', eventsUsed: 0, eventsLimit: 4 }
        : { genre: '', cache: 500, pro: false, available: true, radius: 50 })
    };
    fbAuth.updateProfile(cred.user, { displayName: name }).catch(() => {});
    fbFirestore.setDoc(fbFirestore.doc(db, 'users', cred.user.uid), profileData).catch(() => {});

    return cred.user;
  }

  /* DEMO */
  const users = demoUsers();
  if (Object.values(users).find(u => u.email === email)) throw { code: 'auth/email-already-in-use' };
  if (password.length < 6) throw { code: 'auth/weak-password' };

  const uid = demoUid();
  const profile = {
    uid, name, email, role,
    createdAt: new Date().toISOString(),
    ...(role === 'venue'
      ? { venueName: name, plan: 'piloto', eventsUsed: 0, eventsLimit: 4 }
      : { genre: '', cache: 500, pro: false, available: true, radius: 50 })
  };
  users[uid] = profile;
  demoSave(users);
  demoSetSession(uid);
  _notify({ uid, email, displayName: name });
  return { uid, email, displayName: name };
}

export async function login(email, password) {
  if (isFirebaseConfigured && fbAuth) {
    const cred = await fbAuth.signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  }

  /* DEMO */
  const users = demoUsers();
  const user = Object.values(users).find(u => u.email === email);
  if (!user) throw { code: 'auth/user-not-found' };
  if (password.length < 6) throw { code: 'auth/wrong-password' };
  demoSetSession(user.uid);
  _notify({ uid: user.uid, email: user.email, displayName: user.name });
  return { uid: user.uid, email: user.email, displayName: user.name };
}

export async function logout() {
  if (isFirebaseConfigured && fbAuth) {
    return fbAuth.signOut(auth);
  }
  demoClearSession();
  _notify(null);
}

export async function getUserProfile(uid) {
  if (isFirebaseConfigured && fbFirestore) {
    /* Cache: serve from localStorage first, fetch in background */
    const cacheKey = `palcofy.profile.${uid}`;
    const cached = (() => { try { return JSON.parse(localStorage.getItem(cacheKey)); } catch { return null; } })();

    if (cached) {
      /* Return cache immediately, refresh in background */
      fbFirestore.getDoc(fbFirestore.doc(db, 'users', uid)).then(snap => {
        if (snap.exists()) localStorage.setItem(cacheKey, JSON.stringify({ id: uid, ...snap.data() }));
      }).catch(() => {});
      return cached;
    }

    const snap = await fbFirestore.getDoc(fbFirestore.doc(db, 'users', uid));
    const profile = snap.exists() ? { id: uid, ...snap.data() } : null;
    if (profile) localStorage.setItem(cacheKey, JSON.stringify(profile));
    return profile;
  }
  const users = demoUsers();
  return users[uid] || null;
}

export function onAuthChange(callback) {
  if (isFirebaseConfigured && fbAuth) {
    return fbAuth.onAuthStateChanged(auth, callback);
  }

  /* DEMO */
  _authCb = callback;
  const session = demoSession();
  if (session) {
    const users = demoUsers();
    const u = users[session.uid];
    if (u) { callback({ uid: u.uid, email: u.email, displayName: u.name }); return () => {}; }
  }
  callback(null);
  return () => {};
}

export function redirectByRole(role) {
  window.location.href = role === 'venue' ? 'dashboard-venue.html' : 'dashboard-artist.html';
}

/* ----- Esperar perfil con reintentos (evita redirect loop) -- */
export async function waitForProfile(uid, maxRetries = 3, delayMs = 500) {
  for (let i = 0; i < maxRetries; i++) {
    const p = await getUserProfile(uid);
    if (p) return p;
    await new Promise(r => setTimeout(r, delayMs));
  }
  /* Último recurso: crear perfil por defecto */
  return null;
}
