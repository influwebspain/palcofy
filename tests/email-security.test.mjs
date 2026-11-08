import test from 'node:test';
import assert from 'node:assert/strict';
import security from '../api/email-security.cjs';

const { validateEmailRequest, isAllowedOrigin } = security;

test('accepts only allowlisted email templates and valid recipients', () => {
  assert.equal(validateEmailRequest({ to: 'artist@example.com', template: 'welcome', data: {} }), null);
  assert.notEqual(validateEmailRequest({ to: 'not-an-email', template: 'welcome' }), null);
  assert.notEqual(validateEmailRequest({ to: 'artist@example.com', template: 'arbitrary' }), null);
});

test('rejects header injection and oversized fields', () => {
  assert.notEqual(validateEmailRequest({
    to: 'artist@example.com',
    template: 'welcome',
    subject: 'safe\r\nBcc: attacker@example.com'
  }), null);
  assert.notEqual(validateEmailRequest({
    to: 'artist@example.com',
    template: 'welcome',
    data: { bio: 'x'.repeat(20_001) }
  }), null);
});

test('allows configured origins and rejects untrusted origins', () => {
  assert.equal(isAllowedOrigin('http://localhost:8080'), true);
  assert.equal(isAllowedOrigin('https://evil.example'), false);
  assert.equal(isAllowedOrigin(undefined), true);
});
