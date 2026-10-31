/**
 * ARTISY Guide — owned website visitor guide widget.
 *
 * One self-contained file: vanilla JS + injected CSS, no dependencies.
 * Embed (go-live step, NOT yet done anywhere): one <script> tag before </body>
 * on index.html and store.html only. NEVER on JVZoo pages.
 *
 * All product names, prices, links, and flow wording come from the ARTISY
 * Visitor Guide Knowledge Pack v0.2 (~/workspace/site-guide/), with the
 * owner-directed AICC correction applied (AI Command Center course = $49.99).
 * Capture posts to the same Apps Script endpoint the site forms use, with
 * source "guide" (gift path) / "guide-message" (message path). Capture is an
 * invitation, never a gate: "Just browsing — chat with the guide" always
 * reaches free chat with no email. Free chat talks to /api/guide and fails
 * soft to the pack's closing line if the brain is unavailable.
 */
(function () {
  if (window.__artisyGuideLoaded) return;
  window.__artisyGuideLoaded = true;

  var SIGNUP_ENDPOINT =
    'https://script.google.com/macros/s/AKfycbxltPuQYbHPbvBj2UWFgojoHvVEKcJwKHJRkOUxN7YNVRX0JXRTs-ORTigTaVAA2g/exec';
  var GUIDE_API = 'https://artisy-guide-api-xi.vercel.app/api/guide';

  var WELCOME =
    "Hello, and welcome to ARTISY 🌿 I'm the store guide at Ting's nurse-designed wellness store.\n" +
    "Tell me what brought you by, and I'll walk you to the right shelf — or ask me anything about a book, an app, or the free gifts.\n" +
    'If you are ever in crisis, call or text 988 — real people, any hour. This chat is a store guide, not a counselor.';
  var CRISIS_LINE =
    'If you are ever in crisis, call or text 988 — real people, any hour. This chat is a store guide, not a counselor.';
  var CAPTURE_INVITE =
    "Before you go further — Ting gives 4 free gifts to every new friend of the store (the Healing Starter Pack). Leave your email and he'll send them over, with a personal note. No noise — a nurse's word.";
  var MESSAGE_INVITE =
    "Ting reads every message himself. Leave your name, your email, and a sentence or two, and I'll put it right in front of him.";
  var CLOSING = 'Thank you for stopping by ARTISY. Ting reads every message himself. 🌿';
  var GYC_BOUNDARY =
    'Golden Years Companion is not a medical device and not an emergency service. It does not detect falls and does not identify medication. In an emergency, call 911.';

  var BRANCHES = [
    {
      id: 'sleep',
      label: 'Trouble sleeping',
      intro: "Here's the sleep shelf — made by a nurse who has sat with people on their hardest nights:",
      products: [
        { name: 'Sleep Sanctuary', price: '$29.99', note: "A complete sleep system: sounds, stories, and a nurse's wind-down method.", url: 'https://tlott12.gumroad.com/l/hwkanb' },
        { name: 'Nap Time Adventures: Bedtime Stories, Lullabies & Sleep Sounds', price: '$14.99', note: 'Gentle bedtime audio for children and families.', url: 'https://tlott12.gumroad.com/l/whfezb' },
      ],
      free: 'Free first: a Sleep Audio Sample is the Music Hub signup gift — hear the style before buying anything.',
    },
    {
      id: 'calm',
      label: 'Calm & anxiety',
      intro: 'For the wired, racing days — gentle, practical help from a nurse:',
      products: [
        { name: 'Stress Less: Global Strategies for Calm', price: '$17.99', note: "A nurse's clinical framework for unwinding and resetting the nervous system. The store's best seller.", url: 'https://tlott12.gumroad.com/l/yjpkot' },
        { name: 'Finding Calm: Stories & Solutions', price: '$16.99', note: 'Practical anxiety-relief tools from a nurse who has seen people heal from the inside out.', url: 'https://tlott12.gumroad.com/l/mksucu' },
        { name: 'Calm in the Storm', price: '$4.99', note: 'A short, gentle book (PDF + audio) for the hardest days.', url: 'https://tlott12.gumroad.com/l/jdasb' },
        { name: 'Sacred Stillness — 365-Day Meditation & Devotional App', price: '$9.99', note: '365 daily devotionals, guided breathwork, focus timer, private journal; no account, no tracking.', url: 'https://tlott12.gumroad.com/l/bdbryz' },
      ],
      free: 'Free first: the Healing Starter Pack (4 free gifts) is waiting below.',
    },
    {
      id: 'faith',
      label: 'Faith & encouragement',
      intro: 'Faith, met plainly and warmly — the faith shelf:',
      products: [
        { name: 'Sacred Cycles: An 8-Week Mind–Body Reflection Bundle', price: '$27.99', note: 'An eight-week journey of guided reading, reflection, and gentle practice, rooted in faith.', url: 'https://tlott12.gumroad.com/l/oqlhbt' },
        { name: 'Sacred Cycles — audiobook edition', price: '$14.99', note: 'The same journey, to listen.', url: 'https://tlott12.gumroad.com/l/oyrihg' },
        { name: 'Sent From Home', price: '$9.99', note: 'A 17-chapter guide to identity and purpose; Scripture (KJV), honest research, prayer and reflection in every chapter.', url: 'https://whop.com/tlott12/sent-from-home-a-faith-rooted-guide-to-identity-purpose-and-home/' },
        { name: 'Inner Kingdom — Mindset Guide', price: '$6.99', note: 'Faith-rooted mindset tools for women ready to walk in their calling.', url: 'https://whop.com/tlott12/inner-kingdom-mindset-guide/' },
        { name: 'Refreshed for the Calling', price: '$9.99', note: 'For nurses and caregivers whose calling has worn them thin.', url: 'https://tlott12.gumroad.com/l/bhfqjz' },
      ],
      free: 'Free first: the Sacred Cycle Renewal Community is free to join — daily devotionals and people who understand.',
    },
    {
      id: 'kids',
      label: 'Kids & family',
      intro: 'Gentle stories and learning, from a nurse who taught elementary school for five years:',
      products: [
        { name: "Willow Tales — Kids' Reading Library", price: '$14.99', note: 'Gentle bedtime stories and a reading library for children, hosted by Elana and the Great Willow.', url: 'https://tlott12.gumroad.com/l/yxaar' },
        { name: "Lumen Academy: Lottie's Grammar World", price: '$14.99', note: 'A friendly grammar-learning app for kids.', url: 'https://tlott12.gumroad.com/l/vjickk' },
        { name: 'ParentWise Complete Package', price: '$37.00', note: 'A complete package for parents, from a nurse who taught elementary school before nursing.', url: 'https://tlott12.gumroad.com/l/parentwise-complete' },
        { name: 'Ultimate Cooking App', price: '$19.99', note: 'Family recipes and meal help.', url: 'https://tlott12.gumroad.com/l/fyjhmo' },
      ],
      more: [
        { name: 'Willow Tales Kids Activity Pack', price: '$4.99', url: 'https://tlott12.gumroad.com/l/zgkud' },
        { name: "Lottie's Bedtime Poems", price: '$4.99', url: 'https://tlott12.gumroad.com/l/hlxvls' },
      ],
      free: 'Free first: the Healing Starter Pack (4 free gifts) is waiting below.',
    },
    {
      id: 'care',
      label: 'Caring for a parent or loved one',
      intro: 'For families caring for Mom or Dad — calm tools, honest boundaries:',
      products: [
        { name: 'Golden Years Companion — Complete Edition', price: '$97.00', note: 'A calm home companion app a family sets up for Mom or Dad: medicine reminders, scheduled daily check-ins with family escalation, one-tap family video calling, and a doctor-visit launcher with a prep checklist. One-time price, no monthly fee.', url: 'https://tlott12.gumroad.com/l/wvgms' },
        { name: 'Refreshed for the Calling', price: '$9.99', note: 'For caregivers whose calling has worn them thin.', url: 'https://tlott12.gumroad.com/l/bhfqjz' },
      ],
      boundary: GYC_BOUNDARY,
      free: 'Not sure yet? Leave Ting a message below — he reads every one himself.',
    },
    {
      id: 'business',
      label: 'Business & nurse tools',
      intro: 'Tools built by a working nurse for businesses and nurses:',
      products: [
        { name: 'AI Command Center Course', price: '$49.99', note: 'Build a human + AI operating system for a small business — "AI assists, humans decide." Video Training Pack add-on $9.99.', url: 'https://shop.artistrystore.com/ai-command-center' },
        { name: 'Copilot Unlocked', price: '$29.99', note: 'Master Microsoft Copilot and AI tools with practical, real-world workflows.', url: 'https://tlott12.gumroad.com/l/pwfoi' },
        { name: 'RN Command Pro — Nurse Command Center', price: '$29.99', note: 'A command center built for nurses, by a nurse.', url: 'https://tlott12.gumroad.com/l/gtanuu' },
        { name: 'FinFlow Pro — Personal Finance Dashboard', price: '$29.99', note: '', url: 'https://tlott12.gumroad.com/l/finflow-pro' },
      ],
      more: [
        { name: 'Strong Days + Money Habits: The Complete Habit System', price: '$59.99', url: 'https://tlott12.gumroad.com/l/yiprcq' },
      ],
      free: 'Free first: the Healing Starter Pack (4 free gifts) is waiting below.',
    },
    {
      id: 'free',
      label: 'Something free to start',
      intro: "Free first is this store's way — start here, no purchase needed:",
      products: [
        { name: 'The Healing Starter Pack — 4 free gifts', price: 'Free', note: 'On the Free Gifts page, or leave your email below and Ting will send them.', url: 'https://shop.artistrystore.com/free.html' },
        { name: 'Sacred Cycle Renewal Community', price: 'Free', note: 'Free to join — daily devotionals and people who understand.', url: 'https://whop.com/tlott12/sacred-cycle-renewal-community/' },
        { name: 'Music Hub — free listening', price: 'Free', note: "Ting's own music as Tlott12 — free listening, no purchase needed.", url: 'https://shop.artistrystore.com/music_hub.html' },
      ],
      free: '',
    },
    {
      id: 'browse',
      label: 'Just browsing / ask a question',
      intro: 'Welcome in. The whole store, in one glance:',
      links: [
        { name: 'Store — all products, 69+', url: 'https://shop.artistrystore.com/store.html' },
        { name: 'Free Gifts page', url: 'https://shop.artistrystore.com/free.html' },
        { name: 'Music Hub — free listening', url: 'https://shop.artistrystore.com/music_hub.html' },
        { name: 'Comedy Nexus — 579 clean jokes', url: 'https://shop.artistrystore.com/comedy-nexus/' },
        { name: 'Kids & Family apps', url: 'https://shop.artistrystore.com/apps/kids-family.html' },
        { name: 'AI Command Center', url: 'https://shop.artistrystore.com/ai-command-center' },
      ],
      free: 'Or just ask me anything below — about a book, an app, or the free gifts.',
    },
    { id: 'message', label: 'Leave a message for Ting' },
  ];

  /* ---------------- styles ---------------- */
  var css = [
    '#ag-launcher{position:fixed;right:18px;bottom:18px;z-index:99990;background:#c9963e;color:#fff;border:none;border-radius:999px;padding:13px 20px;font-family:Inter,system-ui,sans-serif;font-size:15px;font-weight:600;cursor:pointer;box-shadow:0 6px 20px rgba(26,10,0,.35)}',
    '#ag-launcher:hover{background:#b5852f}',
    '#ag-panel{position:fixed;right:18px;bottom:18px;z-index:99991;width:min(384px,calc(100vw - 24px));height:min(620px,calc(100vh - 36px));background:#fdf8f0;border:1px solid #f5e6c8;border-radius:16px;box-shadow:0 14px 44px rgba(26,10,0,.4);display:none;flex-direction:column;overflow:hidden;font-family:Inter,system-ui,sans-serif;color:#3d2b1f}',
    '#ag-panel.ag-open{display:flex}',
    '#ag-head{background:#1a0a00;color:#fdf8f0;padding:13px 16px;display:flex;align-items:center;gap:10px}',
    '#ag-head .ag-title{font-family:"Playfair Display",Georgia,serif;font-size:18px;font-weight:700;flex:1}',
    '#ag-head .ag-sub{font-size:11px;opacity:.75;display:block;font-family:Inter,system-ui,sans-serif;font-weight:400}',
    '#ag-close{background:none;border:none;color:#fdf8f0;font-size:22px;cursor:pointer;line-height:1;padding:2px 6px}',
    '#ag-body{flex:1;overflow-y:auto;padding:14px 14px 8px}',
    '.ag-msg{background:#fff;border:1px solid #f5e6c8;border-radius:12px;padding:10px 12px;margin:0 0 10px;font-size:14px;line-height:1.5;white-space:pre-wrap;word-wrap:break-word}',
    '.ag-msg.ag-user{background:#f5e6c8;margin-left:34px}',
    '.ag-msg.ag-guide{margin-right:12px}',
    '.ag-msg a{color:#9f1239;font-weight:600}',
    '.ag-q{font-size:14px;font-weight:600;margin:12px 0 8px}',
    '.ag-branches{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:6px}',
    '.ag-branch{background:#fff;border:1.5px solid #c9963e;color:#3d2b1f;border-radius:999px;padding:7px 13px;font-size:13px;font-weight:600;cursor:pointer}',
    '.ag-branch:hover{background:#f5e6c8}',
    '.ag-card{background:#fff;border:1px solid #f5e6c8;border-left:4px solid #c9963e;border-radius:10px;padding:10px 12px;margin:0 0 8px}',
    '.ag-card .ag-pname{font-weight:700;font-size:14px}',
    '.ag-card .ag-pprice{color:#9f1239;font-weight:700;font-size:14px;float:right}',
    '.ag-card .ag-pnote{font-size:13px;line-height:1.45;margin-top:3px;color:#6b5c52}',
    '.ag-card a{display:inline-block;margin-top:6px;color:#9f1239;font-weight:600;font-size:13px;text-decoration:none}',
    '.ag-more{font-size:13px;margin:2px 0 10px;line-height:1.6}',
    '.ag-more a{color:#9f1239;font-weight:600;text-decoration:none}',
    '.ag-free{font-size:13px;background:#fff1f2;border-radius:8px;padding:8px 10px;margin:0 0 10px;line-height:1.45}',
    '.ag-boundary{font-size:12.5px;background:#fff;border:1px dashed #9f1239;border-radius:8px;padding:8px 10px;margin:0 0 10px;line-height:1.45}',
    '.ag-crisis{font-size:12px;color:#6b5c52;margin:10px 0 4px;line-height:1.45}',
    '.ag-actions{display:flex;flex-direction:column;gap:7px;margin:10px 0 6px}',
    '.ag-btn{background:#c9963e;color:#fff;border:none;border-radius:10px;padding:10px 14px;font-size:14px;font-weight:600;cursor:pointer;text-align:center}',
    '.ag-btn:hover{background:#b5852f}',
    '.ag-btn.ag-ghost{background:#fff;color:#3d2b1f;border:1.5px solid #c9963e}',
    '.ag-form{background:#fff;border:1px solid #f5e6c8;border-radius:10px;padding:12px;margin:0 0 10px}',
    '.ag-form label{display:block;font-size:12.5px;font-weight:600;margin:8px 0 3px}',
    '.ag-form input,.ag-form textarea{width:100%;box-sizing:border-box;border:1px solid #d8c9b4;border-radius:8px;padding:9px 10px;font-size:14px;font-family:inherit;background:#fdf8f0}',
    '.ag-form .ag-hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}',
    '.ag-note{font-size:12.5px;margin-top:8px;line-height:1.45}',
    '.ag-note.ag-err{color:#9f1239}',
    '.ag-note.ag-ok{color:#2e6b30}',
    '#ag-inputrow{display:none;border-top:1px solid #f5e6c8;padding:10px;background:#fff}',
    '#ag-inputrow.ag-show{display:flex;gap:8px}',
    '#ag-input{flex:1;border:1px solid #d8c9b4;border-radius:10px;padding:10px;font-size:14px;font-family:inherit}',
    '#ag-send{background:#c9963e;color:#fff;border:none;border-radius:10px;padding:10px 16px;font-size:14px;font-weight:600;cursor:pointer}',
    '.ag-thinking{font-size:13px;color:#6b5c52;font-style:italic;margin:0 0 10px}',
  ].join('\n');

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ---------------- dom ---------------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function linkInto(parent, text, url) {
    var a = document.createElement('a');
    a.textContent = text;
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
    parent.appendChild(a);
    return a;
  }
  // Render text with bare https:// URLs turned into real links (text nodes only).
  function richText(parent, text) {
    var parts = String(text).split(/(https:\/\/[^\s)]+)/g);
    parts.forEach(function (p) {
      if (/^https:\/\//.test(p)) linkInto(parent, p, p);
      else parent.appendChild(document.createTextNode(p));
    });
  }

  var launcher = el('button', null, '🌿 ARTISY Guide');
  launcher.id = 'ag-launcher';
  launcher.setAttribute('aria-haspopup', 'dialog');
  launcher.setAttribute('aria-expanded', 'false');

  var panel = el('div');
  panel.id = 'ag-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'ARTISY Guide');
  panel.tabIndex = -1;

  var head = el('div');
  head.id = 'ag-head';
  var titleWrap = el('div', 'ag-title');
  titleWrap.appendChild(document.createTextNode('ARTISY Guide'));
  var sub = el('span', 'ag-sub', "Ting's nurse-designed wellness store");
  titleWrap.appendChild(sub);
  var closeBtn = el('button', null, '×');
  closeBtn.id = 'ag-close';
  closeBtn.setAttribute('aria-label', 'Close the guide');
  head.appendChild(titleWrap);
  head.appendChild(closeBtn);

  var body = el('div');
  body.id = 'ag-body';

  var inputRow = el('div');
  inputRow.id = 'ag-inputrow';
  var input = el('input');
  input.id = 'ag-input';
  input.type = 'text';
  input.placeholder = 'Ask the guide anything…';
  input.setAttribute('aria-label', 'Ask the guide anything');
  var sendBtn = el('button', null, 'Send');
  sendBtn.id = 'ag-send';
  inputRow.appendChild(input);
  inputRow.appendChild(sendBtn);

  panel.appendChild(head);
  panel.appendChild(body);
  panel.appendChild(inputRow);
  document.body.appendChild(launcher);
  document.body.appendChild(panel);

  var history = [];
  var opened = false;
  var chatMode = false;

  function scrollDown() {
    body.scrollTop = body.scrollHeight;
  }
  function addMsg(text, who) {
    var m = el('div', 'ag-msg ' + (who === 'user' ? 'ag-user' : 'ag-guide'));
    richText(m, text);
    body.appendChild(m);
    scrollDown();
    return m;
  }
  function clearActions() {
    var olds = body.querySelectorAll('.ag-actions,.ag-form,.ag-branches,.ag-q');
    for (var i = 0; i < olds.length; i++) olds[i].remove();
  }

  function showBranches() {
    clearActions();
    body.appendChild(el('div', 'ag-q', 'What brought you by today?'));
    var wrap = el('div', 'ag-branches');
    BRANCHES.forEach(function (b) {
      var btn = el('button', 'ag-branch', b.label);
      btn.type = 'button';
      btn.addEventListener('click', function () {
        openBranch(b);
      });
      wrap.appendChild(btn);
    });
    body.appendChild(wrap);
    scrollDown();
  }

  function showCaptureActions(branch) {
    var actions = el('div', 'ag-actions');
    var giftBtn = el('button', 'ag-btn', '🎁 Send me the free gifts');
    giftBtn.type = 'button';
    giftBtn.addEventListener('click', function () {
      showGiftForm(branch);
    });
    var skipBtn = el('button', 'ag-btn ag-ghost', 'Just browsing — chat with the guide');
    skipBtn.type = 'button';
    skipBtn.addEventListener('click', startChat);
    var topicsBtn = el('button', 'ag-btn ag-ghost', '← All topics');
    topicsBtn.type = 'button';
    topicsBtn.addEventListener('click', showBranches);
    actions.appendChild(giftBtn);
    actions.appendChild(skipBtn);
    actions.appendChild(topicsBtn);
    body.appendChild(actions);
    scrollDown();
  }

  function openBranch(b) {
    clearActions();
    if (b.id === 'message') {
      showMessageForm();
      return;
    }
    addMsg(b.intro, 'guide');
    (b.products || []).forEach(function (p) {
      var card = el('div', 'ag-card');
      var price = el('span', 'ag-pprice', p.price);
      var name = el('span', 'ag-pname', p.name);
      card.appendChild(price);
      card.appendChild(name);
      if (p.note) card.appendChild(el('div', 'ag-pnote', p.note));
      linkInto(card, 'See it →', p.url);
      body.appendChild(card);
    });
    if (b.more && b.more.length) {
      var more = el('div', 'ag-more');
      more.appendChild(document.createTextNode('Also: '));
      b.more.forEach(function (p, i) {
        if (i) more.appendChild(document.createTextNode(' · '));
        linkInto(more, p.name + ' — ' + p.price, p.url);
      });
      body.appendChild(more);
    }
    if (b.links && b.links.length) {
      var list = el('div', 'ag-more');
      b.links.forEach(function (l) {
        linkInto(list, l.name, l.url);
        list.appendChild(document.createElement('br'));
      });
      body.appendChild(list);
    }
    if (b.boundary) body.appendChild(el('div', 'ag-boundary', b.boundary));
    if (b.free) body.appendChild(el('div', 'ag-free', b.free));
    body.appendChild(el('div', 'ag-crisis', CRISIS_LINE));
    if (b.id !== 'free') addMsg(CAPTURE_INVITE, 'guide');
    showCaptureActions(b);
    scrollDown();
  }

  function postSignup(payload, noteEl, onOk) {
    fetch(SIGNUP_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      redirect: 'follow',
      body: JSON.stringify(payload),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (!data || data.ok !== true) throw new Error('not confirmed');
        onOk();
      })
      .catch(function () {
        noteEl.textContent =
          "That didn't go through — please try again, or email Ting at tinglott@gmail.com.";
        noteEl.className = 'ag-note ag-err';
      });
  }

  function makeForm(fields) {
    var form = el('form', 'ag-form');
    form.noValidate = true;
    var inputs = {};
    fields.forEach(function (f) {
      var lab = el('label', null, f.label);
      lab.htmlFor = 'ag-f-' + f.key;
      form.appendChild(lab);
      var inp;
      if (f.textarea) {
        inp = el('textarea');
        inp.rows = 3;
      } else {
        inp = el('input');
        inp.type = f.type || 'text';
      }
      inp.id = 'ag-f-' + f.key;
      if (f.required) inp.required = true;
      form.appendChild(inp);
      inputs[f.key] = inp;
    });
    var hp = el('input', 'ag-hp');
    hp.type = 'text';
    hp.name = 'website';
    hp.tabIndex = -1;
    hp.autocomplete = 'off';
    form.appendChild(hp);
    inputs.website = hp;
    return { form: form, inputs: inputs };
  }

  function showGiftForm() {
    clearActions();
    addMsg(CAPTURE_INVITE, 'guide');
    var built = makeForm([
      { key: 'name', label: 'Your name (optional)' },
      { key: 'email', label: 'Your email', type: 'email', required: true },
    ]);
    var form = built.form;
    var submit = el('button', 'ag-btn', 'Send my free gifts');
    submit.type = 'submit';
    submit.style.marginTop = '10px';
    submit.style.width = '100%';
    var note = el('div', 'ag-note');
    form.appendChild(submit);
    form.appendChild(note);
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var email = built.inputs.email.value.trim();
      if (!email) {
        note.textContent = 'An email is needed so Ting can send the gifts.';
        note.className = 'ag-note ag-err';
        return;
      }
      note.textContent = 'Sending…';
      note.className = 'ag-note';
      postSignup(
        {
          name: built.inputs.name.value.trim(),
          email: email,
          source: 'guide',
          gift: 'healing-starter-pack',
          website: built.inputs.website.value,
        },
        note,
        function () {
          form.remove();
          var ok = el('div', 'ag-msg ag-guide');
          ok.appendChild(
            document.createTextNode(
              "✅ You're in! Ting will send your Healing Starter Pack with a personal note. You can also open them right now: "
            )
          );
          linkInto(ok, 'Free Gifts page', 'https://shop.artistrystore.com/free.html');
          body.appendChild(ok);
          var actions = el('div', 'ag-actions');
          var chatBtn = el('button', 'ag-btn', 'Chat with the guide');
          chatBtn.type = 'button';
          chatBtn.addEventListener('click', startChat);
          var topicsBtn = el('button', 'ag-btn ag-ghost', '← All topics');
          topicsBtn.type = 'button';
          topicsBtn.addEventListener('click', showBranches);
          actions.appendChild(chatBtn);
          actions.appendChild(topicsBtn);
          body.appendChild(actions);
          scrollDown();
        }
      );
    });
    body.appendChild(form);
    scrollDown();
  }

  function showMessageForm() {
    clearActions();
    addMsg(MESSAGE_INVITE, 'guide');
    var built = makeForm([
      { key: 'name', label: 'Your name', required: true },
      { key: 'email', label: 'Your email', type: 'email', required: true },
      { key: 'message', label: 'Your message for Ting', textarea: true, required: true },
    ]);
    var form = built.form;
    var submit = el('button', 'ag-btn', 'Send my message');
    submit.type = 'submit';
    submit.style.marginTop = '10px';
    submit.style.width = '100%';
    var note = el('div', 'ag-note');
    form.appendChild(submit);
    form.appendChild(note);
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = built.inputs.name.value.trim();
      var email = built.inputs.email.value.trim();
      var message = built.inputs.message.value.trim();
      if (!name || !email || !message) {
        note.textContent = 'Name, email, and a sentence or two are all Ting needs.';
        note.className = 'ag-note ag-err';
        return;
      }
      note.textContent = 'Sending…';
      note.className = 'ag-note';
      postSignup(
        {
          name: name,
          email: email,
          source: 'guide-message',
          gift: 'healing-starter-pack',
          message: message,
          website: built.inputs.website.value,
        },
        note,
        function () {
          form.remove();
          addMsg(
            "✅ Done — your message is in front of Ting now. He reads every message himself. " + CLOSING,
            'guide'
          );
          showCaptureActions(null);
        }
      );
    });
    body.appendChild(form);
    scrollDown();
  }

  function startChat() {
    clearActions();
    chatMode = true;
    inputRow.className = 'ag-show';
    inputRow.id = 'ag-inputrow';
    addMsg(
      'Ask me anything about a book, an app, or the free gifts — I answer from the store guide book, and anything I don\'t know, I\'ll offer to pass to Ting.',
      'guide'
    );
    input.focus();
  }

  function showFallback() {
    addMsg(
      CLOSING +
        " My answer book is resting just now — the shelves below always work, and the free gifts are a good place to start.",
      'guide'
    );
    var actions = el('div', 'ag-actions');
    var topicsBtn = el('button', 'ag-btn', 'See the shelves');
    topicsBtn.type = 'button';
    topicsBtn.addEventListener('click', function () {
      chatMode = false;
      inputRow.className = '';
      showBranches();
    });
    var giftBtn = el('button', 'ag-btn ag-ghost', 'Get the free gifts');
    giftBtn.type = 'button';
    giftBtn.addEventListener('click', showGiftForm);
    actions.appendChild(topicsBtn);
    actions.appendChild(giftBtn);
    body.appendChild(actions);
    scrollDown();
  }

  function sendChat() {
    var text = input.value.trim();
    if (!text) return;
    input.value = '';
    addMsg(text, 'user');
    var thinking = el('div', 'ag-thinking', 'The guide is looking that up…');
    body.appendChild(thinking);
    scrollDown();
    fetch(GUIDE_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: history.slice(-8) }),
    })
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        thinking.remove();
        if (!data || data.ok !== true || !data.reply) {
          showFallback();
          return;
        }
        addMsg(data.reply, 'guide');
        history.push({ role: 'user', content: text });
        history.push({ role: 'assistant', content: data.reply });
        if (history.length > 16) history = history.slice(-16);
      })
      .catch(function () {
        thinking.remove();
        showFallback();
      });
  }

  sendBtn.addEventListener('click', sendChat);
  input.addEventListener('keydown', function (ev) {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      sendChat();
    }
  });

  function openPanel() {
    panel.className = 'ag-open';
    panel.id = 'ag-panel';
    launcher.setAttribute('aria-expanded', 'true');
    launcher.style.display = 'none';
    if (!opened) {
      opened = true;
      addMsg(WELCOME, 'guide');
      showBranches();
    }
    panel.focus();
  }
  function closePanel() {
    panel.className = '';
    panel.id = 'ag-panel';
    launcher.setAttribute('aria-expanded', 'false');
    launcher.style.display = '';
    launcher.focus();
  }
  launcher.addEventListener('click', openPanel);
  closeBtn.addEventListener('click', closePanel);
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && panel.className === 'ag-open') closePanel();
  });
})();
