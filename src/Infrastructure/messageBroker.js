const broker = new Map();

class MessageBroker {
  static publish(topic, payload) {
    const messages = broker.get(topic) || [];
    messages.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      topic,
      payload,
      timestamp: new Date().toISOString()
    });
    broker.set(topic, messages);
    return messages[messages.length - 1];
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
}

module.exports = { MessageBroker };
