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
const codeEditors = {};

function getCode(lang) {
  return codeEditors[lang] ? codeEditors[lang].getValue() : els[lang].value;
}

function setCode(lang, value) {
  if (codeEditors[lang]) codeEditors[lang].setValue(value || "");
  else els[lang].value = value || "";
}

function currentTab() {
  const tab = document.querySelector(".tab.is-active");
  return tab ? tab.dataset.tab : "html";
}

function supportsDirectoryPicker() {
  return typeof window.showDirectoryPicker === "function";
}

function supportsSavePicker() {
  return typeof window.showSaveFilePicker === "function";
}

function isBlockedFolderError(error) {
  const text = `${error && error.name} ${error && error.message}`.toLowerCase();
  return (
    (error && error.name === "SecurityError") ||
    (error && error.name === "NotAllowedError") ||
    text.includes("системн") ||
    text.includes("system")
  );
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
      html: getCode("html"),
      css: getCode("css"),
      js: getCode("js"),
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
    setCode("html", saved.html || "");
    setCode("css", saved.css || "");
    setCode("js", saved.js || "");
    const savedName = saved.filename || "Index.html";
    els.filename.value = savedName === "project.html" ? "Index.html" : savedName;
    els.autoRun.checked = Boolean(saved.autoRun);
  } catch {
    loadExample(false);
  }
}

function loadExample(notify = true) {
  setCode("html", EXAMPLE.html);
  setCode("css", EXAMPLE.css);
  setCode("js", EXAMPLE.js);
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
  const html = compileDocument(getCode("html"), getCode("css"), getCode("js"));
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
    showToast("Этот браузер не умеет выбирать папку. Нажми «Сохранить как».", true);
    return false;
  }
  try {
    directoryHandle = await window.showDirectoryPicker({
      mode: "readwrite",
      startIn: "documents",
    });
    els.folderChip.textContent = `Папка: ${directoryHandle.name}`;
    els.saveHint.textContent = "Следующие сохранения пойдут в эту папку. Чтобы сменить её, нажми «Выбрать папку» ещё раз.";
    showToast(`Папка «${directoryHandle.name}» выбрана`);
    return true;
  } catch (error) {
    if (error && error.name === "AbortError") return false;
    directoryHandle = null;
    els.folderChip.textContent = "Папка не выбрана";
    if (isBlockedFolderError(error)) {
      showToast("Chrome не даёт писать в эту папку. Выбери Документы\\kodify или нажми «Сохранить как».", true);
    } else {
      showToast("Не удалось открыть папку. Выбери другую или сохрани файл через «Сохранить как».", true);
    }
    return false;
  }
}

async function saveToDirectory(filename, content) {
  const fileHandle = await directoryHandle.getFileHandle(filename, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
}

async function saveWithFilePicker(filename, content) {
  const handle = await window.showSaveFilePicker({
    suggestedName: filename,
    startIn: "documents",
    types: [
      {
        description: "HTML-файл",
        accept: { "text/html": [".html", ".htm"] },
      },
    ],
  });
  const writable = await handle.createWritable();
  await writable.write(content);
  await writable.close();
  return handle.name || filename;
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
  const content = compileDocument(getCode("html"), getCode("css"), getCode("js"));

  if (directoryHandle) {
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
    }
  }

  if (supportsSavePicker()) {
    try {
      const savedName = await saveWithFilePicker(filename, content);
      showToast(`Сохранено: ${savedName}`);
      persist();
      return;
    } catch (error) {
      if (error && error.name === "AbortError") return;
      showToast("Не получилось сохранить файл диалогом. Скачиваю копию.", true);
    }
  }

  downloadFile(filename, content);
  showToast(`Файл ${filename} скачан — перенеси его в нужную папку`);
  persist();
}

function scheduleAutoRun() {
  persist();
  if (!els.autoRun.checked) return;
  clearTimeout(autoRunTimer);
  autoRunTimer = window.setTimeout(runCode, 450);
}

function isPreviewFullscreen() {
  const panel = document.getElementById("preview-panel");
  return document.fullscreenElement === panel || panel.classList.contains("is-fullscreen");
}

function updateFullscreenButton() {
  const btn = document.getElementById("btn-fullscreen");
  const on = isPreviewFullscreen();
  btn.textContent = on ? "Свернуть" : "На весь экран";
  btn.setAttribute("aria-pressed", on ? "true" : "false");
}

async function togglePreviewFullscreen() {
  const panel = document.getElementById("preview-panel");
  if (document.fullscreenElement === panel) {
    await document.exitFullscreen();
    return;
  }
  if (panel.classList.contains("is-fullscreen")) {
    panel.classList.remove("is-fullscreen");
    document.body.classList.remove("preview-fs");
    updateFullscreenButton();
    return;
  }
  try {
    if (panel.requestFullscreen) {
      await panel.requestFullscreen();
    } else {
      panel.classList.add("is-fullscreen");
      document.body.classList.add("preview-fs");
    }
  } catch {
    panel.classList.add("is-fullscreen");
    document.body.classList.add("preview-fs");
  }
  updateFullscreenButton();
}

function exitPreviewFullscreen() {
  const panel = document.getElementById("preview-panel");
  if (document.fullscreenElement === panel) {
    document.exitFullscreen();
    return;
  }
  if (panel.classList.contains("is-fullscreen")) {
    panel.classList.remove("is-fullscreen");
    document.body.classList.remove("preview-fs");
    updateFullscreenButton();
  }
}

function formatCurrentCode() {
  const lang = currentTab();
  const raw = getCode(lang);
  let pretty = raw;
  const options = { indent_size: 2, wrap_line_length: 0, end_with_newline: true };
  try {
    if (lang === "html" && typeof html_beautify === "function") pretty = html_beautify(raw, options);
    else if (lang === "css" && typeof css_beautify === "function") pretty = css_beautify(raw, options);
    else if (lang === "js" && typeof js_beautify === "function") pretty = js_beautify(raw, options);
    else {
      showToast("Форматирование недоступно — проверь интернет", true);
      return;
    }
  } catch {
    showToast("Не получилось отформатировать этот фрагмент", true);
    return;
  }
  setCode(lang, pretty);
  persist();
  showToast("Код отформатирован");
}

function editorExtraKeys() {
  return {
    "Ctrl-Enter": runCode,
    "Cmd-Enter": runCode,
    "Ctrl-S": function (cm) {
      cm && saveProject();
    },
    "Cmd-S": function (cm) {
      cm && saveProject();
    },
  };
}

function initEditors() {
  if (typeof CodeMirror !== "function") return;
  const modes = { html: "htmlmixed", css: "css", js: "javascript" };
  ["html", "css", "js"].forEach((lang) => {
    codeEditors[lang] = CodeMirror.fromTextArea(els[lang], {
      mode: modes[lang],
      theme: "kodify",
      lineNumbers: true,
      lineWrapping: true,
      indentUnit: 2,
      tabSize: 2,
      matchBrackets: true,
      autoCloseBrackets: true,
      autoCloseTags: lang === "html",
      styleActiveLine: true,
      extraKeys: editorExtraKeys(),
    });
    codeEditors[lang].on("change", scheduleAutoRun);
  });
  requestAnimationFrame(() => {
    if (codeEditors.html) codeEditors.html.refresh();
  });
}

function refreshActiveEditor() {
  const lang = currentTab();
  const editor = codeEditors[lang];
  if (!editor) return;
  requestAnimationFrame(() => editor.refresh());
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
    refreshActiveEditor();
  });
});

document.getElementById("btn-run").addEventListener("click", runCode);
document.getElementById("btn-refresh").addEventListener("click", runCode);
document.getElementById("btn-example").addEventListener("click", () => {
  loadExample();
  runCode();
});
document.getElementById("btn-format").addEventListener("click", formatCurrentCode);
document.getElementById("btn-fullscreen").addEventListener("click", togglePreviewFullscreen);
document.getElementById("btn-clear").addEventListener("click", () => {
  setCode("html", "");
  setCode("css", "");
  setCode("js", "");
  persist();
  showToast("Редакторы очищены");
});
document.getElementById("btn-clear-console").addEventListener("click", () => {
  els.console.replaceChildren();
});
document.getElementById("btn-pick-folder").addEventListener("click", pickFolder);
document.getElementById("btn-save").addEventListener("click", saveProject);

els.filename.addEventListener("input", persist);
els.autoRun.addEventListener("change", persist);
document.addEventListener("fullscreenchange", updateFullscreenButton);

window.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.source !== "kodify-compiler") return;
  logLine(data.type === "log" ? "info" : data.type, (data.args || []).join(" "));
});

window.addEventListener("keydown", (event) => {
  const accel = event.ctrlKey || event.metaKey;
  if (event.key === "Escape") {
    exitPreviewFullscreen();
    return;
  }
  if (event.target.closest(".CodeMirror")) return;
  if (accel && event.key === "Enter") {
    event.preventDefault();
    runCode();
  }
  if (accel && event.key.toLowerCase() === "s") {
    event.preventDefault();
    saveProject();
  }
});

if (!supportsDirectoryPicker() && !supportsSavePicker()) {
  els.folderChip.textContent = "Скачивание файла";
  els.saveHint.textContent =
    "Этот браузер скачает HTML-файл. Сохрани его в любую обычную папку на компьютере.";
}

restore();
initEditors();
if (els.autoRun.checked) runCode();
