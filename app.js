/* PezzaliAPP — PWA Python Template
 * MIT 2025 — Offline-ready, Pyodide in browser.
 */
'use strict';

const elStatus = document.getElementById('status');
const elProg = document.getElementById('prog');
const elOut = document.getElementById('out');
const elRun = document.getElementById('runPy');
const elVal = document.getElementById('val');
const elSwState = document.getElementById('swState');
const elCacheInfo = document.getElementById('cacheInfo');
const elInstall = document.getElementById('btnInstall');

// PWA install prompt
let deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  elInstall.hidden = false;
});
elInstall?.addEventListener('click', async ()=>{
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  elInstall.hidden = true;
});

// Register Service Worker
(async () => {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('./service-worker.js');
      elSwState.textContent = reg.active ? 'attivo' : 'registrato';
    } catch (e) {
      elSwState.textContent = 'errore: ' + e.message;
    }
  } else {
    elSwState.textContent = 'non supportato';
  }
})();

// Quick cache info
(async ()=>{
  if (!('caches' in window)) return;
  const keys = await caches.keys();
  elCacheInfo.textContent = keys.join(', ') || 'vuoto';
})();

// ---- Pyodide boot ----
let pyodide = null;

async function bootPyodide(){
  elStatus.textContent = 'Scarico Pyodide…';
  pyodide = await loadPyodide({
    stdout: (t)=>console.log('[py]',t),
    stderr: (t)=>console.warn('[pyerr]',t)
  });

  elStatus.textContent = 'Carico main.py…';
  // Fetch bundled Python file
  const code = await fetch('./main.py').then(r=>r.text());
  // Load into FS and import
  pyodide.FS.writeFile('main.py', code);
  await pyodide.runPythonAsync(`import main; print("Py ready")`);
  elStatus.textContent = 'Pronto ✅';
  elProg.value = 100;
}

bootPyodide().catch(err=>{
  elStatus.textContent = 'Errore Pyodide: ' + err.message;
  console.error(err);
});

// Demo: call Python function
elRun?.addEventListener('click', async ()=>{
  if (!pyodide) { elOut.textContent = 'Pyodide non inizializzato'; return; }
  const v = Number(elVal.value||0);
  try {
    const pyCode = `import main\nmain.square(${v})`;
    const res = await pyodide.runPythonAsync(pyCode);
    elOut.textContent = `square(${v}) = ${res}`;
  } catch (e) {
    elOut.textContent = 'Errore: ' + e.message;
  }
});
