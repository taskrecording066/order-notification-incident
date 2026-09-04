const broker = new Map();

class MessageBroker {
  static publish(topic, payload) {
    const messages = broker.get(topic) || [];
    const message = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      topic,
      payload,
      timestamp: new Date().toISOString()
    };
    messages.push(message);
    broker.set(topic, messages);
    return message;
  }

  static publishBatch(topic, payloads) {
    return payloads.map(payload => MessageBroker.publish(topic, payload));
  }

  static consume(topic) {
    const messages = broker.get(topic) || [];
    const next = messages.shift();
    if (next) {
      broker.set(topic, messages);
    }
    return next;
  }

  static peek(topic) {
    return (broker.get(topic) || [])[0] || null;
  }

  static depth(topic) {
    return (broker.get(topic) || []).length;
  }
}

module.exports = { MessageBroker };
