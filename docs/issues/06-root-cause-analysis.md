# Root cause analysis

The regression was introduced by a notification pipeline refactor that assumed `notificationPreferences` was always a non-null object.

## Root cause
A null guard was removed in the notification processor when filtering out opted-out customers. The code checked `event.notificationPreferences.emailEnabled === false` without verifying the object exists. For older customer records where `notificationPreferences` is null, the consumer threw and the message was dropped.

## Expected behavior
- Null should be treated the same as a customer with no explicit opt-out.
- Confirmations should still be sent when preferences are absent.
- The consumer should only skip messages for customers who explicitly disable emails.

## Evidence
- Legacy customer records often have no notification preferences.
- Notification service warnings increased around the deployment.
- The production symptom aligns with a dropped subset of events rather than a complete pipeline outage.
