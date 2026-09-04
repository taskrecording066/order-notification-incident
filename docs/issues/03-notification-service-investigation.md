# Notification service investigation

The notification worker is the first component that can explain a drop in email success without a corresponding increase in order failures.

## Questions
- Does the service discard messages because they are missing notification preferences?
- Is there a null guard regression in the notification filter?
- Are retries being swallowed by the consumer?
- Is the email sender being called with incorrect or malformed payloads?

## Clues
- Worker warning logs spiked immediately after deployment.
- The failure mode is selective and not all customers are impacted.
- The issue affects only those records with absent preference metadata.
