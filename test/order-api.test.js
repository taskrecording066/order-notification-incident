const test = require('node:test');
const assert = require('node:assert/strict');
const { processNotificationEvent } = require('../src/NotificationService/notificationProcessor');

test('notification sends when email is enabled', () => {
  const result = processNotificationEvent({
    orderId: 'ord_1',
    customerId: 'C-1',
    email: 'a@example.com',
    total: 12.5,
    notificationPreferences: { emailEnabled: true }
  });

  assert.equal(result.status, 'sent');
});

test('notification is skipped when customer opts out', () => {
  const result = processNotificationEvent({
    orderId: 'ord_2',
    customerId: 'C-2',
    email: 'b@example.com',
    total: 24,
    notificationPreferences: { emailEnabled: false }
  });

  assert.equal(result.status, 'skipped');
});
