#!/usr/bin/env python3
"""Build /etsy-shop/ index.html from catalog.json (Nov 17, 2026).

Reuses the homepage's <style> block and nav so the page matches the
site. Groups are derived from titles (Digital first, then Dress,
Pajama, Sweatshirt, Mug, Poster/Print, T-Shirt default). Cards link
out to the Etsy listings; prices are as checked Nov 17, 2026, with
the live price always on Etsy.
"""
import json
import re
from html import escape

ROOT = "/home/hatch/workspace/artisy-store-live"
CAT = json.load(open(f"{ROOT}/etsy-shop/catalog.json"))
TOTAL = len(CAT)
INDEX = open(f"{ROOT}/index.html", encoding="utf-8").read()

STYLE = re.search(r"<style>.*?</style>", INDEX, re.S).group(0)
PIXEL = re.search(r"<!-- Meta Pixel Code -->.*?<!-- End Meta Pixel Code -->", INDEX, re.S)
PIXEL = PIXEL.group(0) if PIXEL else ""

GROUPS = [
    ("Digital Downloads", lambda t: "digital download" in t.lower() or "pdf" in t.lower() or t.startswith("Skin Longevity Coach App")),
    ("Christmas", lambda t: "christmas" in t.lower()),
    ("Dresses", lambda t: "dress" in t.lower()),
    ("Pajamas", lambda t: "pajama" in t.lower()),
    ("Sweatshirts", lambda t: "sweatshirt" in t.lower()),
    ("Mugs", lambda t: "mug" in t.lower()),
    ("Posters & Prints", lambda t: "poster" in t.lower() or "print" in t.lower()),
    ("T-Shirts", lambda t: True),
]

def group_of(title):
    for name, fn in GROUPS:
        if fn(title):
            return name
    return "T-Shirts"

grouped = {name: [] for name, _ in GROUPS}
for item in CAT:
    grouped[group_of(item["title"])].append(item)

NAV = """<nav>
  <div class="nav-logo"><a href="/" style="color:inherit;text-decoration:none;">ARTISY<span>.</span></a></div>
  <div class="nav-links">
    <a href="/creator-hub.html">Creator Hub</a>
    <a href="/#free">🎁 Free Gifts</a>
    <a href="/#podcast">🎙️ Podcast</a>
    <a href="/#christmas-youtube">🎄 Christmas</a>
    <a href="/#products">Products</a>
    <a href="/etsy-shop/" style="font-weight:900;color:var(--rose);">🛍️ Etsy Shop</a>
    <a href="/book-nook/">📚 Book Nook</a>
    <a href="/magazine/">📰 Magazine</a>
    <a href="/art-gallery/">🎨 Art Gallery</a>
    <a href="/music_hub.html">🎵 Music Hub</a>
    <a href="/listening-room/">🎧 Listening Room</a>
    <a href="https://shop.artistrystore.com/store.html">Full Store</a>
    <a href="/contact.html">Questions?</a>
  </div>
  <div style="display:flex;gap:0.6rem;align-items:center;flex-wrap:wrap;">
    <a href="https://shop.artistrystore.com/store.html" class="nav-cta">Shop Now</a>
    <a href="https://www.etsy.com/shop/ArtistrydGifts" target="_blank" rel="noopener" class="nav-cta" style="background:linear-gradient(135deg,#F1641E,#d35400);">🛍️ Etsy Shop</a>
  </div>
</nav>"""

def card(item):
    title = escape(item["title"])
    price = f"${item['price']:.2f}"
    return (
        f'<a href="{escape(item["url"])}" target="_blank" rel="noopener" class="prod-card" data-group="{group_of(item["title"])}">'
        f'<img src="{escape(item["img"])}" alt="{title}" loading="lazy" style="width:100%;height:220px;object-fit:cover;display:block;">'
        f'<div style="padding:1rem 1.2rem 1.2rem;"><div class="prod-name" title="{title}">{title}</div>'
        f'<div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.6rem;">'
        f'<span class="prod-price">{price}</span>'
        f'<span style="font-weight:700;color:var(--rose);font-size:0.9rem;">Shop on Etsy &rarr;</span></div></div></a>'
    )

sections = []
for name, _ in GROUPS:
    items = grouped[name]
    if not items:
        continue
    cards = "\n    ".join(card(i) for i in items)
    sections.append(
        f'<h2 style="margin:2.5rem 0 0.5rem;" data-group-head="{name}">{name} <span style="font-size:1rem;color:#888;">({len(items)})</span></h2>'
        f'\n  <div class="products-grid" data-group-grid="{name}">\n    {cards}\n  </div>'
    )

buttons = "".join(
    f'<button class="filter-btn" data-filter="{name}" style="padding:0.6rem 1.2rem;border-radius:999px;border:1px solid #e8d5c4;background:#fff;cursor:pointer;font-weight:700;">{name} ({len(grouped[name])})</button>'
    for name, _ in GROUPS if grouped[name]
)
buttons = (
    f'<button class="filter-btn active" data-filter="All" style="padding:0.6rem 1.2rem;border-radius:999px;border:1px solid var(--rose);background:var(--rose);color:#fff;cursor:pointer;font-weight:700;">All ({TOTAL})</button>'
    + buttons
)

html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Shop on Etsy — {TOTAL} Tees, Posters, Mugs &amp; More | ARTISY by T. Lott Creative</title>
<meta name="description" content="Browse the full ARTISY Etsy shop — {TOTAL} original designs: tees, dresses, pajamas, sweatshirts, posters and mugs. Every order includes a free book + audiobook package.">
<link rel="canonical" href="https://shop.artistrystore.com/etsy-shop/">
{PIXEL}
{STYLE}
<style>
  .prod-name {{ display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; min-height:2.6em; }}
  .filter-btn.active {{ background:var(--rose) !important; color:#fff !important; border-color:var(--rose) !important; }}
  .prod-card.hidden {{ display:none; }}
  h2[data-group-head].hidden {{ display:none; }}
  .products-grid.hidden {{ display:none; }}
  #search {{ width:100%; max-width:520px; padding:0.9rem 1.2rem; border-radius:999px; border:1px solid #e8d5c4; font-size:1rem; }}
</style>
</head>
<body>
{NAV}
<div style="background:#fff;border-bottom:1px solid #e8d9c4;padding:0.6rem 1rem;display:flex;justify-content:center;gap:0.6rem;flex-wrap:wrap;align-items:center;"><span style="font-size:0.85rem;color:#6b5c52;font-weight:600;">Shop:</span><a href="/" style="padding:0.5rem 1.2rem;border-radius:999px;background:#fff;color:#9f1239;border:1.5px solid #9f1239;font-weight:700;font-size:0.9rem;text-decoration:none;">🏠 Home</a><span style="padding:0.5rem 1.2rem;border-radius:999px;background:#9f1239;color:#fff;font-weight:700;font-size:0.9rem;">🛍️ Etsy Shop</span><a href="/store.html" style="padding:0.5rem 1.2rem;border-radius:999px;background:#fff;color:#9f1239;border:1.5px solid #9f1239;font-weight:700;font-size:0.9rem;text-decoration:none;">Full Store</a></div>
<main style="max-width:1200px;margin:0 auto;padding:2rem 1.2rem 4rem;">
  <p style="text-align:center;color:var(--rose);font-weight:800;letter-spacing:0.12em;text-transform:uppercase;font-size:0.85rem;">ARTISY by T. Lott Creative &middot; on Etsy</p>
  <h1 style="text-align:center;">Shop the Full Etsy Store</h1>
  <p style="text-align:center;max-width:640px;margin:0.8rem auto 0;">{TOTAL} original designs — tees, dresses, pajamas, sweatshirts, posters and mugs, drawn with love and printed just for you when you order. <strong>Every order includes a free book + audiobook package</strong> — pick yours in the checkout dropdown on Etsy.</p>
  <p style="text-align:center;color:#888;font-size:0.9rem;margin-top:0.5rem;">Prices as checked November 17, 2026 — the live price is always on Etsy. Checkout happens on Etsy.</p>
  <div style="display:flex;justify-content:center;margin:1.8rem 0 1rem;"><input id="search" type="search" placeholder="Search {TOTAL} designs — try &quot;caregiver&quot;, &quot;birthday&quot;, &quot;phoenix&quot;&hellip;" aria-label="Search designs"></div>
  <div style="display:flex;flex-wrap:wrap;gap:0.6rem;justify-content:center;" id="filters">{buttons}</div>
  <p id="count" style="text-align:center;color:#888;margin-top:1rem;">Showing all {TOTAL} designs</p>
  {"\n  ".join(sections)}
  <p style="text-align:center;margin-top:3rem;">Looking for something else? <a href="https://shop.artistrystore.com/store.html">Browse the full ARTISY store</a> or <a href="/contact.html">ask Ting a question</a>.</p>
</main>
<footer style="background:var(--dark);color:#fff;text-align:center;padding:2rem 1rem;">
  <p>ARTISY by T. Lott Creative — Art that comforts, uplifts &amp; inspires.</p>
  <p style="margin-top:0.5rem;"><a href="/" style="color:#fff;">Home</a> &middot; <a href="https://www.etsy.com/shop/ArtistrydGifts" target="_blank" rel="noopener" style="color:#fff;">Etsy Shop</a> &middot; <a href="/contact.html" style="color:#fff;">Contact</a></p>
</footer>
<script>
(function(){{
  var search = document.getElementById('search');
  var count = document.getElementById('count');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.prod-card'));
  var filter = 'All';
  function apply(){{
    var q = search.value.trim().toLowerCase();
    var shown = 0;
    cards.forEach(function(c){{
      var ok = (filter === 'All' || c.getAttribute('data-group') === filter) &&
               (!q || c.textContent.toLowerCase().indexOf(q) !== -1);
      c.classList.toggle('hidden', !ok);
      if (ok) shown++;
    }});
    document.querySelectorAll('[data-group-head]').forEach(function(h){{
      var g = h.getAttribute('data-group-head');
      var any = cards.some(function(c){{
        return c.getAttribute('data-group') === g && !c.classList.contains('hidden');
      }});
      h.classList.toggle('hidden', !any);
      var grid = document.querySelector('[data-group-grid="' + g + '"]');
      if (grid) grid.classList.toggle('hidden', !any);
    }});
    count.textContent = shown === {TOTAL} ? 'Showing all {TOTAL} designs' : 'Showing ' + shown + ' of {TOTAL} designs';
  }}
  search.addEventListener('input', apply);
  document.getElementById('filters').addEventListener('click', function(e){{
    var b = e.target.closest('.filter-btn');
    if (!b) return;
    filter = b.getAttribute('data-filter');
    document.querySelectorAll('.filter-btn').forEach(function(x){{ x.classList.remove('active'); }});
    b.classList.add('active');
    apply();
  }});
}})();
</script>
</body>
</html>
"""

out = f"{ROOT}/etsy-shop/index.html"
open(out, "w", encoding="utf-8").write(html)
print("wrote", out, len(html), "bytes")
print("groups:", {k: len(v) for k, v in grouped.items() if v})
print("total cards:", sum(len(v) for v in grouped.values()))
