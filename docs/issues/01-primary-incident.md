# Incident: Order confirmation emails missing for 10-20% of customers

## Title
Orders are successfully created and paid, but roughly 10-20% never receive their confirmation email.

## Summary
Starting at 09:42 UTC on Thursday, customers reporting payment success but no confirmation email began increasing. The issue is affecting a subset of orders, not all of them, and appears tied to a subset of traffic or customer states seen during the release window.

## Business impact
- Customer trust continues to be harmed by missing confirmation emails.
- Customer support teams are fielding delivery and status inquiries.
- Retail teams cannot reliably attribute order acceptance to the email pipeline.
- The incident has materially increased support contact volume while order creation remains healthy.

## Customer reports
- "I paid for my order and it says successful, but I never got my order confirmation email."
- "I placed the order twice because I didn't get the confirmation."
- "The order is visible in the app, but email never arrived."

## Timeline
- 09:34 UTC: Release candidate promoted with notification worker changes.
- 09:42 UTC: First spike in missing confirmation emails observed in Datadog.
- 09:57 UTC: Support queues show elevated volume.
- 10:08 UTC: Order API health remains green; order creation success rate unchanged.
- 10:14 UTC: Incident declared after dashboard trendline confirms sustained drop in email success rate.

## Known facts
- The Order API and payment service are healthy.
- Notification success rate fell from 99.2% to 84.9%.
- Error logs for the Order API show no significant increase.
- There is a material increase in notification worker warnings.
- The issue appears random, not tied to a single customer cohort.
- A subset of orders or customer states appears to fall outside the normal validation path.

## Investigation checklist
- Confirm whether `OrderCreated` events are emitted consistently.
- Review message broker delivery and replay behavior.
- Inspect the notification worker for filtering or validation logic introduced in the recent pipeline change.
- Check whether a valid edge case is being treated as ineligible for a subset of traffic.
- Compare the recent deployment diff to the last known-good release.
- Validate retry behavior and alerting coverage.
