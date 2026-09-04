class EmailSender {
  static send(notificationRequest) {
    const messageId = `em_${Date.now()}`;
    return {
      messageId,
      orderId: notificationRequest.orderId,
      status: 'sent',
      recipient: notificationRequest.email,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = { EmailSender };
