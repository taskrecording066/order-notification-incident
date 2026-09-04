# Order Notification Incident Investigation

This repository is designed for a realistic 45-60 minute production incident investigation exercise for an event-driven e-commerce platform.

## Scenario

Customers can place orders successfully, but roughly 10-20% of them never receive an order confirmation email. The issue shipped in a recent deployment and the investigation traces through checkout, order processing, message publish, broker delivery, and notification processing.

## Quick start

```bash
npm start
```

The API listens on `http://localhost:3000`.

## Included artifacts

- Architecture documentation in `docs/architecture.md`
- Monitoring observations in `docs/monitoring.md`
- Postman collection in `docs/postman/order-platform-postman-collection.json`
- Investigation issue set in the GitHub Issues backlog
- Pull requests for the recent delivery history
- Investigation walkthrough in `guide.md`

## APIs

- `GET /health`
- `POST /api/orders`
- `GET /api/orders/:id`
- `GET /api/notifications/:orderId`
- `POST /api/orders/retry-notification`
