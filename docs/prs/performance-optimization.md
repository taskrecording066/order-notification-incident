# PR: Batch order event publication for throughput

## Summary
This PR optimizes broker writes for high-volume order creation traffic by adding a `publishBatch` helper for the broker boundary and introducing a lightweight queue-depth method for observability.

## Changed files
- `src/Infrastructure/messageBroker.js`

## Risk assessment
Low risk. The change is isolated to the broker abstraction and retains the single-message publish path.

## Reviewer notes
- Confirm that the batch helper preserves message ordering for single topics.
- Check whether queue-depth metrics are useful for operations dashboards.
