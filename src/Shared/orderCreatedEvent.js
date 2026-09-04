class OrderCreatedEvent {
  constructor(order, metadata = {}) {
    this.eventType = 'OrderCreated';
    this.orderId = order.id;
    this.customerId = order.customerId;
    this.email = order.email;
    this.total = order.total;
    this.timestamp = new Date().toISOString();
    this.notificationPreferences = order.notificationPreferences ?? null;
    this.metadata = metadata;
  }
}

module.exports = { OrderCreatedEvent };
