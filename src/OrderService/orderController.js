const { createOrder, getOrder, retryNotification } = require('./orderService');
const { EventConsumer } = require('../NotificationService/eventConsumer');

function handleCreateOrder(req, res) {
  const { customerId, email, total, notificationPreferences } = req.body || {};
  if (!customerId || !email || !total) {
    return res.status(400).json({ error: 'customerId, email, and total are required' });
  }

  const order = createOrder({ customerId, email, total, notificationPreferences });
  const processing = EventConsumer.drain('orders.created');
  return res.status(201).json({
    id: order.id,
    status: order.status,
    customerId: order.customerId,
    notificationStatus: processing ? processing.status : 'queued'
  });
}

function handleGetOrder(req, res) {
  const order = getOrder(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'order not found' });
  }

  return res.json({
    id: order.id,
    customerId: order.customerId,
    email: order.email,
    total: order.total,
    status: order.status,
    createdAt: order.createdAt
  });
}

function handleRetryNotification(req, res) {
  const response = retryNotification(req.body.orderId);
  return res.status(202).json(response);
}

module.exports = { handleCreateOrder, handleGetOrder, handleRetryNotification };
