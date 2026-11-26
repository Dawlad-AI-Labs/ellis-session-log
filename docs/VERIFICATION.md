# Candidate verification · 26 November 2026

Operator: Noor (self-check, not independent release review). Environment: macOS, Node.js 24.18.1. No packages installed, API calls, real records or audio used.

- Source module bytes match the committed Ellis server/sessions.mjs at the provenance commit.
- Fresh local clone: the node:test scenario passed; append/read, summary, separate-process persistence, invalid ID, oversized batch, synthetic attachment size checks and Unix file mode were exercised.
- First synthetic example: 4 stored events, 2 turns, expected end reason.
- Second process running the same example: 8 stored events, 4 turns, demonstrating append persistence, not retry deduplication.
- Included files were reviewed as text and checked for common private-key, GitHub-token, provider-key and AWS-key patterns. No matches. Such a scan is not proof that all possible secrets are absent.
- No .local logs, .env files, voices, original design assets, node_modules or original repository history are included.

Remote clone verification is recorded by the maintainer outside the candidate to avoid changing the commit being checked. This document does not claim independent review, full Ellis acceptance, legal clearance or public publication. Proposed MIT licence/right-holder confirmation and the exact public visibility decision remain with Aly.
