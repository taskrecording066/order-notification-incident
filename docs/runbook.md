# Incident Runbook

## Symptoms

- Orders are accepted successfully.
- Payments are captured successfully.
- An email confirmation is missing for a subset of customers.

## Questions to answer

1. Are the order events actually published?
2. Are the events reaching the notification broker topic?
3. Are consumers skipping some messages?
4. Do legacy customer records omit notification preferences?
5. Does the recent pipeline refactor filter out a valid default path?
