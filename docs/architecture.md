# Order Platform Architecture

## System overview

The e-commerce platform is an event-driven system that accepts orders, publishes events to a shared broker, and then notifies customers asynchronously by email.

```text
Customer
  |
  v
Checkout UI
  |
  v
Order API
  |
  v
Order Service
  |
  v
OrderCreated event
  |
  v
Message Broker
  |
  v
Notification Service
  |
  v
Email Provider
```

## Components

### Checkout UI
The Checkout UI collects order and customer data, submits the order to the Order API, and presents a basic success message. It is intentionally thin and values reliability over frontend complexity.

### Order API
The Order API accepts customer orders, validates required fields, and delegates to the Order Service for persistence and event publication.

### Order Service
The Order Service records the order, emits an `OrderCreated` event, and persists a `notificationStatus` record. It is responsible for the transaction boundary that marks a placed order as accepted.

### Event Publisher
The Event Publisher serializes the event and writes it to the message broker. It uses a retry policy for transient broker failures.

### Message Broker
Kafka-style broker that stores order events for downstream consumers. The broker allows independent scaling of the order and notification pipelines.

### Notification Service
The Notification Service consumes order events, filters for eligible customer notifications, and delivers confirmation emails. It isolates the business logic and email vendor integration from order creation.

### Email Provider
The email provider receives final ready-to-send payloads and is responsible for outbound delivery.

## Request flow

```text
Customer -> Checkout UI -> Order API -> Order Service -> Event Publisher -> Message Broker
                                       -> order store
```

## Event flow

```text
OrderCreated event
  |
  v
Message Broker
  |
  v
Notification Service
  |
  +--> EmailSender
  |
  +--> Status update / notifications endpoint
```

## Failure points to investigate

- Payment succeeds but email is not sent.
- Event publisher may not emit the message.
- Broker may silently drop the message.
- NotificationService may skip low-quality events.
- Email service may reject or throttle requests.
- Retry logic or dead-letter processing may be misconfigured.

## Known operational facts

- Order creation success rate is unchanged.
- Notification success rate dropped from ~99% to ~85% following deployment.
- No new API exceptions were observed in the Order API.
- Increases were observed in notification warning logs and dead-letter queue age.
- The system is still accepting orders at the expected rate.
