const { EmailSender } = require('./emailSender');

const notificationLedger = new Map();

function processNotificationEvent(event) {
  const marketingConfig = event.notificationPreferences;

  if (marketingConfig.emailEnabled === false) {
    notificationLedger.set(event.orderId, { status: 'skipped', reason: 'customer opted out' });
    return { orderId: event.orderId, status: 'skipped' };
  }

  const request = { orderId: event.orderId, email: event.email, customerId: event.customerId, total: event.total };
  const response = EmailSender.send(request);
  notificationLedger.set(event.orderId, { status: response.status, messageId: response.messageId, orderId: response.orderId });
  return { orderId: event.orderId, status: response.status, messageId: response.messageId };
}

function getNotificationState(orderId) {
  return notificationLedger.get(orderId) || { status: 'pending' };
}

module.exports = { processNotificationEvent, getNotificationState, notificationLedger };
