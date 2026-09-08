const STORAGE_KEY = "kodify-compiler-v1";
const EXAMPLE = {
  html: `<section class="card">
  <p class="tag">Kodify</p>
  <h1>Привет, это мой проект!</h1>
  <p>Нажми кнопку — и JavaScript изменит текст.</p>
  <button id="go">Запустить магию</button>
</section>`,
  css: `* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #111;
  color: #fff;
  font-family: Arial, sans-serif;
}
.card {
  width: min(420px, 92vw);
  padding: 28px;
  background: #202020;
  border-radius: 16px;
  text-align: center;
}
.tag {
  color: #b8f750;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 700;
}
h1 { margin: 8px 0 12px; }
button {
  margin-top: 8px;
  padding: 12px 18px;
  border: 2px solid #b8f750;
  border-radius: 10px;
  background: #b8f750;
  color: #202020;
  font-weight: 700;
  text-transform: uppercase;
  cursor: pointer;
}
button:hover {
  background: transparent;
  color: #b8f750;
}`,
  js: `const btn = document.getElementById("go");
btn.addEventListener("click", () => {
  document.querySelector("h1").textContent = "Код работает!";
  console.log("Кнопка нажата — проект запущен");
});`,
};

const els = {
  html: document.getElementById("code-html"),
  css: document.getElementById("code-css"),
  js: document.getElementById("code-js"),
  preview: document.getElementById("preview"),
  empty: document.getElementById("preview-empty"),
  console: document.getElementById("console"),
  filename: document.getElementById("filename"),
  folderChip: document.getElementById("folder-chip"),
  saveHint: document.getElementById("save-hint"),
  status: document.getElementById("run-status"),
  autoRun: document.getElementById("auto-run"),
  toast: document.getElementById("toast"),
};

let directoryHandle = null;
let previewUrl = null;
let autoRunTimer = 0;
let toastTimer = 0;

function supportsDirectoryPicker() {
  return typeof window.showDirectoryPicker === "function";
}

function showToast(message, isError = false) {
  els.toast.textContent = message;
  els.toast.classList.toggle("is-error", isError);
  els.toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => els.toast.classList.remove("is-visible"), 2600);
}

function persist() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      html: els.html.value,
      css: els.css.value,
      js: els.js.value,
      filename: els.filename.value,
      autoRun: els.autoRun.checked,
    })
  );
}

function restore() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved) {
      loadExample(false);
      return;
    }
    els.html.value = saved.html || "";
    els.css.value = saved.css || "";
    els.js.value = saved.js || "";
    const savedName = saved.filename || "Index.html";
    els.filename.value = savedName === "project.html" ? "Index.html" : savedName;
    els.autoRun.checked = Boolean(saved.autoRun);
  } catch {
    loadExample(false);
  }
}

function loadExample(notify = true) {
  els.html.value = EXAMPLE.html;
  els.css.value = EXAMPLE.css;
  els.js.value = EXAMPLE.js;
  persist();
  if (notify) showToast("Загружен учебный пример");
}

function sanitizeFilename(name) {
  const trimmed = (name || "Index.html").trim().replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_");
  const withExt = /\.html?$/i.test(trimmed) ? trimmed : `${trimmed}.html`;
  return withExt.slice(0, 120);
}

function compileDocument(html, css, js) {
  const cssBlock = css.trim() ? `<style>\n${css}\n</style>` : "";
  const jsBlock = js.trim() ? `<script>\n${js}\n<\/script>` : "";
  const looksFull = /<!DOCTYPE/i.test(html) || /<html[\s>]/i.test(html);

  if (looksFull) {
    let out = html;
    if (cssBlock) {
      out = /<\/head>/i.test(out)
        ? out.replace(/<\/head>/i, `${cssBlock}\n</head>`)
        : `${cssBlock}\n${out}`;
    }
    if (jsBlock) {
      out = /<\/body>/i.test(out)
        ? out.replace(/<\/body>/i, `${jsBlock}\n</body>`)
        : `${out}\n${jsBlock}`;
    }
    return out;
  }

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kodify Project</title>
  ${cssBlock}
</head>
<body>
${html}
${jsBlock}
</body>
</html>`;
}

function consoleHookScript() {
  return `<script>
(function () {
  function send(type, args) {
    parent.postMessage({ source: "kodify-compiler", type: type, args: args }, "*");
  }
  ["log", "info", "warn", "error"].forEach(function (method) {
    var original = console[method];
    console[method] = function () {
      var args = Array.prototype.slice.call(arguments).map(function (item) {
        try { return typeof item === "string" ? item : JSON.stringify(item); }
        catch (e) { return String(item); }
      });
      send(method, args);
      return original.apply(console, arguments);
    };
  });
  window.addEventListener("error", function (event) {
    send("error", [event.message + " (" + (event.lineno || 0) + ":" + (event.colno || 0) + ")"]);
  });
  window.addEventListener("unhandledrejection", function (event) {
    send("error", ["Unhandled: " + String(event.reason)]);
  });
})();
<\/script>`;
}

function withConsoleHook(html) {
  if (/<head[\s>]/i.test(html)) {
    return html.replace(/<head([^>]*)>/i, `<head$1>\n${consoleHookScript()}`);
  }
  return `${consoleHookScript()}\n${html}`;
}

function logLine(type, text) {
  const line = document.createElement("p");
  line.className = `log log-${type}`;
  line.textContent = `[${type}] ${text}`;
  els.console.appendChild(line);
  els.console.scrollTop = els.console.scrollHeight;
}

function runCode() {
  const html = compileDocument(els.html.value, els.css.value, els.js.value);
  const hooked = withConsoleHook(html);
  if (previewUrl) URL.revokeObjectURL(previewUrl);
  const blob = new Blob([hooked], { type: "text/html" });
  previewUrl = URL.createObjectURL(blob);
  els.preview.src = previewUrl;
  els.empty.classList.add("is-hidden");
  els.status.textContent = "Запущено";
  persist();
}

async function pickFolder() {
  if (!supportsDirectoryPicker()) {
    showToast("Этот браузер не умеет выбирать папку. Файл скачается при сохранении.", true);
    return false;
  }
  try {
    directoryHandle = await window.showDirectoryPicker({ mode: "readwrite" });
    els.folderChip.textContent = `Папка: ${directoryHandle.name}`;
    els.saveHint.textContent = "Следующие сохранения пойдут в выбранную папку. Чтобы сменить её, нажми «Выбрать папку» ещё раз.";
    showToast(`Папка «${directoryHandle.name}» выбрана`);
    return true;
  } catch (error) {
    if (error && error.name === "AbortError") return false;
    showToast("Не удалось открыть папку. Проверь разрешение браузера.", true);
    return false;
  }
}

async function saveToDirectory(filename, content) {
  const fileHandle = await directoryHandle.getFileHandle(filename, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function saveProject() {
  const filename = sanitizeFilename(els.filename.value);
  els.filename.value = filename;
  const content = compileDocument(els.html.value, els.css.value, els.js.value);

  if (supportsDirectoryPicker()) {
    if (!directoryHandle) {
      const picked = await pickFolder();
      if (!picked) return;
    }
    try {
      const permission = await directoryHandle.queryPermission({ mode: "readwrite" });
      if (permission !== "granted") {
        const next = await directoryHandle.requestPermission({ mode: "readwrite" });
        if (next !== "granted") throw new Error("no-permission");
      }
      await saveToDirectory(filename, content);
      showToast(`Сохранено: ${filename} → ${directoryHandle.name}`);
      persist();
      return;
    } catch (error) {
      if (error && error.name === "AbortError") return;
      directoryHandle = null;
      els.folderChip.textContent = "Папка не выбрана";
      showToast("Не получилось записать в папку. Попробуй выбрать её снова.", true);
      return;
    }
  }

  downloadFile(filename, content);
  showToast(`Файл ${filename} скачан — сохрани его в нужную папку`);
  persist();
}

function scheduleAutoRun() {
  persist();
  if (!els.autoRun.checked) return;
  clearTimeout(autoRunTimer);
  autoRunTimer = window.setTimeout(runCode, 450);
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((item) => {
      item.classList.toggle("is-active", item === tab);
      item.setAttribute("aria-selected", item === tab ? "true" : "false");
    });
    document.querySelectorAll(".editor-pane").forEach((pane) => {
      pane.classList.toggle("is-active", pane.dataset.pane === tab.dataset.tab);
    });
  });
});

document.getElementById("btn-run").addEventListener("click", runCode);
document.getElementById("btn-refresh").addEventListener("click", runCode);
document.getElementById("btn-example").addEventListener("click", () => {
  loadExample();
  runCode();
});
document.getElementById("btn-clear").addEventListener("click", () => {
  els.html.value = "";
  els.css.value = "";
  els.js.value = "";
  persist();
  showToast("Редакторы очищены");
});
document.getElementById("btn-clear-console").addEventListener("click", () => {
  els.console.replaceChildren();
});
document.getElementById("btn-pick-folder").addEventListener("click", pickFolder);
document.getElementById("btn-save").addEventListener("click", saveProject);

[els.html, els.css, els.js, els.filename].forEach((field) => {
  field.addEventListener("input", scheduleAutoRun);
});
els.autoRun.addEventListener("change", persist);

window.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.source !== "kodify-compiler") return;
  logLine(data.type === "log" ? "info" : data.type, (data.args || []).join(" "));
});

window.addEventListener("keydown", (event) => {
  const accel = event.ctrlKey || event.metaKey;
  if (accel && event.key === "Enter") {
    event.preventDefault();
    runCode();
  }
  if (accel && event.key.toLowerCase() === "s") {
    event.preventDefault();
    saveProject();
  }
});

if (!supportsDirectoryPicker()) {
  els.folderChip.textContent = "Скачивание файла";
  els.saveHint.textContent =
    "Выбор папки доступен в Chrome и Edge. Сейчас файл скачается, и его можно положить в любую папку.";
}

restore();
if (els.autoRun.checked) runCode();
