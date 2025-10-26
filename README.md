# 🧪 PezzaliAPP — PWA Python Template (Pyodide)

Template minimale per creare **PWA installabili** che eseguono **Python nel browser** usando **Pyodide**.  
Pensato per pubblicazione **100% GitHub Pages**, funzionamento **offline**, stile **PezzaliAPP**.

## 📦 Struttura
```
index.html         → interfaccia + boot
app.js             → logica UI + Pyodide loader
styles.css         → personalizzazioni
main.py            → funzioni Python (es. square)
manifest.json      → metadati PWA
service-worker.js  → cache offline
icons/
  ├─ icon-192.png
  └─ icon-512.png
```

## 🚀 Pubblicazione su GitHub Pages
1. Crea una repo e carica i file (cartella root della repo).
2. Attiva **Settings → Pages → Deploy from branch**.
3. Apri l'URL pubblicato (es. `https://<user>.github.io/<repo>/`).  
4. Su iPhone/Android: **Condividi → Aggiungi alla schermata Home**.

## ⚠️ Note Pyodide
- Primo avvio ~10–15 MB (poi resta in cache).
- Funziona su iOS/Android/desktop moderni.
- Ideale per calcoli, simulazioni, AI locale leggera.

## 📝 Licenza
MIT © 2025 — pezzaliAPP.com
