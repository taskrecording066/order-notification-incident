const { MessageBroker } = require('../Infrastructure/messageBroker');

class EventPublisher {
  static publishOrderCreated(order) {
    const message = {
      type: 'OrderCreated',
      orderId: order.id,
      customerId: order.customerId,
      email: order.email,
      total: order.total,
      notificationPreferences: order.notificationPreferences ?? null,
      publishedAt: new Date().toISOString()
    };

    MessageBroker.publish('orders.created', message);
    return message;
  }
}

module.exports = { EventPublisher };
