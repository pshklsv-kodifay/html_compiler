const STORAGE_KEY = "kodify-compiler-v1";
const HINTS = {
  html: {
    title: "База HTML",
    items: [
      { name: "Emmet: блок", desc: "Напиши в редакторе и нажми Tab — получится div с классом.", code: "div.card" },
      { name: "Emmet: список", desc: "Сокращение. Tab развернёт три пункта списка.", code: "ul>li*3" },
      { name: "Emmet: шапка", desc: "Несколько тегов сразу через + и Tab.", code: "h1+p+button" },
      { name: "Заголовок", desc: "Главный текст на странице. h2 и h3 — меньше.", code: "<h1>Привет, Kodify!</h1>" },
      { name: "Абзац", desc: "Обычный текст.", code: "<p>Это мой первый сайт.</p>" },
      { name: "Кнопка", desc: "На неё можно нажать. id нужен для JavaScript.", code: '<button id="go">Нажми меня</button>' },
      { name: "Ссылка", desc: "Ведёт на другую страницу.", code: '<a href="https://kodify.online">Сайт Kodify</a>' },
      { name: "Картинка", desc: "Путь из «Картинки проекта», например images/cat.png.", code: '<img src="images/cat.png" alt="Кот" width="200">' },
      { name: "Список", desc: "ul — список, li — пункт.", code: "<ul>\n  <li>HTML</li>\n  <li>CSS</li>\n  <li>JS</li>\n</ul>" },
      { name: "Коробка div", desc: "Блок, чтобы группировать элементы.", code: '<div class="card">\n  <h2>Карточка</h2>\n  <p>Текст внутри</p>\n</div>' },
      { name: "Поле ввода", desc: "Сюда ученик может писать текст.", code: '<input type="text" placeholder="Твоё имя">' },
      { name: "Жирный и курсив", desc: "Выделить важное слово.", code: "<p>Это <strong>важно</strong> и это <em>красиво</em>.</p>" },
      { name: "class и id", desc: "class — для стилей, id — для JavaScript.", code: '<p class="note" id="hello">Привет</p>' },
    ],
  },
  css: {
    title: "База CSS",
    items: [
      { name: "Emmet: отступ", desc: "Напиши m20 и нажми Tab — будет margin: 20px.", code: "m20" },
      { name: "Emmet: флекс", desc: "df + Tab = display: flex.", code: "df" },
      { name: "Цвет текста", desc: "Любой цвет: имя, #hex или rgb.", code: "h1 {\n  color: #b8f750;\n}" },
      { name: "Фон-картинка", desc: "Картинка из проекта как фон блока.", code: ".hero {\n  background-image: url(images/bg.png);\n  background-size: cover;\n}" },
      { name: "Размер шрифта", desc: "px — пиксели, чем больше число, тем крупнее.", code: "p {\n  font-size: 18px;\n  font-family: Arial, sans-serif;\n}" },
      { name: "Выравнивание", desc: "Текст слева, по центру или справа.", code: ".card {\n  text-align: center;\n}" },
      { name: "Отступы", desc: "padding — внутри, margin — снаружи.", code: ".card {\n  padding: 24px;\n  margin: 16px;\n}" },
      { name: "Размер блока", desc: "Ширина и высота.", code: ".card {\n  width: 300px;\n  height: 200px;\n}" },
      { name: "Рамка и скругление", desc: "Обвести блок и сделать мягкие углы.", code: "button {\n  border: 2px solid #b8f750;\n  border-radius: 10px;\n}" },
      { name: "Кнопка как на Kodify", desc: "Лаймовый фон и тёмный текст.", code: "button {\n  background: #b8f750;\n  color: #202020;\n  padding: 12px 18px;\n}" },
      { name: "Наведение мыши", desc: "Стиль, когда навели курсор.", code: "button:hover {\n  background: transparent;\n  color: #b8f750;\n}" },
      { name: "По центру экрана", desc: "Flex ставит содержимое в середину.", code: "body {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}" },
    ],
  },
  js: {
    title: "База JavaScript",
    items: [
      { name: "Сообщение в консоль", desc: "Проверка: код запустился. Смотри консоль внизу.", code: 'console.log("Привет из JavaScript");' },
      { name: "Найти элемент", desc: "Берём элемент по id из HTML.", code: 'const btn = document.getElementById("go");' },
      { name: "Клик по кнопке", desc: "Что делать, когда нажали.", code: 'btn.addEventListener("click", () => {\n  console.log("Кнопка нажата");\n});' },
      { name: "Поменять текст", desc: "Меняем надпись на странице.", code: 'document.querySelector("h1").textContent = "Готово!";' },
      { name: "Окно alert", desc: "Всплывающее сообщение.", code: 'alert("Ура, получилось!");' },
      { name: "Переменная", desc: "Коробка для значения. const — не меняем.", code: 'const name = "Артём";\nlet score = 0;' },
      { name: "Если… то…", desc: "Код выполняется только при условии.", code: 'if (score >= 10) {\n  console.log("Победа");\n}' },
      { name: "Своя функция", desc: "Кусок кода, который можно вызывать снова.", code: 'function greet() {\n  console.log("Привет!");\n}\ngreet();' },
      { name: "Показать / спрятать", desc: "Меняем стиль элемента.", code: 'document.querySelector(".card").style.display = "none";' },
      { name: "Случайное число", desc: "Число от 1 до 10.", code: "const n = Math.floor(Math.random() * 10) + 1;\nconsole.log(n);" },
    ],
  },
};
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
const assets = new Map();
const ASSET_DB = "kodify-compiler-assets";
const MAX_ASSET_BYTES = 8 * 1024 * 1024;

function openAssetDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(ASSET_DB, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains("files")) {
        req.result.createObjectStore("files");
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbPut(path, blob) {
  return openAssetDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction("files", "readwrite");
        tx.objectStore("files").put(blob, path);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      })
  );
}

function idbDelete(path) {
  return openAssetDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction("files", "readwrite");
        tx.objectStore("files").delete(path);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      })
  );
}

function idbLoadAll() {
  return openAssetDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction("files", "readonly");
        const req = tx.objectStore("files").openCursor();
        const rows = [];
        req.onsuccess = () => {
          const cursor = req.result;
          if (cursor) {
            rows.push([cursor.key, cursor.value]);
            cursor.continue();
          } else {
            resolve(rows);
          }
        };
        req.onerror = () => reject(req.error);
      })
  );
}

function sanitizeAssetName(name) {
  const base = (name || "image.png").split(/[/\\]/).pop();
  return base.replace(/[<>:"|?*\u0000-\u001f]/g, "_").replace(/\s+/g, "-") || "image.png";
}

function uniqueAssetPath(preferred) {
  let path = preferred.replace(/\\/g, "/").replace(/^\/+/, "");
  if (!path.includes("/")) path = `images/${path}`;
  if (!assets.has(path)) return path;
  const dot = path.lastIndexOf(".");
  const stem = dot === -1 ? path : path.slice(0, dot);
  const ext = dot === -1 ? "" : path.slice(dot);
  let i = 2;
  while (assets.has(`${stem}-${i}${ext}`)) i += 1;
  return `${stem}-${i}${ext}`;
}

function rememberAsset(path, blob) {
  const prev = assets.get(path);
  if (prev && prev.url) URL.revokeObjectURL(prev.url);
  assets.set(path, {
    blob,
    url: URL.createObjectURL(blob),
    type: blob.type || "application/octet-stream",
  });
}

function renderAssets() {
  const list = document.getElementById("assets-list");
  const count = document.getElementById("assets-count");
  count.textContent = `Файлов: ${assets.size}`;
  list.replaceChildren();
  if (!assets.size) {
    const empty = document.createElement("p");
    empty.className = "assets-empty";
    empty.id = "assets-empty";
    empty.innerHTML =
      'Перетащи сюда картинки или нажми «Загрузить». В коде пиши путь, например <code>images/cat.png</code>.';
    list.appendChild(empty);
    return;
  }
  [...assets.keys()].sort().forEach((path) => {
    const item = assets.get(path);
    const card = document.createElement("div");
    card.className = "asset-card";
    const img = document.createElement("img");
    img.src = item.url;
    img.alt = path;
    const meta = document.createElement("div");
    meta.className = "asset-meta";
    const label = document.createElement("span");
    label.className = "asset-label";
    label.textContent = "Ссылка для кода";
    const pathEl = document.createElement("code");
    pathEl.className = "asset-path";
    pathEl.textContent = path;
    const actions = document.createElement("div");
    actions.className = "asset-actions";
    const copyBtn = document.createElement("button");
    copyBtn.type = "button";
    copyBtn.textContent = "Копировать";
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(path);
        showToast(`Скопировано: ${path}`);
      } catch {
        showToast(path);
      }
    });
    const useBtn = document.createElement("button");
    useBtn.type = "button";
    useBtn.textContent = "Вставить в HTML";
    useBtn.addEventListener("click", () => insertAssetTag(path));
    const del = document.createElement("button");
    del.type = "button";
    del.className = "asset-del";
    del.textContent = "Удалить";
    del.addEventListener("click", () => removeAsset(path));
    actions.append(copyBtn, useBtn, del);
    meta.append(label, pathEl, actions);
    card.append(img, meta);
    list.appendChild(card);
  });
}

function insertAssetTag(path) {
  const snippet = `<img src="${path}" alt="">`;
  const htmlTab = document.querySelector('.tab[data-tab="html"]');
  if (htmlTab) htmlTab.click();
  insertSnippet(snippet);
}

async function addFiles(fileList) {
  const files = [...fileList].filter((file) => file.type.startsWith("image/") || /\.svg$/i.test(file.name));
  if (!files.length) {
    showToast("Нужны файлы-картинки (png, jpg, gif, svg, webp)", true);
    return;
  }
  for (const file of files) {
    if (file.size > MAX_ASSET_BYTES) {
      showToast(`«${file.name}» больше 8 МБ — пропусти`, true);
      continue;
    }
    const path = uniqueAssetPath(`images/${sanitizeAssetName(file.name)}`);
    rememberAsset(path, file);
    try {
      await idbPut(path, file);
    } catch {
      showToast("Картинка в превью есть, но в память браузера не сохранилась", true);
    }
  }
  renderAssets();
  if (els.autoRun.checked) runCode();
  else showToast("Картинки добавлены. Вставь путь в код и нажми «Запустить»");
}

async function removeAsset(path) {
  const prev = assets.get(path);
  if (prev && prev.url) URL.revokeObjectURL(prev.url);
  assets.delete(path);
  try {
    await idbDelete(path);
  } catch {
    /* ignore */
  }
  renderAssets();
  if (els.autoRun.checked) runCode();
}

async function restoreAssets() {
  try {
    const rows = await idbLoadAll();
    rows.forEach(([path, blob]) => rememberAsset(path, blob));
  } catch {
    /* first visit or private mode */
  }
  renderAssets();
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function rewriteAssetPaths(html) {
  let out = html;
  [...assets.keys()]
    .sort((a, b) => b.length - a.length)
    .forEach((path) => {
      out = out.replace(new RegExp(escapeRegExp(path), "g"), assets.get(path).url);
    });
  return out;
}

function githubReadme(filename) {
  return `# Проект Kodify

1. Загрузи эту папку в GitHub.
2. Settings → Pages → Deploy from a branch → \`main\` / root.
3. Если главная страница не открылась, переименуй \`${filename}\` в \`index.html\`.

Картинки лежат в \`images/\`. В коде используй пути вида \`images/имя.png\`.
`;
}

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
      hintsOpen: document.getElementById("hints").classList.contains("is-open"),
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
    if (saved.hintsOpen) {
      document.getElementById("hints").classList.add("is-open");
      document.getElementById("btn-hints").classList.add("is-on");
    }
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
  const hooked = withConsoleHook(rewriteAssetPaths(html));
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

async function writeRelativeFile(root, relativePath, data) {
  const parts = relativePath.replace(/\\/g, "/").split("/").filter(Boolean);
  let dir = root;
  for (let i = 0; i < parts.length - 1; i += 1) {
    dir = await dir.getDirectoryHandle(parts[i], { create: true });
  }
  const fileHandle = await dir.getFileHandle(parts[parts.length - 1], { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(data);
  await writable.close();
}

async function writeProjectToDirectory(filename, html) {
  await writeRelativeFile(directoryHandle, filename, html);
  for (const [path, item] of assets) {
    await writeRelativeFile(directoryHandle, path, item.blob);
  }
  await writeRelativeFile(directoryHandle, "README.md", githubReadme(filename));
}

async function downloadProjectZip(filename, html) {
  if (typeof JSZip !== "function") {
    showToast("Не удалось загрузить ZIP. Проверь интернет и обнови страницу.", true);
    return;
  }
  const zip = new JSZip();
  zip.file(filename, html);
  zip.file("README.md", githubReadme(filename));
  for (const [path, item] of assets) {
    zip.file(path, item.blob);
  }
  const blob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "kodify-project.zip";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
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
      await writeProjectToDirectory(filename, content);
      showToast(`Проект сохранён в «${directoryHandle.name}»`);
      persist();
      return;
    } catch (error) {
      if (error && error.name === "AbortError") return;
      directoryHandle = null;
      els.folderChip.textContent = "Папка не выбрана";
    }
  }

  if (supportsDirectoryPicker()) {
    const picked = await pickFolder();
    if (picked) {
      try {
        await writeProjectToDirectory(filename, content);
        showToast(`Проект сохранён в «${directoryHandle.name}»`);
        persist();
        return;
      } catch (error) {
        if (error && error.name === "AbortError") return;
        directoryHandle = null;
        els.folderChip.textContent = "Папка не выбрана";
        showToast("Папка недоступна. Скачиваю ZIP.", true);
      }
    }
  }

  if (assets.size) {
    await downloadProjectZip(filename, content);
    showToast("Скачан ZIP со всеми файлами — распакуй и залей на GitHub");
    persist();
    return;
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

async function saveZipOnly() {
  const filename = sanitizeFilename(els.filename.value);
  els.filename.value = filename;
  const content = compileDocument(getCode("html"), getCode("css"), getCode("js"));
  await downloadProjectZip(filename, content);
  showToast("ZIP готов: HTML + images. Распакуй и залей на GitHub");
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

function tryEmmetExpand(cm) {
  const before = cm.getValue();
  const cursor = cm.getCursor();
  const commands = CodeMirror.commands || {};
  if (typeof commands.emmetExpandAbbreviation === "function") {
    commands.emmetExpandAbbreviation(cm);
  }
  if (cm.getValue() !== before) return true;
  if (typeof commands.emmetExpandAbbreviationAll === "function") {
    commands.emmetExpandAbbreviationAll(cm);
  }
  const afterCursor = cm.getCursor();
  return cm.getValue() !== before || afterCursor.line !== cursor.line || afterCursor.ch !== cursor.ch;
}

function editorExtraKeys(lang) {
  return {
    "Ctrl-Enter": runCode,
    "Cmd-Enter": runCode,
    "Ctrl-Space": "autocomplete",
    "Ctrl-S": function (cm) {
      cm && saveProject();
    },
    "Cmd-S": function (cm) {
      cm && saveProject();
    },
    Tab: function (cm) {
      if ((lang === "html" || lang === "css") && tryEmmetExpand(cm)) return;
      if (cm.somethingSelected()) cm.indentSelection("add");
      else cm.replaceSelection("  ", "end");
    },
  };
}

function maybeShowHint(cm, change) {
  if (!cm.showHint || change.origin !== "+input") return;
  if (change.text.length !== 1 || !change.text[0]) return;
  if (!/[\w.#@\-:!]/.test(change.text[0])) return;
  cm.showHint({ completeSingle: false });
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
      extraKeys: editorExtraKeys(lang),
      hintOptions: { completeSingle: false },
    });
    codeEditors[lang].on("change", scheduleAutoRun);
    codeEditors[lang].on("inputRead", maybeShowHint);
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

function insertSnippet(code) {
  const lang = currentTab();
  const editor = codeEditors[lang];
  if (editor) {
    editor.replaceSelection(`${code}\n`);
    editor.focus();
  } else {
    const area = els[lang];
    const start = area.selectionStart;
    const end = area.selectionEnd;
    area.value = `${area.value.slice(0, start)}${code}\n${area.value.slice(end)}`;
    area.focus();
  }
  persist();
  showToast("Пример вставлен в редактор");
}

function renderHints() {
  const pack = HINTS[currentTab()] || HINTS.html;
  document.getElementById("hints-title").textContent = pack.title;
  const list = document.getElementById("hints-list");
  list.replaceChildren();
  pack.items.forEach((item) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "hint-card";
    const title = document.createElement("strong");
    title.textContent = item.name;
    const desc = document.createElement("span");
    desc.textContent = item.desc;
    const sample = document.createElement("code");
    sample.textContent = item.code.replace(/\s+/g, " ").trim();
    card.append(title, desc, sample);
    card.addEventListener("click", () => insertSnippet(item.code));
    list.appendChild(card);
  });
}

function renderCheatsheet() {
  const grid = document.getElementById("cheatsheet-grid");
  grid.replaceChildren();
  ["html", "css", "js"].forEach((lang) => {
    const pack = HINTS[lang];
    const col = document.createElement("article");
    col.className = "cheatsheet-col";
    const heading = document.createElement("h3");
    heading.textContent = pack.title;
    col.appendChild(heading);
    pack.items.forEach((item) => {
      const wrap = document.createElement("div");
      wrap.className = "cheat-item";
      const name = document.createElement("strong");
      name.textContent = item.name;
      const desc = document.createElement("p");
      desc.textContent = item.desc;
      const sample = document.createElement("code");
      sample.textContent = item.code;
      wrap.append(name, desc, sample);
      col.appendChild(wrap);
    });
    grid.appendChild(col);
  });
}

function toggleHints() {
  const box = document.getElementById("hints");
  box.classList.toggle("is-open");
  const open = box.classList.contains("is-open");
  document.getElementById("btn-hints").classList.toggle("is-on", open);
  if (open) renderHints();
  persist();
  refreshActiveEditor();
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
    if (document.getElementById("hints").classList.contains("is-open")) renderHints();
  });
});

document.getElementById("btn-run").addEventListener("click", runCode);
document.getElementById("btn-refresh").addEventListener("click", runCode);
document.getElementById("btn-example").addEventListener("click", () => {
  loadExample();
  runCode();
});
document.getElementById("btn-hints").addEventListener("click", toggleHints);
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
document.getElementById("btn-zip").addEventListener("click", saveZipOnly);
document.getElementById("btn-upload").addEventListener("click", () => {
  document.getElementById("file-images").click();
});
document.getElementById("file-images").addEventListener("change", (event) => {
  addFiles(event.target.files);
  event.target.value = "";
});

const assetsBar = document.getElementById("assets-bar");
["dragenter", "dragover"].forEach((type) => {
  assetsBar.addEventListener(type, (event) => {
    event.preventDefault();
    assetsBar.classList.add("is-drop");
  });
});
["dragleave", "drop"].forEach((type) => {
  assetsBar.addEventListener(type, (event) => {
    event.preventDefault();
    assetsBar.classList.remove("is-drop");
  });
});
assetsBar.addEventListener("drop", (event) => {
  if (event.dataTransfer && event.dataTransfer.files.length) addFiles(event.dataTransfer.files);
});

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
renderCheatsheet();
if (document.getElementById("hints").classList.contains("is-open")) renderHints();
restoreAssets().then(() => {
  if (els.autoRun.checked) runCode();
});
