# Notification service investigation

The notification worker is the first component that can explain a drop in email success without a corresponding increase in order failures.

## Questions
- Does the service incorrectly reject otherwise valid messages during eligibility checks or payload validation?
- Is the notification worker applying a too-strict rule to valid edge cases?
- Are retries being swallowed by the consumer?
- Is the email sender being called with incorrect or malformed payloads?

## Clues
- Worker warning logs spiked immediately after deployment.
- The failure mode is selective and not all customers are impacted.
- The issue appears tied to a subset of orders or customer states that fall outside the normal happy path.
