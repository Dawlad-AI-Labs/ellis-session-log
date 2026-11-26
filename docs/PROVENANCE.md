# Source and custody

Extracted unchanged from `server/sessions.mjs` in the private Ellis repository at commit `8dca97cf195e838fd7a47cfefb51fb4ba464ec63`.

Source SHA-256: `23dc283aecda4ee2197655b6b8c4f64d4b900c152d15b0587b0bd5127f719d0d`.

The source file is tracked and clean in that checkout. Git records Aly Solamon as author of its source commit; this is provenance, not conclusive legal ownership evidence. The original repo and history remain private and unmodified. Only this one module was copied. README, tests and synthetic example were prepared for this release with AI assistance. No original logs, voices, environment files, UI/design assets or dependencies were copied.

The implementation derives its data path from its installed location, not the caller's working directory. In this layout it writes under `.local/voice-sessions/`. Copying the module elsewhere changes that path.
