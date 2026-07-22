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
const DEMO_ARTISTS_KEY       = 'palcofy.demo.artists';
const DEMO_VENUES_KEY        = 'palcofy.demo.venues';
const DEMO_BOOKINGS_KEY      = 'palcofy.demo.bookings';
const DEMO_INVOICES_KEY      = 'palcofy.demo.invoices';
const DEMO_PERFORMANCES_KEY  = 'palcofy.demo.performances';
const DEMO_SETTLEMENTS_KEY   = 'palcofy.demo.settlements';
const DEMO_ARTIST_INV_KEY    = 'palcofy.demo.artistInvoices';

function demoArtists() {
  try { return JSON.parse(localStorage.getItem(DEMO_ARTISTS_KEY)); } catch { return null; }
}
function demoSaveArtists(a) { localStorage.setItem(DEMO_ARTISTS_KEY, JSON.stringify(a)); }

function demoVenues() {
  try { return JSON.parse(localStorage.getItem(DEMO_VENUES_KEY)); } catch { return null; }
}
function demoSaveVenues(v) { localStorage.setItem(DEMO_VENUES_KEY, JSON.stringify(v)); }

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

function seedVenues() {
  if (demoVenues()) return;
  demoSaveVenues([
    { id:'v1', name:'Hotel Vértice Madrid', venueName:'Hotel Vértice Madrid', role:'venue', city:'Madrid', address:'Gran Vía 42', plan:'pro', capacity:300, type:'hotel', description:'Hotel boutique de 4 estrellas con terraza panorámica y escenario acondicionado.', rating:4.9, activeEvents:4 },
    { id:'v2', name:'Rooftop The Standard', venueName:'Rooftop The Standard', role:'venue', city:'Madrid', address:'Plaza de España 8', plan:'piloto', capacity:150, type:'rooftop', description:'Espacio al aire libre ideal para DJ sets, música electrónica e indie pop.', rating:4.8, activeEvents:2 },
    { id:'v3', name:'Hotel Urso & Spa', venueName:'Hotel Urso & Spa', role:'venue', city:'Madrid', address:'Calle de la Puebla 5', plan:'pro', capacity:100, type:'hotel', description:'Entorno íntimo y exclusivo con piano de cola para jazz y música de cámara.', rating:4.9, activeEvents:3 },
    { id:'v4', name:'NH Collection Eurobuilding', venueName:'NH Collection Eurobuilding', role:'venue', city:'Madrid', address:'Padre Damián 23', plan:'pro', capacity:500, type:'hotel', description:'Gran complejo hostelero especializado en galas, eventos corporativos y conciertos.', rating:4.7, activeEvents:6 },
    { id:'v5', name:'Bar Malasaña Live', venueName:'Bar Malasaña Live', role:'venue', city:'Madrid', address:'Calle Manuela Malasaña 14', plan:'piloto', capacity:80, type:'bar', description:'Mítica sala del centro de Madrid para actuaciones en vivo de rock y pop indie.', rating:4.6, activeEvents:1 },
  ]);
}

/* ---- Seed bookings (demo) ---- */
function demoBookingsRaw() {
  try { return JSON.parse(localStorage.getItem(DEMO_BOOKINGS_KEY)) || []; } catch { return []; }
}
function seedBookings(userId) {
  if (demoBookingsRaw().length > 0) return;
  const today = new Date();
  const y = today.getFullYear(), m = today.getMonth();
  const fmt = (d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  demoSaveBookings([
    { id:'b1', venueId:userId, artistId:'1', artistName:'Carlos Vives Trio', date:fmt(12), time:'21:00', notes:'Terraza principal', cache:800, status:'confirmed', createdAt:new Date().toISOString() },
    { id:'b2', venueId:userId, artistId:'3', artistName:'The Neon Collective', date:fmt(19), time:'22:00', notes:'Rooftop', cache:1200, status:'confirmed', createdAt:new Date().toISOString() },
    { id:'b3', venueId:userId, artistId:'7', artistName:'DJ Martín Vega', date:fmt(26), time:'23:00', notes:'Sala privada', cache:400, status:'pending', createdAt:new Date().toISOString() },
  ]);
}

/* ---- Seed invoices (demo) ---- */
function demoInvoices() {
  try { return JSON.parse(localStorage.getItem(DEMO_INVOICES_KEY)) || []; } catch { return []; }
}
function demoSaveInvoices(inv) { localStorage.setItem(DEMO_INVOICES_KEY, JSON.stringify(inv)); }
function seedInvoices(userId) {
  if (demoInvoices().length > 0) return;
  const now = new Date();
  demoSaveInvoices([
    { id:'INV-2026-001', venueId:userId, month:'Junio 2026', subscription:199, events:2400, total:2599, status:'paid',    date:'2026-06-30' },
    { id:'INV-2026-002', venueId:userId, month:'Julio 2026', subscription:199, events:3200, total:3399, status:'pending', date:'2026-07-31' },
  ]);
}

/* ---- Seed performances (demo) ---- */
function demoPerformances() {
  try { return JSON.parse(localStorage.getItem(DEMO_PERFORMANCES_KEY)) || []; } catch { return []; }
}
function demoSavePerformances(p) { localStorage.setItem(DEMO_PERFORMANCES_KEY, JSON.stringify(p)); }
function seedPerformances(userId) {
  if (demoPerformances().length > 0) return;
  const today = new Date();
  const y = today.getFullYear(), m = today.getMonth();
  const fmt = (d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  demoSavePerformances([
    { id:'p1', artistId:userId, venueName:'Hotel Vertice Madrid', venueAddr:'Gran Vía 42, Madrid', date:fmt(5), time:'21:00-23:00', genre:'jazz', cache:800, status:'completed', rating:4.8 },
    { id:'p2', artistId:userId, venueName:'Rooftop The Standard', venueAddr:'Plaza de España 8, Madrid', date:fmt(12), time:'22:00-00:00', genre:'pop', cache:600, status:'confirmed', rating:null },
    { id:'p3', artistId:userId, venueName:'Bar Malasaña Live', venueAddr:'Calle Manuela Malasaña 14, Madrid', date:fmt(19), time:'21:30-23:30', genre:'rock', cache:500, status:'confirmed', rating:null },
    { id:'p4', artistId:userId, venueName:'NH Collection Eurobuilding', venueAddr:'Calle del Padre Damián 23, Madrid', date:fmt(26), time:'20:00-22:00', genre:'jazz', cache:1200, status:'pending', rating:null },
    { id:'p5', artistId:userId, venueName:'Hotel Urso', venueAddr:'Calle de la Puebla 5, Madrid', date:`${y}-${String(m).padStart(2,'0')}-28`, time:'21:00-23:00', genre:'jazz', cache:900, status:'completed', rating:4.9 },
  ]);
}

/* ---- Seed settlements (demo) ---- */
function demoSettlements() {
  try { return JSON.parse(localStorage.getItem(DEMO_SETTLEMENTS_KEY)) || []; } catch { return []; }
}
function demoSaveSettlements(s) { localStorage.setItem(DEMO_SETTLEMENTS_KEY, JSON.stringify(s)); }
function seedSettlements(userId) {
  if (demoSettlements().length > 0) return;
  const today = new Date();
  const y = today.getFullYear(), m = today.getMonth();
  const fmt = (d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  demoSaveSettlements([
    { id:'s1', artistId:userId, venueName:'Hotel Vertice Madrid', date:fmt(6), cache:800, commission:80, net:720, status:'paid', method:'Transferencia' },
    { id:'s2', artistId:userId, venueName:'Hotel Urso', date:`${y}-${String(m).padStart(2,'0')}-29`, cache:900, commission:90, net:810, status:'paid', method:'Transferencia' },
    { id:'s3', artistId:userId, venueName:'Rooftop The Standard', date:fmt(13), cache:600, commission:60, net:540, status:'pending', method:'Transferencia' },
  ]);
}

/* ---- Seed artist invoices (demo) ---- */
function demoArtistInvoices() {
  try { return JSON.parse(localStorage.getItem(DEMO_ARTIST_INV_KEY)) || []; } catch { return []; }
}
function demoSaveArtistInvoices(i) { localStorage.setItem(DEMO_ARTIST_INV_KEY, JSON.stringify(i)); }
function seedArtistInvoices(userId) {
  if (demoArtistInvoices().length > 0) return;
  demoSaveArtistInvoices([
    { id:'AINV-2026-001', artistId:userId, month:'Junio 2026', concept:'Actuación × 2', amount:1440, status:'paid', date:'2026-06-30' },
    { id:'AINV-2026-002', artistId:userId, month:'Julio 2026', concept:'Actuación × 1', amount:540, status:'pending', date:'2026-07-31' },
  ]);
}

/* =========================================================
   PUBLIC API
   ========================================================= */

export async function getUserProfile(uid) {
  if (isFirebaseConfigured && fbFirestore) {
    const cacheKey = `palcofy.profile.${uid}`;
    const cached = (() => { try { return JSON.parse(localStorage.getItem(cacheKey)); } catch { return null; } })();
    if (cached) {
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
  const users = JSON.parse(localStorage.getItem('palcofy.demo.users') || '{}');
  return users[uid] || null;
}

export async function updateUserProfile(uid, data) {
  if (isFirebaseConfigured && fbFirestore) {
    localStorage.removeItem(`palcofy.profile.${uid}`);
    return fbFirestore.updateDoc(fbFirestore.doc(db, 'users', uid), data);
  }
  const users = JSON.parse(localStorage.getItem('palcofy.demo.users') || '{}');
  if (users[uid]) { Object.assign(users[uid], data); localStorage.setItem('palcofy.demo.users', JSON.stringify(users)); }
}

export async function listArtists() {
  const list = [];
  const addedIds = new Set();
  const addedEmails = new Set();

  const add = (item) => {
    const id = item.id || item.uid;
    const email = (item.email || '').toLowerCase();
    if (id && addedIds.has(id)) return;
    if (email && addedEmails.has(email)) return;
    if (id) addedIds.add(id);
    if (email) addedEmails.add(email);
    list.push({
      id: id || `art_${Math.random()}`,
      name: item.name || item.displayName || 'Artista',
      genre: item.genre || 'pop',
      cache: item.cache || 500,
      radius: item.radius || 50,
      available: item.available !== false,
      pro: item.pro === true,
      description: item.description || item.bio || 'Artista verificado en la plataforma PALCOFY.',
      rating: item.rating || 4.7,
      ...item
    });
  };

  /* 1. Firestore */
  if (isFirebaseConfigured && fbFirestore) {
    try {
      const snap = await fbFirestore.getDocs(fbFirestore.collection(db, 'users'));
      snap.forEach(d => {
        const data = d.data();
        const r = (data.role || '').toLowerCase();
        if (r === 'artist' || r === 'cantante' || r === 'singer' || data.genre || data.cache) {
          add({ id: d.id, ...data });
        }
      });
    } catch (e) {
      console.warn('PALCOFY: Error al consultar artistas de Firestore:', e);
    }
  }

  /* 2. Demo Users */
  try {
    const demoUsers = JSON.parse(localStorage.getItem('palcofy.demo.users') || '{}');
    Object.values(demoUsers).forEach(u => {
      const r = (u.role || '').toLowerCase();
      if (r === 'artist' || r === 'cantante' || r === 'singer' || u.genre || u.cache) {
        add({ id: u.uid || u.id, ...u });
      }
    });
  } catch (e) {}

  /* 3. Seed Artists */
  seedArtists();
  const demoList = demoArtists() || [];
  demoList.forEach(da => add(da));

  console.info(`PALCOFY ✓ listArtists retornado: ${list.length} artistas`);
  return list;
}

export async function listVenues() {
  if (isFirebaseConfigured && fbFirestore) {
    try {
      const snap = await fbFirestore.getDocs(fbFirestore.collection(db, 'users'));
      const list = [];
      snap.forEach(d => {
        const data = d.data();
        const r = (data.role || '').toLowerCase();
        if (r === 'venue' || r === 'hotel' || r === 'recinto' || r === 'cliente' || data.venueName) {
          list.push({
            id: d.id,
            name: data.venueName || data.name || 'Venue Registrado',
            venueName: data.venueName || data.name || 'Venue Registrado',
            city: data.city || 'Madrid',
            address: data.address || 'Ubicación verificada',
            plan: data.plan || 'piloto',
            capacity: data.capacity || 150,
            type: data.type || 'hotel',
            description: data.description || 'Recinto/Hotel verificado en la red PALCOFY.',
            rating: data.rating || 4.8,
            ...data
          });
        }
      });
      seedVenues();
      const demo = demoVenues() || [];
      demo.forEach(dv => {
        if (!list.some(v => v.id === dv.id || (v.email && v.email === dv.email))) {
          list.push(dv);
        }
      });
      return list;
    } catch (e) {
      console.warn('PALCOFY: Error al consultar venues de Firestore:', e);
    }
  }
  seedVenues();
  return demoVenues() || [];
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

/* =========================================================
   EVENT CALLS & CANDIDATES API (Convocatorias)
   ========================================================= */
const DEMO_EVENTS_KEY = 'palcofy.demo.events';

function demoEvents() {
  try { return JSON.parse(localStorage.getItem(DEMO_EVENTS_KEY)) || []; } catch { return []; }
}
function demoSaveEvents(evts) { localStorage.setItem(DEMO_EVENTS_KEY, JSON.stringify(evts)); }

function seedEvents() {
  if (demoEvents().length > 0) return;
  const today = new Date();
  const y = today.getFullYear(), m = today.getMonth();
  const fmt = (d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  demoSaveEvents([
    {
      id: 'evt_1', venueId: 'v1', venueName: 'Hotel Vértice Madrid',
      title: 'Noche de Jazz & Soul en Terraza', date: fmt(15), time: '21:00',
      genre: 'jazz', budget: 750, notes: 'Se ofrece cena para los músicos y camerino.',
      status: 'open', candidates: [
        { id: 'c1', artistId: '1', artistName: 'Carlos Vives Trio', artistGenre: 'jazz', artistCache: 800, rating: 4.9, appliedAt: new Date().toISOString() },
        { id: 'c2', artistId: '4', artistName: 'Quinteto Sol', artistGenre: 'jazz', artistCache: 350, rating: 4.6, appliedAt: new Date().toISOString() }
      ],
      createdAt: new Date().toISOString()
    },
    {
      id: 'evt_2', venueId: 'v2', venueName: 'Rooftop The Standard',
      title: 'Sunset Session — Pop & DJ Set', date: fmt(22), time: '20:00',
      genre: 'electronic', budget: 600, notes: 'Equipo de sonido e iluminación incluidos.',
      status: 'open', candidates: [
        { id: 'c3', artistId: '7', artistName: 'DJ Martín Vega', artistGenre: 'electronic', artistCache: 400, rating: 4.4, appliedAt: new Date().toISOString() }
      ],
      createdAt: new Date().toISOString()
    }
  ]);
}

export async function createEventCall({ venueId, venueName, title, date, time, genre, budget, notes }) {
  const eventCall = {
    id: `evt_${Date.now()}`,
    venueId, venueName: venueName || 'Hotel Partner',
    title: title || 'Convocatoria Musical',
    date, time: time || '21:00',
    genre: genre || 'jazz',
    budget: parseInt(budget, 10) || 500,
    notes: notes || '',
    status: 'open',
    candidates: [],
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured && fbFirestore) {
    try {
      await fbFirestore.setDoc(fbFirestore.doc(db, 'events', eventCall.id), eventCall);
      return eventCall.id;
    } catch (e) {
      console.warn('PALCOFY: Error guardando evento en Firestore:', e);
    }
  }

  const events = demoEvents();
  events.push(eventCall);
  demoSaveEvents(events);
  return eventCall.id;
}

export async function listEventCalls() {
  seedEvents();
  if (isFirebaseConfigured && fbFirestore) {
    try {
      const snap = await fbFirestore.getDocs(fbFirestore.collection(db, 'events'));
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      if (list.length > 0) return list;
    } catch (e) {
      console.warn('PALCOFY: Error al listar eventos:', e);
    }
  }
  return demoEvents();
}

export async function listVenueEventCalls(venueId) {
  const events = await listEventCalls();
  return events.filter(e => e.venueId === venueId || !venueId);
}

export async function applyToEventCall({ eventId, artistId, artistName, artistGenre, artistCache, artistRating }) {
  const events = await listEventCalls();
  const evt = events.find(e => e.id === eventId);
  if (!evt) throw new Error('Evento no encontrado');

  evt.candidates = evt.candidates || [];
  if (evt.candidates.some(c => c.artistId === artistId)) {
    return; // Ya postulado
  }

  evt.candidates.push({
    id: `cand_${Date.now()}`,
    artistId, artistName: artistName || 'Artista',
    artistGenre: artistGenre || 'pop',
    artistCache: artistCache || 500,
    rating: artistRating || 4.8,
    appliedAt: new Date().toISOString()
  });

  if (isFirebaseConfigured && fbFirestore) {
    try {
      await fbFirestore.setDoc(fbFirestore.doc(db, 'events', eventId), evt);
    } catch (e) {}
  }
  const demoList = demoEvents();
  const idx = demoList.findIndex(e => e.id === eventId);
  if (idx >= 0) { demoList[idx] = evt; demoSaveEvents(demoList); }
  else { demoList.push(evt); demoSaveEvents(demoList); }
}

export async function acceptEventCandidate({ eventId, artistId, artistName, cache }) {
  const events = await listEventCalls();
  const evt = events.find(e => e.id === eventId);
  if (evt) {
    evt.status = 'closed';
    evt.selectedArtistId = artistId;
    evt.selectedArtistName = artistName;

    if (isFirebaseConfigured && fbFirestore) {
      try { await fbFirestore.setDoc(fbFirestore.doc(db, 'events', eventId), evt); } catch (e) {}
    }
    const demoList = demoEvents();
    const idx = demoList.findIndex(e => e.id === eventId);
    if (idx >= 0) { demoList[idx] = evt; demoSaveEvents(demoList); }
  }

  // Crear la reserva confirmada automáticamente
  if (evt) {
    await createBooking({
      venueId: evt.venueId,
      artistId,
      artistName,
      date: evt.date,
      time: evt.time,
      notes: `Confirmado desde convocatoria: ${evt.title}`,
      cache: cache || evt.budget
    });
  }
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
  seedBookings(venueId);
  return demoBookings().filter(b => b.venueId === venueId).sort((a, b) => a.date > b.date ? -1 : 1);
}

export async function updateBookingStatus(bookingId, status) {
  if (isFirebaseConfigured && fbFirestore) {
    return fbFirestore.updateDoc(fbFirestore.doc(db, 'bookings', bookingId), { status });
  }
  const bookings = demoBookings();
  const b = bookings.find(x => x.id === bookingId);
  if (b) { b.status = status; demoSaveBookings(bookings); }
}

export async function listInvoices(venueId) {
  if (isFirebaseConfigured && fbFirestore) {
    try {
      const q = fbFirestore.query(fbFirestore.collection(db, 'invoices'), fbFirestore.where('venueId', '==', venueId));
      const snap = await fbFirestore.getDocs(q);
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      return list;
    } catch { return []; }
  }
  seedInvoices(venueId);
  return demoInvoices().filter(i => i.venueId === venueId);
}

export async function getBookingStats(venueId) {
  const bookings = await listBookings(venueId);
  const now = new Date();
  const thisMonth = bookings.filter(b => {
    const d = new Date(b.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const upcoming = thisMonth.filter(b => new Date(b.date) >= now && b.status !== 'cancelled');
  const totalCache = thisMonth.reduce((sum, b) => sum + (b.cache || 0), 0);
  return {
    totalThisMonth: thisMonth.length,
    upcoming: upcoming.length,
    totalCache,
    nextEvent: upcoming.sort((a, b) => a.date > b.date ? 1 : -1)[0] || null
  };
}

/* ---- Performances (artist) ---- */
export async function listPerformances(artistId) {
  if (isFirebaseConfigured && fbFirestore) {
    try {
      const q = fbFirestore.query(fbFirestore.collection(db, 'performances'), fbFirestore.where('artistId', '==', artistId));
      const snap = await fbFirestore.getDocs(q);
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      return list.sort((a, b) => a.date > b.date ? -1 : 1);
    } catch { return []; }
  }
  seedPerformances(artistId);
  return demoPerformances().filter(p => p.artistId === artistId).sort((a, b) => a.date > b.date ? -1 : 1);
}

/* ---- Settlements (artist) ---- */
export async function listSettlements(artistId) {
  if (isFirebaseConfigured && fbFirestore) {
    try {
      const q = fbFirestore.query(fbFirestore.collection(db, 'settlements'), fbFirestore.where('artistId', '==', artistId));
      const snap = await fbFirestore.getDocs(q);
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      return list.sort((a, b) => a.date > b.date ? -1 : 1);
    } catch { return []; }
  }
  seedSettlements(artistId);
  return demoSettlements().filter(s => s.artistId === artistId).sort((a, b) => a.date > b.date ? -1 : 1);
}

/* ---- Artist invoices ---- */
export async function listArtistInvoices(artistId) {
  if (isFirebaseConfigured && fbFirestore) {
    try {
      const q = fbFirestore.query(fbFirestore.collection(db, 'artistInvoices'), fbFirestore.where('artistId', '==', artistId));
      const snap = await fbFirestore.getDocs(q);
      const list = [];
      snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      return list;
    } catch { return []; }
  }
  seedArtistInvoices(artistId);
  return demoArtistInvoices().filter(i => i.artistId === artistId);
}

/* =========================================================
   ADMIN USER MANAGEMENT
   ========================================================= */

export async function listAllUsers() {
  let usersList = [];

  if (isFirebaseConfigured && fbFirestore) {
    try {
      const snap = await fbFirestore.getDocs(fbFirestore.collection(db, 'users'));
      snap.forEach(docSnap => {
        usersList.push({ id: docSnap.id, ...docSnap.data() });
      });
    } catch (e) {
      console.warn('PALCOFY: Error al obtener usuarios de Firestore:', e);
    }
  }

  const localUsersRaw = (() => {
    try { return JSON.parse(localStorage.getItem('palcofy.demo.users')) || {}; } catch { return {}; }
  })();

  Object.keys(localUsersRaw).forEach(uid => {
    if (!usersList.some(u => u.id === uid || u.email === localUsersRaw[uid].email)) {
      usersList.push({ id: uid, ...localUsersRaw[uid] });
    }
  });

  const seedV = demoVenues() || [];
  seedV.forEach(v => {
    if (!usersList.some(u => u.id === v.id || u.email === (v.email || `${v.id}@hotel.com`))) {
      usersList.push({
        id: v.id,
        name: v.venueName || v.name,
        venueName: v.venueName || v.name,
        email: v.email || `${v.id}@hotel.com`,
        role: 'venue',
        city: v.city || 'Madrid',
        address: v.address || 'Ubicación verificada',
        capacity: v.capacity || 150,
        type: v.type || 'hotel',
        status: v.status || 'pending',
        createdAt: new Date().toISOString()
      });
    }
  });

  const seedA = demoArtists() || [];
  seedA.forEach(a => {
    if (!usersList.some(u => u.id === a.id || u.email === (a.email || `${a.id}@cantante.com`))) {
      usersList.push({
        id: a.id,
        name: a.name,
        email: a.email || `${a.id}@cantante.com`,
        role: 'artist',
        genre: a.genre || 'pop',
        cache: a.cache || 500,
        radius: a.radius || 50,
        photoUrl: a.photoUrl || '',
        videoUrl: a.videoUrl || '',
        iban: a.iban || 'ES91 2100 0418 4502 0005 1332',
        bankHolder: a.bankHolder || a.name,
        bankCert: a.bankCert || 'Certificado_BBVA.pdf',
        bankVerified: true,
        status: a.status || 'pending',
        createdAt: new Date().toISOString()
      });
    }
  });

  return usersList;
}

export async function updateUserStatus({ userId, status, reason = '' }) {
  if (!userId || !status) return false;

  if (isFirebaseConfigured && fbFirestore) {
    try {
      await fbFirestore.updateDoc(fbFirestore.doc(db, 'users', userId), {
        status,
        statusUpdatedAt: new Date().toISOString(),
        statusReason: reason
      });
    } catch (e) {
      console.warn('PALCOFY: Error al actualizar estado en Firestore:', e);
    }
  }

  const cacheKey = `palcofy.profile.${userId}`;
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey));
    if (cached) {
      cached.status = status;
      localStorage.setItem(cacheKey, JSON.stringify(cached));
    }
  } catch (e) {}

  try {
    const users = JSON.parse(localStorage.getItem('palcofy.demo.users')) || {};
    if (users[userId]) {
      users[userId].status = status;
      localStorage.setItem('palcofy.demo.users', JSON.stringify(users));
    }
  } catch (e) {}

  try {
    const venues = demoVenues() || [];
    const idxV = venues.findIndex(v => v.id === userId);
    if (idxV !== -1) {
      venues[idxV].status = status;
      demoSaveVenues(venues);
    }

    const artists = demoArtists() || [];
    const idxA = artists.findIndex(a => a.id === userId);
    if (idxA !== -1) {
      artists[idxA].status = status;
      demoSaveArtists(artists);
    }
  } catch (e) {}

  return true;
}
