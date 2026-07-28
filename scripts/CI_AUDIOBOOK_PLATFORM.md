# GitHub audiobook build platform

## What this resolves

GitHub-hosted runners are used for a dependency/self-test only. Private manuscripts and production audio stay on a protected runner, so the repository never needs to contain them. Each production track remains checkpointed in the protected output directory.

## Safe modes

- **CI self-test:** runs on a normal GitHub-hosted runner and proves that the renderer, `ffmpeg`, and the Edge fallback can create and validate audio.
- **Protected production:** runs only when a self-hosted runner labeled `audiobook-protected` is configured with the private manuscript adapter and protected output storage. It never uploads manuscripts or audio artifacts to GitHub.

Kokoro and Piper are optional local providers. The default GitHub test intentionally uses the lightweight Edge fallback; this avoids the failed PyTorch/Pip storage installation that blocked Kokoro on the small build environment. On a larger protected runner, set `--providers kokoro,edge,piper` and configure the model as documented in the renderer README.

## Run

Open **Actions → Audiobook Renderer → Run workflow**. The default `ci-self-test` is safe and requires no private files. Do not select `protected-production` until a protected runner has been configured.

The production job writes to `AUDIOBOOK_HYBRID_ROOT` on the protected runner and resumes from its existing `HYBRID_MANIFEST.json`.
