# Voice Forge staging

This is an isolated, draft-only browser surface for manuscript intake and audiobook job planning. It deliberately does **not** claim to generate audio. No files leave the browser session, and there are no credentials, uploads, payments, analytics, or external runtime dependencies.

## Release gates before real narration

- Confirm the canonical manuscript and ownership/license record.
- Confirm no duplicate narration process is active.
- Use private storage and server-side job authorization.
- Resume from a verified checkpoint; never restart a partial job blindly.
- Verify full coverage, playability, duration, ZIP integrity, and private backup.
- Keep previews distinct from completed audiobooks.

The current *The Language of Blessing* job remains storage-blocked at 15 of 36 parts until writable private staging space is verified.