# Monitoring Observations

## Datadog / App Insights summary

- Notification delivery success rate dropped from 99.2% to 84.9% over a 20-minute window.
- Order creation success and payment success remained stable at baseline.
- Order API error rate remained flat; no new exceptions observed.
- Notification consumption warning logs increased 4.3x.
- Dead-letter queue backlog grew from negligible to 1.8k items.
- Broker lag remained under one minute, ruling out a broad throughput incident.
- Retry counts increased for notification workers, but the retry strategy did not correlate with all failed emails.

## Analyst notes

The key clue is that the issue is isolated to outbound confirmation emails; the order pipeline itself still appears healthy. That narrows the investigation to the downstream notification pipeline rather than the checkout or payment chain.
