/* =========================================================
   PALCOFY · Data Module
   Firestore o localStorage según modo de operación.
   ========================================================= */

import {
  isFirebaseConfigured,
  auth, db,
  fbFirestore
} from './firebase-config.js';

/* =========================================================
   DEMO DATA
   ========================================================= */
const DEMO_ARTISTS_KEY  = 'palcofy.demo.artists';
const DEMO_BOOKINGS_KEY = 'palcofy.demo.bookings';

function demoArtists() {
  try { return JSON.parse(localStorage.getItem(DEMO_ARTISTS_KEY)); } catch { return null; }
}
function demoSaveArtists(a) { localStorage.setItem(DEMO_ARTISTS_KEY, JSON.stringify(a)); }
function demoBookings() {
  try { return JSON.parse(localStorage.getItem(DEMO_BOOKINGS_KEY)) || []; } catch { return []; }
}
function demoSaveBookings(b) { localStorage.setItem(DEMO_BOOKINGS_KEY, JSON.stringify(b)); }

function seedArtists() {
  if (demoArtists()) return;
  demoSaveArtists([
    { id:'1', name:'Carlos Vives Trio', genre:'jazz', cache:800, available:true, pro:true, radius:30, description:'Jazz fusión y soul. Trio de cámara con 12 años de trayectoria.', rating:4.9 },
    { id:'2', name:'María García Band', genre:'pop', cache:500, available:true, pro:false, radius:50, description:'Pop indie con arreglos frescos. Perfecta para terrazas y rooftops.', rating:4.7 },
    { id:'3', name:'The Neon Collective', genre:'electronic', cache:1200, available:true, pro:true, radius:40, description:'Electrónica atmosférica. DJ set + visual mapping incluido.', rating:4.8 },
    { id:'4', name:'Quinteto Sol', genre:'jazz', cache:350, available:false, pro:false, radius:25, description:'Bossa nova y jazz brasileño. Ambiente cálido y elegante.', rating:4.6 },
    { id:'5', name:'Lucía Romero', genre:'rock', cache:600, available:true, pro:false, radius:50, description:'Rock alternativo y blues. Voz potente y repertorio versátil.', rating:4.5 },
    { id:'6', name:'Ensemble Clásica', genre:'classical', cache:1500, available:true, pro:true, radius:35, description:'Cuarteto de cuerdas. Repertorio clásico y contemporáneo.', rating:4.9 },
    { id:'7', name:'DJ Martín Vega', genre:'electronic', cache:400, available:true, pro:false, radius:20, description:'House tech y deep house. Sets de 2-4 horas.', rating:4.4 },
    { id:'8', name:'Flamenco Vivo', genre:'rock', cache:900, available:true, pro:true, radius:45, description:'Flamenco contemporáneo con toques de world music.', rating:4.8 },
  ]);
}

/* =========================================================
   PUBLIC API
   ========================================================= */

export async function getUserProfile(uid) {
  if (isFirebaseConfigured && fbFirestore) {
    const snap = await fbFirestore.getDoc(fbFirestore.doc(db, 'users', uid));
    return snap.exists() ? { id: uid, ...snap.data() } : null;
  }
  const users = JSON.parse(localStorage.getItem('palcofy.demo.users') || '{}');
  return users[uid] || null;
}

export async function updateUserProfile(uid, data) {
  if (isFirebaseConfigured && fbFirestore) {
    return fbFirestore.updateDoc(fbFirestore.doc(db, 'users', uid), data);
  }
  const users = JSON.parse(localStorage.getItem('palcofy.demo.users') || '{}');
  if (users[uid]) { Object.assign(users[uid], data); localStorage.setItem('palcofy.demo.users', JSON.stringify(users)); }
}

export async function listArtists() {
  if (isFirebaseConfigured && fbFirestore) {
    try {
      const q = fbFirestore.query(fbFirestore.collection(db, 'users'), fbFirestore.where('role', '==', 'artist'));
      const snap = await fbFirestore.getDocs(q);
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      return list;
    } catch { return []; }
  }
  seedArtists();
  return demoArtists() || [];
}

export async function createBooking({ venueId, artistId, artistName, date, time, notes, cache }) {
  if (isFirebaseConfigured && fbFirestore) {
    const id = `${venueId}_${artistId}_${date}`;
    await fbFirestore.setDoc(fbFirestore.doc(db, 'bookings', id), {
      venueId, artistId, artistName, date, time, notes, cache,
      status: 'pending', createdAt: new Date().toISOString()
    });
    return id;
  }
  const bookings = demoBookings();
  const booking = {
    id: `demo_${Date.now()}`, venueId, artistId, artistName, date, time, notes, cache,
    status: 'pending', createdAt: new Date().toISOString()
  };
  bookings.push(booking);
  demoSaveBookings(bookings);
  return booking.id;
}

export async function listBookings(venueId) {
  if (isFirebaseConfigured && fbFirestore) {
    try {
      const q = fbFirestore.query(fbFirestore.collection(db, 'bookings'), fbFirestore.where('venueId', '==', venueId));
      const snap = await fbFirestore.getDocs(q);
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      return list.sort((a, b) => a.date > b.date ? -1 : 1);
    } catch { return []; }
  }
  return demoBookings().filter(b => b.venueId === venueId).sort((a, b) => a.date > b.date ? -1 : 1);
}
