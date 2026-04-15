# BTD Guest Services Chatbot

AI-powered guest services widget for Black Tie Dinner's website.

## Files

- `public/btd-chatbot-widget.js` — the embeddable floating chat widget
- `index.html` — preview page for testing the widget

## Embed on any site

Once deployed to Vercel, add this single line before `</body>` on any page:

```html
<script src="https://your-project.vercel.app/public/btd-chatbot-widget.js" defer></script>
```

## Updating event details

Open `public/btd-chatbot-widget.js` and find the `SYSTEM_PROMPT` section near the top.
Replace any `[PLACEHOLDER]` values with real event information.
Commit and push — Vercel will auto-deploy within seconds.
