# Checkpointed Hybrid Audiobook Renderer

This renderer is designed for local, protected audiobook production. It does not upload manuscripts, credentials, or finished audio to GitHub.

## Provider failover

Default order:

1. Kokoro, when installed locally
2. Edge TTS, when available
3. Piper, when a local model is configured

The diagnostic eSpeak provider is intentionally excluded from the default order because its voice quality is not audiobook-grade.

Each chunk is retried, validated with `ffprobe`, hashed, and checkpointed. Existing valid chunks and tracks are skipped so interrupted production resumes rather than restarting.

## Local requirements

- Python 3.10+
- `ffmpeg`/`ffprobe`
- one or more locally configured TTS providers
- the protected manuscript adapter used by the production environment

The production adapter and manuscripts remain outside the public repository by design. Configure `AUDIOBOOK_HYBRID_ROOT` to a protected local output directory.

## Example

```bash
python3 scripts/hybrid_audiobook_renderer.py Stop_Think_Rise --self-test
python3 scripts/hybrid_audiobook_renderer.py Stop_Think_Rise --max-tracks 1
```

A successful run writes `HYBRID_MANIFEST.json` with provider, duration, size, and SHA-256 evidence.
