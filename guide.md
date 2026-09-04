# Incident investigation guide

This walkthrough is designed for a 45-60 minute production incident review. Your goal is to investigate a subtle regression in an event-driven e-commerce platform and determine which recent merged change caused the issue.

## Apps to use

Use three separate applications while you work:

1. VS Code: inspect the implementation, compare branches/commits, and review the code paths.
2. GitHub in the browser: review the issue, the merged PRs, and the commit history.
3. Postman: hit the running API and validate the behavior against what the code suggests.

The integrated terminal is useful for running tests or a local API server, but it is not a separate app in the workflow.

## Starting context

The repository is already prepared as an investigation exercise.

- The app is a small event-driven e-commerce platform.
- Orders are accepted successfully and payment succeeds.
- About 10-20% of customers never receive the order confirmation email.
- The issue was introduced during a recent deployment.
- The repo history contains three merged pull requests on `main`:
  - PR #7: `Batch order event publication for throughput`
  - PR #8: `Refactor notification pipeline for preference-aware processing`
  - PR #9: `Checkout UI polish and trust enhancement`
- You are meant to inspect the tickets, architecture, code, and merged history to determine which change caused the incident.

This is a realistic incident review workflow. The defect is subtle and the code should not scream the answer at first glance.

## Repository layout

Open the repository in VS Code and take a quick tour:

- `README.md`
- `docs/architecture.md`
- `docs/monitoring.md`
- `src/OrderService/`
- `src/NotificationService/`
- `src/Infrastructure/`
- `src/Shared/`
- `test/`

Focus your reading on these files first:

- `src/OrderService/orderService.js`
- `src/OrderService/eventPublisher.js`
- `src/NotificationService/notificationProcessor.js`
- `src/NotificationService/eventConsumer.js`
- `src/Shared/orderCreatedEvent.js`
- `test/order-api.test.js`

## Step 1: Review the incident ticket

Open the GitHub issue list and start with the main incident issue.

Look for:
- business impact
- customer reports
- timeline
- known facts
- investigation checklist

The issue should tell you this is not an order-creation problem and not a payment problem. It is constrained to a downstream email delivery problem.

Questions to ask yourself:
- Are orders failing? No.
- Is the payment flow failing? No.
- Is the notification pipeline the likely failure point? Most likely.
- Is the issue isolated to a subset of customers or a subset of events? Likely yes.

## Step 2: Read the architecture docs

Open `docs/architecture.md` and `docs/monitoring.md`.

The architecture docs tell you the intended flow:

Customer -> Checkout UI -> Order API -> Order Service -> Event Publisher -> Message Broker -> Notification Service -> Email Provider

The monitoring doc should narrow the scope further:
- order creation is healthy
- notification delivery drops
- no API exceptions in order service
- warning logs increased in the notification worker
- the problem is downstream of order creation

This should push you toward the notification pipeline, not the checkout UI or the order API.

## Step 3: Inspect the code path

Now go into the implementation.

Start in `src/OrderService/orderService.js` and `src/OrderService/eventPublisher.js`.

Review:
- how an order is created
- how the event is published
- what fields are included in the event payload
- whether any customer metadata like `notificationPreferences` is passed through

Then move to:

- `src/Shared/orderCreatedEvent.js`
- `src/NotificationService/notificationProcessor.js`
- `src/NotificationService/eventConsumer.js`

Look especially for:
- event filtering logic
- null handling
- defaults for missing customer preferences
- any branching related to `notificationPreferences.emailEnabled`

Take note of whether the worker assumes the preference object always exists.

## Step 4: Check the test coverage

Open `test/order-api.test.js`.

The tests are intentionally simple and help answer an important question: does the system cover normal and opted-out customers, but miss the null/legacy-data case?

Look for gaps:
- Are there tests covering a compatibility case where customer metadata is absent or incomplete?
- Do the tests distinguish between an explicit opt-out and a missing preference object?
- Does the code assume the metadata is always present when it is not?

This is a common production issue: the tests cover the obvious happy path and the explicit opt-out path, but may miss the compatibility edge case for older or partially populated records.

## Step 5: Review the merged PR history

This is the key branch-diff investigation step.

Open the GitHub PR list and review the three merged PRs:

1. PR #7: performance optimization
2. PR #8: notification pipeline refactor
3. PR #9: checkout UI polish

Your task is to determine which merged change is most likely to have introduced the regression.

Answer key for the trainer: the culprit is PR #8. The story is designed so the investigator naturally lands on the notification worker, but the actual defect is the refactor in the notification pipeline path.

Use the branch history and the code diff to compare what changed.

### Quick git inspection

From the repo root, run:

```sh
git status
git log --oneline --decorate --graph --all
```

Then inspect the merge parents and the branch commits:

```sh
git show --stat 0c06f0f
git show --stat bb73277
git show --stat de7dbac
```

These commands will show the recent merged history and help you narrow the suspect set.

### What to focus on

- The checkout UI PR should look unconnected to the email pipeline.
- The performance optimization PR touches broker behavior but may or may not be relevant.
- The notification pipeline work is worth checking carefully because it touches the downstream processing path where the symptom is visible.

### Direct root cause (trainer-only answer)

The regression is in `src/NotificationService/notificationProcessor.js`.

The worker effectively does:

```js
const marketingConfig = event.notificationPreferences;

if (marketingConfig.emailEnabled === false) {
  // skip notification
}
```

That is unsafe whenever `notificationPreferences` is `null`. For legacy or partially populated customer records, the code dereferences `emailEnabled` on `null` and drops the event instead of treating it as email-enabled by default. This matches the symptom pattern:

- orders still succeed
- payment and order creation are unaffected
- only a subset of records fail
- the downstream worker logs warnings and the email path is skipped
- PR #8 is the deployment that introduced the change

## Step 6: Trace the actual behavior in the API

Start the server from the repo root:

```sh
npm start
```

Then use Postman or curl to hit the app endpoints.

### Health check

```text
GET http://localhost:3000/health
```

Expected:

```json
{ "status": "ok" }
```

### Create a normal order

```text
POST http://localhost:3000/api/orders
```

Body example:

```json
{
  "customerId": "C-1001",
  "email": "customer@example.com",
  "total": 129.99,
  "notificationPreferences": { "emailEnabled": true }
}
```

Expected behavior: order is created and notification is processed successfully.

### Create an order with explicit opt-out

```json
{
  "customerId": "C-2002",
  "email": "optedout@example.com",
  "total": 65.50,
  "notificationPreferences": { "emailEnabled": false }
}
```

Expected behavior: notification is skipped.

### Create an order with incomplete or missing preference metadata

```json
{
  "customerId": "C-2003",
  "email": "legacy@example.com",
  "total": 45.00,
  "notificationPreferences": null
}
```

This is the compatibility scenario worth checking. It reflects the kind of older or partial customer data production systems often carry.

In a correct system, missing preference metadata should not silently prevent a notification from being sent unless the customer explicitly opted out.

## Step 7: Confirm the working hypothesis

By this point the evidence should be pointing toward the notification service and a compatibility edge case around customer metadata.

The remaining work is to validate the specific hypothesis with code and history:

- a recent change touched the worker logic that decides whether a notification should be sent
- older or partially populated customer records may not have the expected preference object
- the system may be treating those records as if the metadata were always present

Keep the investigation focused on whether the worker handles missing or incomplete metadata safely, and whether the compatibility case was missed in both tests and rollout validation.

## Step 8: Final incident summary

When you finish your investigation, summarize it in a few concise bullets:

- The issue is not in checkout or order creation.
- The issue is in the notification pipeline.
- The regression came from PR #8, the notification pipeline refactor.
- The worker logic in `src/NotificationService/notificationProcessor.js` assumed `notificationPreferences` was always defined.
- Null or missing metadata caused the event to be dropped instead of treated as email-enabled by default.
- The final fix should make the notification path null-safe and add a regression test for legacy customer data.

## Suggested evidence to gather before concluding

Before closing the investigation, make sure you can support your conclusion with evidence from:

- the main incident issue
- the architecture docs
- the monitoring notes
- the merged PR history
- the notification service implementation
- the null-pref behavior in the API flow

A strong incident narrative should connect all of those artifacts together.

## Success criteria

You are done when you can clearly explain:

- the affected system boundary
- the deployment that introduced the regression: PR #8
- the reason the issue appeared in a subset of traffic
- why order success remained healthy
- why the notification worker is the correct place to focus
- that the root cause is a null-safety bug in `notificationPreferences` handling, where missing data caused the email path to be skipped

Good luck.
