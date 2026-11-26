# Ellis session log

A dependency-free Node.js module that appends session events to JSONL, reads them back and derives a small session summary. Extracted from the Ellis oral-examiner prototype for engineers doing technical due diligence.

**Status:** private release candidate v0.1.0. This is a storage example, not the Ellis app or a validated educational intervention. No network, model account or paid API is needed.

## Inspect first

- [Implementation](src/sessions.mjs): append, list, read and attachment functions.
- [Tests](test/sessions.test.mjs): isolated storage, restart readback, validation and permissions.
- [Synthetic practice example](examples/synthetic-practice.mjs): four invented events.
- [Origin and limits](docs/PROVENANCE.md), [verification](docs/VERIFICATION.md), [release review](docs/RELEASE.md).

These relative links resolve within the checked-out release; at the release tag they point to that exact version. Proposed release: `v0.1.0`.

## Run

Prerequisite: Node.js 24 (verified on 24.18.1, macOS). No dependencies to install.

```sh
node --test --test-concurrency=1
node examples/synthetic-practice.mjs
```

On the first example run expect `lines: 4`, `turns: 2` and `ended: "synthetic example complete"`. It writes `.local/voice-sessions/synthetic-practice.jsonl`; inspect that file or rerun the example in another Node process. Rerunning appends another four events; it does not deduplicate. Each command exits on completion; there is no server to shut down. To reset only the synthetic example, delete its generated JSONL file. `.local/` is excluded from Git.

## Boundaries

The code is the primary evidence. This small reference has no authentication, encryption, retention controller, schema enforcement for event contents, concurrent-writer guarantees or retry deduplication. Session IDs and batch count are checked; record size is not bounded. It reads whole logs into memory. Malformed JSON lines become `unreadable` records. Attachment reads are buffered; audio storage is included in the extracted API, but tests use zero-filled synthetic bytes, not recorded voices. File permissions are best effort on Unix; existing directory permissions are not repaired.

Use synthetic data only. This module alone is unsuitable for exposing a service or holding real student/voice records. The source's comments describe its prototype usage; they are not evidence that every engine event is captured reliably. No browser, voice, learning-outcome or full Ellis acceptance claim is made.

## Licence, support and maintenance

The proposed MIT licence is in [LICENSE](LICENSE); adoption and rights confirmation remain part of Aly's exact-release approval. Public distribution of this candidate awaits that approval. No third-party packages or assets are included. See [provenance](docs/PROVENANCE.md).

Maintainer for this candidate: Dawlad / Noor. Open an issue for code or reproduction problems after release; never include personal data or secrets. Changes should include focused tests and a clear explanation. This is an experimental reference with no support SLA. Review on the first external reproduction report or source change; archive explicitly if maintenance stops.
