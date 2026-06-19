/* =====================================================
   ARTISY Lead Capture Widget v1.1
   Conversational opt-in form — no API keys in client code.
   Backend processing happens via Tasklet webhook.
   ===================================================== */

(function () {
  const WEBHOOK_URL = 'PASTE_YOUR_TASKLET_WEBHOOK_URL_HERE';

  // Conversation flow — step by step questions
  const STEPS = [
    { key: null,      bot: "Hi! 💛 I'm Aria — Ting's wellness guide. Quick question before you shop..." },
    { key: 'interest', bot: "What brings you here today?", type: 'choice', choices: ['Wellness & Mindset', 'Sacred Cycles', 'Digital Products', 'Just exploring 👀'] },
    { key: 'name',    bot: "Love that! What's your first name?", type: 'text', placeholder: 'Your first name...' },
    { key: 'email',   bot: "Nice to meet you, {name}! Drop your email and I'll have Ting send you something special 🎁", type: 'email', placeholder: 'Your best email...' },
    { key: null,      bot: "You're all set, {name}! 💛 Check your inbox soon — Ting will be in touch personally.", type: 'done' }
  ];

  let currentStep = 0;
  let leadData = {};

  const style = document.createElement('style');
  style.textContent = `
    #artisy-chat-btn {
      position:fixed;bottom:24px;right:24px;z-index:9999;
      width:60px;height:60px;border-radius:50%;
      background:linear-gradient(135deg,#1a2744,#c9a84c);
      border:none;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,.3);
      display:flex;align-items:center;justify-content:center;
      transition:transform .2s;
    }
    #artisy-chat-btn:hover{transform:scale(1.1);}
    #artisy-chat-btn svg{width:28px;height:28px;fill:white;}
    #artisy-chat-bubble {
      position:fixed;bottom:96px;right:24px;z-index:9999;
      width:330px;background:#fff;border-radius:16px;
      box-shadow:0 8px 32px rgba(0,0,0,.18);
      display:none;flex-direction:column;overflow:hidden;
      font-family:'Inter',sans-serif;font-size:14px;
    }
    #artisy-chat-bubble.open{display:flex;}
    #artisy-chat-header{
      background:linear-gradient(135deg,#1a2744,#243459);
      color:white;padding:14px 16px;
      display:flex;align-items:center;gap:10px;
    }
    .ac-avatar{
      width:36px;height:36px;border-radius:50%;
      background:linear-gradient(135deg,#c9a84c,#e8d48a);
      display:flex;align-items:center;justify-content:center;
      font-size:15px;font-weight:700;color:#1a2744;flex-shrink:0;
    }
    .ac-info{flex:1;}
    .ac-name{font-weight:600;font-size:14px;}
    .ac-status{font-size:11px;opacity:.8;}
    #artisy-chat-close{background:none;border:none;color:white;cursor:pointer;font-size:22px;line-height:1;padding:0;}
    #artisy-chat-body{padding:16px;display:flex;flex-direction:column;gap:12px;min-height:120px;}
    .ac-bot-msg{
      background:#f0f2f8;color:#1a2744;
      padding:10px 13px;border-radius:12px 12px 12px 3px;
      line-height:1.5;
    }
    .ac-choices{display:flex;flex-direction:column;gap:6px;margin-top:4px;}
    .ac-choice{
      background:#fff;border:1.5px solid #c9a84c;color:#1a2744;
      padding:8px 12px;border-radius:20px;cursor:pointer;
      text-align:left;font-size:13px;transition:all .15s;
    }
    .ac-choice:hover{background:#c9a84c;color:#fff;}
    .ac-input-row{display:flex;gap:8px;margin-top:4px;}
    .ac-input{
      flex:1;border:1.5px solid #ddd;border-radius:20px;
      padding:9px 14px;font-size:13px;outline:none;font-family:inherit;
    }
    .ac-input:focus{border-color:#1a2744;}
    .ac-send{
      width:38px;height:38px;border-radius:50%;
      background:#c9a84c;border:none;cursor:pointer;
      display:flex;align-items:center;justify-content:center;flex-shrink:0;
      transition:background .15s;
    }
    .ac-send:hover{background:#b8943e;}
    .ac-send svg{width:15px;height:15px;fill:white;}
    .ac-done{text-align:center;padding:8px 4px;color:#1a2744;line-height:1.6;}
    .ac-done .ac-heart{font-size:36px;margin-bottom:6px;}
    @media(max-width:400px){
      #artisy-chat-bubble{width:calc(100vw - 32px);right:16px;}
    }
  `;
  document.head.appendChild(style);

  // Bubble button
  const btn = document.createElement('button');
  btn.id = 'artisy-chat-btn';
  btn.setAttribute('aria-label', 'Chat with Aria');
  btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>`;
  document.body.appendChild(btn);

  // Chat bubble
  const bubble = document.createElement('div');
  bubble.id = 'artisy-chat-bubble';
  bubble.innerHTML = `
    <div id="artisy-chat-header">
      <div class="ac-avatar">A</div>
      <div class="ac-info">
        <div class="ac-name">Aria · ARTISY Guide</div>
        <div class="ac-status">✨ Here to help</div>
      </div>
      <button id="artisy-chat-close">×</button>
    </div>
    <div id="artisy-chat-body"></div>
  `;
  document.body.appendChild(bubble);

  const body = document.getElementById('artisy-chat-body');
  btn.addEventListener('click', () => {
    bubble.classList.toggle('open');
    if (bubble.classList.contains('open') && currentStep === 0) renderStep();
  });
  document.getElementById('artisy-chat-close').addEventListener('click', () => bubble.classList.remove('open'));

  function fillTemplate(str) {
    return str.replace('{name}', leadData.name || 'you');
  }

  function renderStep() {
    const step = STEPS[currentStep];
    body.innerHTML = '';

    // Bot message
    const msg = document.createElement('div');
    msg.className = 'ac-bot-msg';
    msg.textContent = fillTemplate(step.bot);
    body.appendChild(msg);

    if (step.type === 'choice') {
      const choices = document.createElement('div');
      choices.className = 'ac-choices';
      step.choices.forEach(c => {
        const btn = document.createElement('button');
        btn.className = 'ac-choice';
        btn.textContent = c;
        btn.addEventListener('click', () => advance(step.key, c));
        choices.appendChild(btn);
      });
      body.appendChild(choices);

    } else if (step.type === 'text' || step.type === 'email') {
      const row = document.createElement('div');
      row.className = 'ac-input-row';
      const input = document.createElement('input');
      input.className = 'ac-input';
      input.type = step.type === 'email' ? 'email' : 'text';
      input.placeholder = step.placeholder || '';
      const sendBtn = document.createElement('button');
      sendBtn.className = 'ac-send';
      sendBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>`;
      const go = () => {
        const val = input.value.trim();
        if (!val) { input.style.borderColor='#e74c3c'; return; }
        if (step.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          input.style.borderColor='#e74c3c';
          input.placeholder = 'Please enter a valid email';
          return;
        }
        advance(step.key, val);
      };
      sendBtn.addEventListener('click', go);
      input.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
      row.appendChild(input);
      row.appendChild(sendBtn);
      body.appendChild(row);
      setTimeout(() => input.focus(), 100);

    } else if (step.type === 'done') {
      const done = document.createElement('div');
      done.className = 'ac-done';
      done.innerHTML = `<div class="ac-heart">💛</div><strong>${fillTemplate(step.bot)}</strong>`;
      body.appendChild(done);
    }
  }

  function advance(key, value) {
    if (key) leadData[key] = value;
    currentStep++;
    if (currentStep >= STEPS.length) return;

    // Submit after email is collected
    if (key === 'email') submitLead();

    renderStep();
  }

  function submitLead() {
    if (!WEBHOOK_URL || WEBHOOK_URL.includes('PASTE_YOUR')) return;
    const payload = JSON.stringify({
      name: leadData.name || '',
      email: leadData.email || '',
      interest: leadData.interest || '',
      message: `Opted in via ARTISY widget on ${window.location.pathname}`,
      source: window.location.href
    });
    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      mode: 'no-cors'
    }).catch(() => {});
  }
})();
