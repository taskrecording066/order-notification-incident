# Release validation

The rollout checklist missed a compatibility check for legacy notification preferences.

## Findings
- The refactor added assumption-heavy filters for notification preferences.
- Legacy data with `notificationPreferences = null` was not covered in validation.
- No synthetic test was added for customers missing preference configuration.
- The backlog review did not include older records or upgrade paths.

## Required follow-up
- Add compatibility tests for null preferences.
- Validate contract changes against historical customer records.
- Confirm all notification processing paths treat null as enabled by default.
