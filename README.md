# Design Build & Co - Modern Website

A modern, modular website for Design Build & Co with scroll animations and a virtual assistant.

## Project Structure

```
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── images/
│   ├── DBCO-Logo-design-final-480px-300x173-wht.png
│   ├── cad-kitchen-build.gif
│   └── ...
└── README.md
```

## Features

- **Modern Modular Layout** — Clean grid-based design with distinct sections
- **Scroll Animations** — Elements reveal as you scroll using Intersection Observer
- **Virtual Agent (Buildy)** — Chatbot with quote estimates and photo upload
- **Responsive** — Mobile-friendly design

## Run Locally

```bash
python3 -m http.server 8080
# or
npx serve .
```

Then visit http://localhost:8080

## Deploy

**Vercel:** Connect the repo—Vercel auto-detects the static site. `index.html` at root is the entry point.

**GitHub Pages:** Enable Pages in repo Settings → Source: deploy from branch, root or `/docs` (place files accordingly).
