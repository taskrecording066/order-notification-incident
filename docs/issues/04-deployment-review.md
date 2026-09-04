# Deployment review

Review the release that shipped before the incident to confirm what changed in the notification path.

## Considerations
- A downstream delivery change shipped on 09:34 UTC.
- A performance optimization PR was also merged the same day.
- The UI optimization appears unrelated and should be treated as a distractor.
- Focus on the notification consumer code and payload validation changes.

## Evidence
- Release notes mention refactoring to make the downstream delivery path more resilient and configurable.
- The worker warning count increased immediately after the release.
- The incident was not observed during the performance optimization rollout.
