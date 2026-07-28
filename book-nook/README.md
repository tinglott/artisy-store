# ARTISY Book Nook

Reader-funnel MVP deployed as part of the existing ARTISY Netlify site.

## Included
- Public reader landing page and first catalog shelf
- Consent-based email signup through a Netlify function
- Supabase tables for subscribers, catalog, reader applications, moderated reviews, and append-only points
- Row-level security that prevents public subscriber/application reads and prevents members from awarding their own points
- UTM-ready Gumroad links
- TikTok/Pinterest faceless promotion playbook

## Next release gates
- Verify signup endpoint on the live Netlify deployment
- Add authenticated reader dashboard and moderator console
- Add private bonus storage and short-lived access links
- Connect the approved email welcome sequence
- Add each book only after its live product files and destination have been independently verified
- Prepare book-specific faceless assets; publishing remains separately authorized and verified

Reviews are never rewarded based on sentiment. Points have no cash value and are issued only after moderated participation.