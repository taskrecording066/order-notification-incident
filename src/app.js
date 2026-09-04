const { handleCreateOrder, handleGetOrder, handleRetryNotification } = require('./OrderService/orderController');
const { handleGetNotifications } = require('./NotificationService/notificationController');
const { EventConsumer } = require('./NotificationService/eventConsumer');

function configureRoutes(app) {
  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.post('/api/orders', handleCreateOrder);
  app.get('/api/orders/:id', handleGetOrder);
  app.get('/api/notifications/:orderId', handleGetNotifications);
  app.post('/api/orders/retry-notification', handleRetryNotification);
  app.post('/internal/consume-order-events', (req, res) => {
    const result = EventConsumer.drain('orders.created');
    res.json({ status: 'processed', result });
  });
}

module.exports = { configureRoutes };
