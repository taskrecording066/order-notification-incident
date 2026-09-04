# PR: Refactor notification pipeline for preference-aware processing

## Summary
This PR consolidates notification eligibility checks into the NotificationService worker and introduces explicit handling for the email preference flag. The refactor keeps the customer-level filtering logic in one place to simplify future changes.

## Changed files
- `src/NotificationService/notificationProcessor.js`
- `src/NotificationService/eventConsumer.js`

## Risk assessment
Moderate risk. This change centralizes filtering in the worker, which is where the email delivery regression would surface if null data is not handled correctly.

## Reviewer comments
- The consumer should keep retries and dropped messages clear for support investigation.
- Validation should cover null or missing preferences as a primary compatibility case.
