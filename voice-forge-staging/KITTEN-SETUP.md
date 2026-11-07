# Kitten TTS local worker

This is the first viable local engine for Voice Forge: Kitten TTS 0.8.1, Apache-2.0, ONNX/CPU, no GPU required. Official references: [GitHub](https://github.com/KittenML/KittenTTS), [Hugging Face model](https://huggingface.co/KittenML/kitten-tts-nano-0.8-fp32), and [official demo](https://huggingface.co/spaces/KittenML/KittenTTS-Demo).

## Run

```bash
python3 -m venv .venv
. .venv/bin/activate
python -m pip install -r requirements-kitten.txt
python kitten_worker.py manuscript.txt audiobook-output --voice Jasper
```

The worker resumes existing part files, writes a manifest with SHA-256 hashes, and never uploads or deletes files. It currently accepts UTF-8 `.txt`; convert DOCX/PDF to reviewed text first. Do not treat output as a finished audiobook until coverage, playback, duration, ZIP integrity, and private backup are verified.

## Voices

`Bella`, `Jasper`, `Luna`, `Bruno`, `Rosie`, `Hugo`, `Kiki`, `Leo`.

## Commercial caution

The code repository is Apache-2.0, but review the model card and any voice/data terms before commercial release. Keep source manuscripts and unfinished audio private. This worker does not provide authentication, public upload, buyer delivery, or payment handling.
