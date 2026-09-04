# Event publishing investigation

The event publishing path has not shown a drop in order creation or payment success. We need to confirm whether the message is still emitted once the order is created.

## Questions
- Is the `OrderCreated` event present in the broker topic for failed notifications?
- Are events being dropped before the broker commit?
- Is a recent refactor changing payload schema or field names?
- Are some events missing or truncating contextual data that downstream consumers expect?

## Clues
- The order success rate is flat, which suggests the order transaction itself is not failing.
- The broker queue does not show a broad backlog issue, which points to a smaller subset of messages being discarded.
- The event payload appears to carry some contextual fields that may be absent or incomplete for a subset of traffic.
