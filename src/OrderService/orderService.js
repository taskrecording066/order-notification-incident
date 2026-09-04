const { OrderCreatedEvent } = require('../Shared/orderCreatedEvent');
const { MessageBroker } = require('../Infrastructure/messageBroker');

const orders = new Map();

function createOrder({ customerId, email, total, notificationPreferences }) {
  const order = {
    id: `ord_${Date.now()}`,
    customerId,
    email,
    total,
    status: 'created',
    notificationPreferences,
    createdAt: new Date().toISOString()
  };

  orders.set(order.id, order);

  const event = new OrderCreatedEvent(order, { source: 'OrderService' });
  MessageBroker.publish('orders.created', event);

  return order;
}

function getOrder(orderId) {
  return orders.get(orderId) || null;
}

function retryNotification(orderId) {
  const order = orders.get(orderId);
  if (!order) {
    return { orderId, status: 'not-found' };
  }

  MessageBroker.publish('orders.retry', { orderId, retry: true, timestamp: new Date().toISOString() });
  return { orderId, status: 'retry-queued' };
}

module.exports = { createOrder, getOrder, retryNotification, orders };
