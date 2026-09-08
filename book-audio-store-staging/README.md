# Sacred Cycles Books & Audio — isolated staging

This folder is an additive, non-production storefront surface for the planned conversion of the reserved trustedservices.io product area into books, audiobooks, and tested games. It does not modify or represent the live site.

## Research-backed delivery direction

1. Stripe Checkout creates the payment session.
2. A server-side webhook verifies the Stripe signature and handles `checkout.session.completed` / asynchronous success.
3. The fulfillment service maps the verified product ID to a private artifact and issues a short-lived, single-purpose download grant.
4. The protected artifact is stored privately (Google Drive or a private Hugging Face repository only after access/retention are verified); no public raw URL is used as paid delivery.
5. The buyer receives a signed download page, receipt, and re-access path. Download counts, expiration, refund/revocation, and support events are logged without storing payment secrets.

## Release gate — not ready until every item passes

- Canonical source, ownership/license record, and title match confirmed.
- MP3/PDF/ZIP decodes; SHA-256 recorded; no accidental previews.
- Private hosted copy retrieved and revalidated.
- Stripe test payment, webhook signature, duplicate-event handling, refund/revocation, and receipt tested.
- Download succeeds on Windows and Mac; re-access and expiry behave correctly.
- Live staging URL and buyer-facing terms/privacy/support links verified.
- Only then: explicit approval for production deployment and listing.

## Current known state

- *The Language of Blessing* has a locally verified 36/36 Andrew narration and assembled MP3/ZIP, but its temporary files are not yet durably stored in an approved private destination.
- Voice Forge is staging only; no credentials or paid files are included here.
- Checkout is deliberately disabled.

## References reviewed

- Stripe fulfillment: https://docs.stripe.com/checkout/fulfillment
- Stripe webhooks: https://docs.stripe.com/webhooks
- Hugging Face security tokens: https://huggingface.co/docs/hub/en/security-tokens
- Hugging Face Hub quickstart: https://huggingface.co/docs/huggingface_hub/en/quick-start
- Google Cloud signed URLs (for a future storage option): https://cloud.google.com/storage/docs/access-control/signed-urls
