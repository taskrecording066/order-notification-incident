const { MessageBroker } = require('../Infrastructure/messageBroker');
const { processNotificationEvent } = require('./notificationProcessor');

class EventConsumer {
  static drain(topic) {
    const message = MessageBroker.consume(topic);
    if (!message) return null;

    try {
      return processNotificationEvent(message.payload);
    } catch (error) {
      return {
        orderId: message.payload.orderId,
        status: 'dropped',
        reason: error.message,
        topic
      };
    }
  }
}

module.exports = { EventConsumer };
