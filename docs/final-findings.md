# Suggested Engineer Findings Report

## Most likely root cause
A notification pipeline refactor introduced a null-safety regression in the notification processor. The service filters out email opt-out customers by checking `event.notificationPreferences.emailEnabled === false`, but legacy customer records often have `notificationPreferences: null`. The worker treats that condition as an exception and drops the message without sending the confirmation email.

## Evidence chain
1. Orders continue to create successfully and payment remains healthy.
2. Email success drops while the order pipeline remains stable.
3. Worker warning logs increase immediately after the refactor.
4. The regression only affects the subset of records missing preference metadata.
5. The null guard is absent in the notification consumer logic.

## Recommended remediation
- Treat `null` as equivalent to "email enabled" unless the customer explicitly opts out.
- Add a guard such as `if (event.notificationPreferences && event.notificationPreferences.emailEnabled === false)`.
- Add regression tests for null and missing notification preference records.
- Backfill or validate legacy customer preference data before relying on the refactor.
