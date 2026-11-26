# Pre-release verification · 26 November 2026

Operator: Noor (self-check, not independent release review). Environment: macOS, Node.js 24.18.1. No packages installed, API calls, real records or audio used.

- Source module bytes match the committed Ellis server/sessions.mjs at the provenance commit.
- Fresh local clone: the node:test scenario passed; append/read, summary, separate-process persistence, invalid ID, oversized batch, synthetic attachment size checks and Unix file mode were exercised.
- First synthetic example: 4 stored events, 2 turns, expected end reason.
- Second process running the same example: 8 stored events, 4 turns, demonstrating append persistence, not retry deduplication.
- Included files were reviewed as text and checked for common private-key, GitHub-token, provider-key and AWS-key patterns. No matches. Such a scan is not proof that all possible secrets are absent.
- No .local logs, .env files, voices, original design assets, node_modules or original repository history are included.

Remote clone verification is recorded by the maintainer outside the candidate to avoid changing the commit being checked. This document does not claim independent review, full Ellis acceptance, legal clearance or public publication. The MIT licence and public release were later decided by Aly Solamon; see RELEASE.md.

## Release-day recheck · 26 November 2026

Operator: Noor. Fresh clone of the private repository at 9b56da43: test passed (1/1) and the synthetic example returned 4 lines, 2 turns and the expected end reason. Every file was read in full for personal data, secrets and copied assets; none found. Only README, RELEASE and this file changed for release; the module and tests are byte-identical to the candidate. An independent model-based check was used as an instrument; Dawlad has not yet appointed a named independent Release Reviewer, so this first release proceeds on Aly's direct approval and that gap is recorded here.
