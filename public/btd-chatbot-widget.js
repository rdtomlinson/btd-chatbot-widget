(function() {
  if (document.getElementById('btd-chat-widget')) return;

  const SYSTEM_PROMPT = `You are a warm, knowledgeable guest services assistant for Black Tie Dinner — a premier annual fundraising gala in Dallas, Texas that raises funds for LGBTQ+ supportive organizations. This is the 45th annual event, themed "Renaissance."

Your tone: warm, elegant, confident, and slightly concise. You represent a premier event — not a casual gathering. Be friendly but polished. Never use hashtags. Never say "make a difference" or "change lives."

IMPORTANT RULES:
- Only answer questions about this event: tickets, logistics, sponsorships, parking, dress code, table selection, and general event info.
- If you don't know something or the info hasn't been provided, say something like: "I don't have that detail on hand — please reach out to our team directly at [CONTACT_EMAIL_PLACEHOLDER] and they'll be happy to help."
- Never make up specific details. Use the info below and only this info.
- Keep responses under 120 words unless more detail is genuinely needed.
- Do not use em dashes excessively.

EVENT INFORMATION:
- Event name: Black Tie Dinner (always written in full)
- Theme: Renaissance
- Year: 45th Annual
- Date: [EVENT_DATE_PLACEHOLDER]
- Venue: [VENUE_NAME_PLACEHOLDER], [VENUE_ADDRESS_PLACEHOLDER], Dallas, TX
- Cocktail hour: [COCKTAIL_HOUR_TIME_PLACEHOLDER]
- Dinner & program begin: [DINNER_TIME_PLACEHOLDER]
- Attire: Black tie formal (gowns, tuxedos, black tie creative welcome)
- Parking: [PARKING_INFO_PLACEHOLDER]
- Accessibility: [ACCESSIBILITY_INFO_PLACEHOLDER]

TICKETS:
- Ticket sales URL: [TICKET_URL_PLACEHOLDER]
- Individual ticket price: $[INDIVIDUAL_PRICE_PLACEHOLDER]
- Table of 10 price: $[TABLE_PRICE_PLACEHOLDER]
- VIP / premium experiences: [VIP_OPTIONS_PLACEHOLDER]
- Payment methods: [PAYMENT_METHODS_PLACEHOLDER]
- Ticket support: [TICKET_SUPPORT_EMAIL_PLACEHOLDER]

SPONSORSHIPS:
- Sponsorship inquiries: [SPONSORSHIP_CONTACT_PLACEHOLDER]
- Sponsorship levels: [SPONSORSHIP_LEVELS_PLACEHOLDER]
- Sponsor benefits: [SPONSOR_BENEFITS_PLACEHOLDER]

CONTACT:
- General inquiries: [CONTACT_EMAIL_PLACEHOLDER]
- Website: blacktie.org`;

  const FONTS = document.createElement('link');
  FONTS.rel = 'stylesheet';
  FONTS.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&family=Cinzel:wght@400;500&family=Big+Shoulders+Display:wght@300&display=swap';
  document.head.appendChild(FONTS);

  const STYLES = `
    #btd-chat-widget * { box-sizing: border-box; margin: 0; padding: 0; font-family: inherit; }
    #btd-chat-widget {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      font-family: 'Cormorant Garamond', Georgia, serif;
    }
    #btd-fab {
      width: 58px; height: 58px;
      border-radius: 50%;
      background: #9B3A2A;
      border: 0.5px solid rgba(201,151,58,0.5);
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.35);
      transition: transform 0.2s, background 0.2s;
      position: relative;
    }
    #btd-fab:hover { transform: scale(1.06); background: #B8503E; }
    #btd-fab svg { width: 22px; height: 22px; fill: #F5EFE0; transition: opacity 0.2s; }
    #btd-fab .btd-close-icon { display: none; }
    #btd-fab.open .btd-chat-icon { display: none; }
    #btd-fab.open .btd-close-icon { display: block; }
    #btd-fab-label {
      position: absolute;
      right: 68px;
      top: 50%;
      transform: translateY(-50%);
      background: #1A1714;
      color: #F5EFE0;
      font-family: 'Big Shoulders Display', sans-serif;
      font-size: 11px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 6px 12px;
      border-radius: 6px;
      border: 0.5px solid rgba(201,151,58,0.3);
      white-space: nowrap;
      pointer-events: none;
      opacity: 1;
      transition: opacity 0.3s;
      font-weight: 300;
    }
    #btd-fab-label.hidden { opacity: 0; }
    #btd-panel {
      position: absolute;
      bottom: 70px;
      right: 0;
      width: 370px;
      height: 540px;
      background: #1A1714;
      border: 0.5px solid rgba(201,151,58,0.25);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 8px 40px rgba(0,0,0,0.5);
      transform: scale(0.92) translateY(12px);
      transform-origin: bottom right;
      opacity: 0;
      pointer-events: none;
      transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease;
    }
    #btd-panel.open {
      transform: scale(1) translateY(0);
      opacity: 1;
      pointer-events: all;
    }
    #btd-panel-header {
      padding: 14px 16px 12px;
      text-align: center;
      border-bottom: 0.5px solid rgba(201,151,58,0.18);
      background: rgba(46,41,38,0.8);
      flex-shrink: 0;
    }
    .btd-ornament {
      display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 6px;
    }
    .btd-line { height: 0.5px; width: 36px; }
    .btd-line-l { background: linear-gradient(90deg, transparent, #C9973A); }
    .btd-line-r { background: linear-gradient(90deg, #C9973A, transparent); }
    .btd-diamond { width: 4px; height: 4px; background: #C9973A; transform: rotate(45deg); flex-shrink: 0; }
    #btd-panel-header h2 {
      font-family: 'Cinzel', serif;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 0.1em;
      color: #F5EFE0;
    }
    #btd-panel-header p {
      font-family: 'Cormorant Garamond', serif;
      font-size: 12px;
      font-style: italic;
      color: #C9973A;
      letter-spacing: 0.08em;
      margin-top: 1px;
    }
    #btd-messages {
      flex: 1;
      overflow-y: auto;
      padding: 14px 14px 8px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scroll-behavior: smooth;
    }
    #btd-messages::-webkit-scrollbar { width: 2px; }
    #btd-messages::-webkit-scrollbar-thumb { background: rgba(201,151,58,0.3); border-radius: 2px; }
    .btd-msg { display: flex; gap: 8px; align-items: flex-end; animation: btdFadeUp 0.22s ease; }
    .btd-msg.user { flex-direction: row-reverse; }
    @keyframes btdFadeUp { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
    .btd-av {
      width: 24px; height: 24px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Cinzel', serif; font-size: 7px; letter-spacing: 0.04em;
      flex-shrink: 0;
    }
    .btd-av.bot { background: #C9973A; color: #1A1714; }
    .btd-av.user { background: #3D3834; color: #F5EFE0; border: 0.5px solid rgba(201,151,58,0.35); }
    .btd-bub {
      padding: 9px 13px;
      border-radius: 13px;
      font-size: 14px;
      line-height: 1.55;
      max-width: 80%;
      font-family: 'Cormorant Garamond', serif;
    }
    .btd-msg.bot .btd-bub {
      background: #2E2926;
      color: #F5EFE0;
      border: 0.5px solid rgba(201,151,58,0.18);
      border-bottom-left-radius: 3px;
    }
    .btd-msg.user .btd-bub {
      background: #9B3A2A;
      color: #F5EFE0;
      border-bottom-right-radius: 3px;
    }
    .btd-typing-bub {
      background: #2E2926;
      border: 0.5px solid rgba(201,151,58,0.18);
      border-radius: 13px;
      border-bottom-left-radius: 3px;
      padding: 11px 14px;
      display: flex; gap: 4px; align-items: center;
    }
    .btd-dot {
      width: 5px; height: 5px; border-radius: 50%;
      background: #C9973A; opacity: 0.3;
      animation: btdPulse 1.3s infinite;
    }
    .btd-dot:nth-child(2){animation-delay:0.2s}
    .btd-dot:nth-child(3){animation-delay:0.4s}
    @keyframes btdPulse{0%,80%,100%{opacity:0.2}40%{opacity:0.9}}
    #btd-suggestions {
      display: flex; flex-wrap: wrap; gap: 6px;
      padding: 0 14px 10px;
      flex-shrink: 0;
    }
    .btd-chip {
      background: transparent;
      border: 0.5px solid rgba(201,151,58,0.35);
      border-radius: 16px;
      padding: 5px 11px;
      font-size: 12px;
      cursor: pointer;
      color: rgba(245,239,224,0.55);
      font-family: 'Cormorant Garamond', serif;
      font-style: italic;
      transition: all 0.15s;
    }
    .btd-chip:hover {
      background: rgba(201,151,58,0.1);
      border-color: #C9973A;
      color: #F5EFE0;
    }
    #btd-input-area {
      flex-shrink: 0;
      padding: 10px 14px 12px;
      border-top: 0.5px solid rgba(201,151,58,0.15);
    }
    #btd-input-row { display: flex; gap: 8px; align-items: center; }
    #btd-input {
      flex: 1;
      background: #2E2926;
      border: 0.5px solid rgba(201,151,58,0.3);
      border-radius: 18px;
      padding: 9px 14px;
      font-size: 14px;
      font-family: 'Cormorant Garamond', serif;
      color: #F5EFE0;
      outline: none;
      transition: border-color 0.15s;
    }
    #btd-input::placeholder { color: rgba(245,239,224,0.3); font-style: italic; }
    #btd-input:focus { border-color: #C9973A; }
    #btd-send {
      width: 36px; height: 36px; border-radius: 50%;
      background: #9B3A2A; border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all 0.15s;
    }
    #btd-send:hover { background: #B8503E; transform: scale(1.05); }
    #btd-send:disabled { opacity: 0.38; cursor: not-allowed; transform: none; }
    #btd-send svg { width: 14px; height: 14px; fill: #F5EFE0; }
    #btd-disclaimer {
      font-family: 'Big Shoulders Display', sans-serif;
      font-size: 9px;
      letter-spacing: 0.08em;
      color: rgba(245,239,224,0.25);
      text-align: center;
      margin-top: 7px;
      text-transform: uppercase;
      font-weight: 300;
    }
    #btd-disclaimer a { color: rgba(201,151,58,0.6); text-decoration: none; }
    @media (max-width: 420px) {
      #btd-panel { width: calc(100vw - 24px); right: 0; }
      #btd-chat-widget { right: 12px; bottom: 12px; }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = STYLES;
  document.head.appendChild(styleEl);

  const widget = document.createElement('div');
  widget.id = 'btd-chat-widget';
  widget.setAttribute('role', 'complementary');
  widget.setAttribute('aria-label', 'Black Tie Dinner guest services chat');
  widget.innerHTML = `
    <div id="btd-panel" role="dialog" aria-modal="false" aria-label="Guest Services Chat">
      <div id="btd-panel-header">
        <div class="btd-ornament">
          <div class="btd-line btd-line-l"></div>
          <div class="btd-diamond"></div>
          <div class="btd-line btd-line-r"></div>
        </div>
        <h2>Black Tie Dinner</h2>
        <p>Renaissance · Guest Services</p>
      </div>
      <div id="btd-messages" aria-live="polite"></div>
      <div id="btd-suggestions">
        <button class="btd-chip" onclick="btdSendChip(this)">Buying tickets</button>
        <button class="btd-chip" onclick="btdSendChip(this)">Dress code</button>
        <button class="btd-chip" onclick="btdSendChip(this)">Venue & parking</button>
        <button class="btd-chip" onclick="btdSendChip(this)">Sponsorships</button>
      </div>
      <div id="btd-input-area">
        <div id="btd-input-row">
          <input id="btd-input" type="text" placeholder="Ask about the event…" aria-label="Your question" />
          <button id="btd-send" aria-label="Send">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
        <p id="btd-disclaimer">AI-generated · Questions? <a href="mailto:[CONTACT_EMAIL_PLACEHOLDER]">[CONTACT_EMAIL_PLACEHOLDER]</a></p>
      </div>
    </div>
    <div id="btd-fab" role="button" aria-expanded="false" aria-controls="btd-panel" tabindex="0" aria-label="Open guest services chat">
      <span id="btd-fab-label">Ask us anything</span>
      <svg class="btd-chat-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
      <svg class="btd-close-icon" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
    </div>
  `;
  document.body.appendChild(widget);

  let history = [];
  let isLoading = false;
  let isOpen = false;
  let labelHidden = false;

  const fab = document.getElementById('btd-fab');
  const panel = document.getElementById('btd-panel');
  const messages = document.getElementById('btd-messages');
  const input = document.getElementById('btd-input');
  const sendBtn = document.getElementById('btd-send');
  const suggestions = document.getElementById('btd-suggestions');
  const fabLabel = document.getElementById('btd-fab-label');

  function togglePanel() {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    fab.classList.toggle('open', isOpen);
    fab.setAttribute('aria-expanded', isOpen);
    if (!labelHidden) { fabLabel.classList.add('hidden'); labelHidden = true; }
    if (isOpen && messages.children.length === 0) {
      setTimeout(() => addMessage('bot', 'Welcome to Black Tie Dinner\'s Renaissance — our 45th annual gala. I\'m here to help with tickets, logistics, sponsorships, and more. What can I help you with?'), 300);
    }
    if (isOpen) setTimeout(() => input.focus(), 350);
  }

  fab.addEventListener('click', togglePanel);
  fab.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePanel(); } });

  function addMessage(role, text) {
    const wrap = document.createElement('div');
    wrap.className = 'btd-msg ' + role;
    const av = document.createElement('div');
    av.className = 'btd-av ' + role;
    av.textContent = role === 'user' ? 'You' : 'BTD';
    const bub = document.createElement('div');
    bub.className = 'btd-bub';
    bub.textContent = text;
    if (role === 'user') { wrap.appendChild(bub); wrap.appendChild(av); }
    else { wrap.appendChild(av); wrap.appendChild(bub); }
    messages.appendChild(wrap);
    messages.scrollTop = messages.scrollHeight;
  }

  function addTyping() {
    const wrap = document.createElement('div');
    wrap.className = 'btd-msg bot';
    wrap.id = 'btd-typing';
    const av = document.createElement('div');
    av.className = 'btd-av bot';
    av.textContent = 'BTD';
    const tb = document.createElement('div');
    tb.className = 'btd-typing-bub';
    tb.innerHTML = '<div class="btd-dot"></div><div class="btd-dot"></div><div class="btd-dot"></div>';
    wrap.appendChild(av); wrap.appendChild(tb);
    messages.appendChild(wrap);
    messages.scrollTop = messages.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('btd-typing');
    if (t) t.remove();
  }

  async function ask(text) {
    if (isLoading || !text.trim()) return;
    isLoading = true;
    sendBtn.disabled = true;
    suggestions.style.display = 'none';
    addMessage('user', text);
    history.push({ role: 'user', content: text });
    addTyping();

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: history
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || 'I\'m having trouble right now. Please email us at [CONTACT_EMAIL_PLACEHOLDER].';
      removeTyping();
      addMessage('bot', reply);
      history.push({ role: 'assistant', content: reply });
    } catch (e) {
      removeTyping();
      addMessage('bot', 'Something went wrong. Please email us at [CONTACT_EMAIL_PLACEHOLDER].');
      history.push({ role: 'assistant', content: 'Something went wrong. Please email us at [CONTACT_EMAIL_PLACEHOLDER].' });
    }

    isLoading = false;
    sendBtn.disabled = false;
  }

  function handleSend() {
    const val = input.value.trim();
    if (!val) return;
    input.value = '';
    ask(val);
  }

  window.btdSendChip = function(el) { ask(el.textContent.trim()); };

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } });

  setTimeout(() => { fabLabel.classList.add('hidden'); setTimeout(() => { fabLabel.style.display = 'none'; }, 400); }, 5000);
})();
