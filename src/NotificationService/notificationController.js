const { getNotificationState } = require('./notificationProcessor');

function handleGetNotifications(req, res) {
  const state = getNotificationState(req.params.orderId);
  return res.json({ orderId: req.params.orderId, ...state });
}

module.exports = { handleGetNotifications };
