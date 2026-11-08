import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ARTIST_CATEGORIES,
  MEDIA_RULES,
  isValidMediaFile,
  isValidVideoUrl,
  validateArtistRegistration
} from '../app/artist-profile.mjs';

const validInput = {
  name: 'DJ Castellón',
  email: 'artist@example.com',
  password: 'segura123',
  phone: '+34 600 123 456',
  city: 'Castellón',
  category: 'dj-live-singer-mc',
  cache: 500,
  radius: 50,
  videoUrl: 'https://www.youtube.com/watch?v=abc123',
  privacyAccepted: true
};

test('accepts the combined DJ, singer and MC category', () => {
  assert.ok(ARTIST_CATEGORIES.some(option => option.value === 'dj-live-singer-mc'));
  assert.equal(validateArtistRegistration(validInput).valid, true);
});

test('requires professional city, phone and real performance video', () => {
  const result = validateArtistRegistration({ ...validInput, city: '', phone: '', videoUrl: '' });
  assert.equal(result.valid, false);
  assert.ok(result.errors.city);
  assert.ok(result.errors.phone);
  assert.ok(result.errors.video);
});

test('rejects non-approved video hosts and insecure links', () => {
  assert.equal(isValidVideoUrl('https://www.youtube.com/watch?v=abc'), true);
  assert.equal(isValidVideoUrl('http://youtube.com/watch?v=abc'), false);
  assert.equal(isValidVideoUrl('https://example.com/video.mp4'), false);
});

test('enforces media MIME type and size limits', () => {
  const photo = { type: 'image/jpeg', size: 1024 };
  const oversizedPhoto = { type: 'image/jpeg', size: MEDIA_RULES.image.maxBytes + 1 };
  const fakePhoto = { type: 'application/pdf', size: 1024 };
  assert.equal(isValidMediaFile(photo, 'image'), true);
  assert.equal(isValidMediaFile(oversizedPhoto, 'image'), false);
  assert.equal(isValidMediaFile(fakePhoto, 'image'), false);
});

test('rejects registration without privacy consent', () => {
  const result = validateArtistRegistration({ ...validInput, privacyAccepted: false });
  assert.equal(result.valid, false);
  assert.ok(result.errors.privacy);
});
