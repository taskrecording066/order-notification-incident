class NotificationRequest {
  constructor(order, messageId) {
    this.orderId = order.id;
    this.customerId = order.customerId;
    this.email = order.email;
    this.subject = 'Order confirmation';
    this.messageId = messageId;
    this.payload = {
      orderId: order.id,
      customerId: order.customerId,
      email: order.email,
      total: order.total,
      template: 'order-confirmation-email'
    };
  }
}

module.exports = { NotificationRequest };
