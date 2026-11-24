/*
 * Role-play practice app. Routes (all in the URL hash, so a link or QR code restores the same view):
 *   #/                      home: choose a scene
 *   #/qr                    class QR code for the projector
 *   #/<scene>?A=..&B=..     choose words, then a role
 *   #/<scene>?..&role=c1    one student's lines (tab=all → whole scene)
 */
(() => {
  "use strict";

  const app = document.getElementById("app");
  const modalRoot = document.getElementById("modal");
  const TARGET_SECONDS = 50;
  const ROLE_PITCH = [1, 1.25, 0.85, 1.1];

  const ICON = {
    speak: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9v6h4l5 4V5L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z"/></svg>',
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    stop: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6h12v12H6z"/></svg>',
    back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4L10.8 12z"/></svg>',
    qr: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm8-2h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2zm2 2h2v2h-2v-2zm-6 2h2v2h-2v-2zm2 2h2v2h-2v-2zm2-2h2v2h-2v-2zm2 2h2v2h-2v-2z"/></svg>',
    store: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 26h48v30H8z" fill="#fff" stroke="currentColor" stroke-width="3"/><path d="M6 14h52l-3 12H9z" fill="#E8871E" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M14 34h14v22H14z" fill="#E3F1E9" stroke="currentColor" stroke-width="3"/><path d="M34 34h16v10H34z" fill="#FDF0DF" stroke="currentColor" stroke-width="3"/></svg>',
    movie: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M8 24h48v30H8z" fill="#fff" stroke="currentColor" stroke-width="3"/><path d="m8 12 46-6 2 12-46 6z" fill="#1F4E5F" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="m18 10.7 4 11.3M30 9.2l4 11.2M42 7.6l4 11.3" stroke="#fff" stroke-width="3"/><path d="m27 32 14 7-14 7z" fill="#E8871E"/></svg>',
  };

  // ---------- Helpers

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const baseUrl = () => location.href.split("#")[0];
  const roleById = (scene, id) => scene.roles.find((r) => r.id === id);
  const speakers = (scene, line) => line.by.map((id) => roleById(scene, id).name).join(" & ");
  const linePitch = (scene, line) => ROLE_PITCH[scene.roles.findIndex((r) => r.id === line.by[0])] || 1;
  const missingBlanks = (scene, choices) => scene.blanks.filter((b) => !(choices[b.key] || "").trim());

  function ideaFor(blank, value) {
    const v = value.trim().toLowerCase();
    return (blank.ideas || []).find(([en]) => en.toLowerCase() === v);
  }

  /** Fills {A}-style blanks. mode: "html" (highlighted English), "zh" (highlighted 中文 hint), "speech" (plain). */
  function fill(scene, template, choices, mode = "html") {
    const source = mode === "speech" ? template : esc(template);
    return source.replace(/\{([A-Z])\}/g, (_, key) => {
      const blank = scene.blanks.find((b) => b.key === key);
      const value = (choices[key] || "").trim();
      if (mode === "speech") return value || "blank";
      if (!value) return `<span class="fill empty">(${key}) ____</span>`;
      const shown = mode === "zh" ? (ideaFor(blank, value) || [value, value])[1] : value;
      return `<span class="fill">${esc(shown)}</span>`;
    });
  }

  function qrSvg(text) {
    const qr = new QRCode(-1, QRErrorCorrectLevel.M);
    qr.addData(text);
    qr.make();
    const n = qr.getModuleCount();
    const quiet = 4;
    let d = "";
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c + quiet} ${r + quiet}h1v1h-1z`;
    }
    const size = n + quiet * 2;
    return `<svg class="qr" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" role="img" aria-label="QR code"><rect width="${size}" height="${size}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
  }

  // ---------- State ⇄ URL hash

  function readHash() {
    const [path = "", query = ""] = location.hash.replace(/^#\/?/, "").split("?");
    const params = new URLSearchParams(query);
    const sceneId = SCENES[path] ? path : null;
    const choices = {};
    if (sceneId) {
      SCENES[sceneId].blanks.forEach((b) => {
        const v = params.get(b.key);
        if (v) choices[b.key] = v;
      });
    }
    const role = sceneId && roleById(SCENES[sceneId], params.get("role")) ? params.get("role") : null;
    return {
      view: path === "qr" ? "qr" : sceneId ? "scene" : "home",
      sceneId,
      choices,
      role,
      tab: params.get("tab") === "all" ? "all" : "mine",
    };
  }

  function hashFor(s, { share = false } = {}) {
    if (s.view === "qr") return "#/qr";
    if (!s.sceneId) return "#/";
    const params = new URLSearchParams();
    SCENES[s.sceneId].blanks.forEach((b) => {
      const v = (s.choices[b.key] || "").trim();
      if (v) params.set(b.key, v);
    });
    if (!share && s.role) {
      params.set("role", s.role);
      if (s.tab === "all") params.set("tab", "all");
    }
    const q = params.toString();
    return `#/${s.sceneId}${q ? `?${q}` : ""}`;
  }

  let state = readHash();
  const ui = { editing: null };

  /** Updates state and the URL. push=true adds a history step (the phone's Back button returns to it). */
  function commit(next, { push = false, rerender = true } = {}) {
    state = { ...state, ...next };
    const hash = hashFor(state);
    if (hash !== location.hash) history[push ? "pushState" : "replaceState"](null, "", hash);
    if (rerender) render();
  }

  function syncFromUrl() {
    const next = readHash();
    if (hashFor(next) === hashFor(state) && next.view === state.view) return;
    if (next.sceneId !== state.sceneId || !next.role) ui.editing = null;
    state = next;
    render();
  }

  // ---------- Speech

  const speech = {
    voice: null,
    supported: "speechSynthesis" in window,
    init() {
      if (!this.supported) return;
      const pick = () => {
        const voices = speechSynthesis.getVoices();
        this.voice = voices.find((v) => v.lang === "en-US") || voices.find((v) => v.lang.startsWith("en")) || null;
      };
      pick();
      speechSynthesis.addEventListener("voiceschanged", pick);
    },
    say(text, pitch, onend) {
      if (!this.supported) return onend();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-US";
      u.rate = 0.85;
      u.pitch = pitch;
      if (this.voice) u.voice = this.voice;
      u.onend = u.onerror = onend;
      speechSynthesis.speak(u);
    },
    cancel() {
      if (this.supported) speechSynthesis.cancel();
    },
  };

  /** Plays a queue of { text, pitch, el }; the element being read gets .playing. */
  const player = {
    token: 0,
    clear() {
      document.querySelectorAll(".playing").forEach((el) => el.classList.remove("playing"));
    },
    stop() {
      this.token++;
      speech.cancel();
      this.clear();
    },
    play(items, onDone = () => {}) {
      this.stop();
      const token = this.token;
      let i = 0;
      const next = () => {
        if (token !== this.token) return;
        this.clear();
        if (i >= items.length) return onDone();
        const item = items[i++];
        if (item.el) {
          item.el.classList.add("playing");
          item.el.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
        speech.say(item.text, item.pitch, next);
      };
      next();
    },
  };

  const timer = {
    id: null,
    startedAt: 0,
    stop() {
      clearInterval(this.id);
      this.id = null;
    },
    toggle(btn) {
      const out = btn.querySelector(".time");
      if (this.id) {
        this.stop();
        btn.classList.remove("running");
        return;
      }
      this.startedAt = Date.now();
      btn.classList.add("running");
      btn.classList.remove("over");
      const tick = () => {
        const s = Math.floor((Date.now() - this.startedAt) / 1000);
        out.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
        btn.classList.toggle("over", s > TARGET_SECONDS);
      };
      tick();
      this.id = setInterval(tick, 250);
    },
  };

  // ---------- Components

  const listenButton = (index) =>
    `<button class="listen" data-action="listen" data-line="${index}" aria-label="Listen">${ICON.speak}</button>`;

  const actNote = (line) =>
    line.act ? `<div class="act">${esc(line.act[0])} <span class="zh">${esc(line.act[1])}</span></div>` : "";

  const lineText = (scene, line) =>
    `<div class="en">${fill(scene, line.en, state.choices)}</div><div class="zh">${fill(scene, line.zh, state.choices, "zh")}</div>`;

  const backButton = (action, label, zh) =>
    `<button class="back" data-action="${action}">${ICON.back}<span>${label}</span><span class="zh">${zh}</span></button>`;

  const titleBlock = (title, zh, tag = "h1") =>
    `<div class="title"><${tag}>${esc(title)}</${tag}><span class="zh">${esc(zh)}</span></div>`;

  function sceneCard(id, scene) {
    return `
      <a class="scene-card" href="#/${id}">
        <span class="scene-icon">${ICON[scene.icon]}</span>
        <span class="word">${esc(scene.title)}</span>
        <span class="zh">${esc(scene.zh)}</span>
        <span class="meta">4 roles · about ${TARGET_SECONDS} seconds</span>
      </a>`;
  }

  function chip(blank, en, zh, selected) {
    const showZh = zh && zh !== en;
    return `<button class="chip${selected ? " on" : ""}" data-action="pick" data-key="${blank.key}" data-value="${esc(en)}" aria-pressed="${selected}">
      ${esc(en)}${showZh ? `<span class="zh">${esc(zh)}</span>` : ""}</button>`;
  }

  function blankPicker(blank) {
    const value = state.choices[blank.key] || "";
    const idea = value && ideaFor(blank, value);
    const typed = value && !idea ? value : "";
    const hasIdeas = blank.ideas && blank.ideas.length;
    return `
      <div class="blank" data-blank="${blank.key}">
        <div class="blank-head"><span class="key">${blank.key}</span><span class="label">${esc(blank.label)}</span><span class="zh">${esc(blank.zh)}</span></div>
        ${hasIdeas ? `<div class="chips">${blank.ideas.map(([en, zh]) => chip(blank, en, zh, idea && idea[0] === en)).join("")}</div>` : ""}
        <input class="other${typed ? " on" : ""}" data-key="${blank.key}" value="${esc(typed)}" maxlength="40"
          ${blank.number ? 'inputmode="numeric"' : 'autocapitalize="words"'}
          placeholder="${hasIdeas ? "Or type your own 或自己輸入" : "Type it here 在這裡輸入"}">
      </div>`;
  }

  function choiceSummary(scene) {
    return `<div class="summary">${scene.blanks
      .map((b) => `<span class="pill"><b>${b.key}</b> ${esc(state.choices[b.key] || "____")}</span>`)
      .join("")}</div>`;
  }

  function missingNote(scene) {
    const missing = missingBlanks(scene, state.choices);
    return missing.length
      ? `Still empty: ${missing.map((b) => b.key).join(", ")} <span class="zh">還沒選</span>`
      : `All words chosen! <span class="zh">詞都選好了！</span>`;
  }

  function roleButton(scene, role) {
    const count = scene.lines.filter((l) => l.by.includes(role.id)).length;
    return `
      <button class="role" data-action="role" data-role="${role.id}">
        <span class="role-name">${esc(role.name)}</span>
        <span class="zh">${esc(role.zh)}</span>
        <span class="meta">${count} lines</span>
      </button>`;
  }

  function myLineCard(scene, line, index) {
    const prev = scene.lines[index - 1];
    const cue = prev
      ? `<span class="cue-label">When you hear <span class="zh">聽到</span></span><b>${esc(speakers(scene, prev))}:</b> “${fill(scene, prev.en, state.choices)}”`
      : `<span class="cue-label">Start <span class="zh">開始</span></span>You speak first. <span class="zh">你先說。</span>`;
    return `
      <article class="line-card">
        <div class="cue">${cue}</div>
        <div class="say mine" data-row="${index}">
          <div class="line">${actNote(line)}${lineText(scene, line)}</div>
          ${listenButton(index)}
        </div>
      </article>`;
  }

  function sceneRow(scene, line, index) {
    const mine = line.by.includes(state.role);
    return `
      <div class="say row${mine ? " mine" : ""}" data-row="${index}">
        <span class="num">${index + 1}</span>
        <div class="line"><div class="who">${esc(speakers(scene, line))}${mine ? ' <span class="you">YOU</span>' : ""}</div>${actNote(line)}${lineText(scene, line)}</div>
        ${listenButton(index)}
      </div>`;
  }

  function openQrModal(url, heading, zh) {
    modalRoot.innerHTML = `
      <div class="backdrop" data-close>
        <div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(heading)}">
          ${titleBlock(heading, zh, "h2")}
          ${qrSvg(url)}
          <p class="hint">Scan with your phone camera. <span class="zh">用手機相機掃描。</span></p>
          <div class="sheet-actions">
            <button class="btn ghost" data-copy>Copy link <span class="zh">複製連結</span></button>
            <button class="btn" data-close>Close <span class="zh">關閉</span></button>
          </div>
        </div>
      </div>`;
    modalRoot.onclick = (e) => {
      const copy = e.target.closest("[data-copy]");
      if (copy) {
        navigator.clipboard?.writeText(url).then(() => (copy.innerHTML = 'Copied! <span class="zh">已複製</span>'));
      } else if (e.target.matches("[data-close]") || e.target.closest("button[data-close]")) {
        modalRoot.innerHTML = "";
      }
    };
  }

  // ---------- Views

  function homeView() {
    return `
      <header class="top">${titleBlock("Role-Play Practice", "角色扮演練習")}</header>
      <p class="lead">Choose your scene. <span class="zh">選擇你們的場景。</span></p>
      <div class="scenes">${Object.entries(SCENES).map(([id, s]) => sceneCard(id, s)).join("")}</div>
      <button class="btn ghost wide" data-action="class-qr">${ICON.qr} Show class QR code <span class="zh">顯示班級 QR code</span></button>`;
  }

  function classQrView() {
    return `
      <div class="bar">${backButton("home", "Home", "首頁")}</div>
      <section class="panel center">
        ${titleBlock("Scan to start", "掃描開始")}
        ${qrSvg(baseUrl())}
        <p class="url">${esc(baseUrl())}</p>
      </section>`;
  }

  function setupView(scene) {
    const complete = !missingBlanks(scene, state.choices).length;
    if (ui.editing === null) ui.editing = !complete;
    const words = ui.editing
      ? `<p class="hint">One person chooses, then shares with the group. <span class="zh">一個人選，再分享給組員。</span></p>
         ${scene.blanks.map(blankPicker).join("")}`
      : `<p class="hint">Your group's words: <span class="zh">你們組的詞：</span></p>
         ${choiceSummary(scene)}
         <button class="btn ghost" data-action="edit">Change words <span class="zh">修改</span></button>`;
    return `
      <div class="bar">${backButton("home", "Scenes", "場景")}</div>
      <header class="top">${titleBlock(scene.title, scene.zh)}</header>
      <section class="panel">
        <h2><span class="step">1</span> Choose your words <span class="zh">選擇你們的詞</span></h2>
        ${words}
        <button class="btn" data-action="share">${ICON.qr} Share with group <span class="zh">分享給組員</span></button>
      </section>
      <section class="panel">
        <h2><span class="step">2</span> Choose your role <span class="zh">選擇你的角色</span></h2>
        <p class="missing">${missingNote(scene)}</p>
        <div class="roles">${scene.roles.map((r) => roleButton(scene, r)).join("")}</div>
      </section>`;
  }

  function roleView(scene) {
    const role = roleById(scene, state.role);
    const mine = state.tab === "mine";
    const body = mine
      ? scene.lines.map((l, i) => (l.by.includes(role.id) ? myLineCard(scene, l, i) : "")).join("")
      : `<div class="tools">
           <button class="btn" data-action="play-all"><span class="ico">${ICON.play}</span><span class="label">Play scene <span class="zh">播放</span></span></button>
           <button class="btn ghost timer" data-action="timer"><span class="time">0:00</span>&nbsp;/ 0:${TARGET_SECONDS}</button>
         </div>
         <div class="script">${scene.lines.map((l, i) => sceneRow(scene, l, i)).join("")}</div>`;
    return `
      <div class="bar">${backButton("roles", "Roles", "角色")}<span class="badge">${esc(role.name)} <span class="zh">${esc(role.zh)}</span></span></div>
      <header class="top">${titleBlock(scene.title, scene.zh)}</header>
      <div class="tabs" role="tablist">
        <button class="tab${mine ? " on" : ""}" role="tab" aria-selected="${mine}" data-action="tab" data-tab="mine">My lines <span class="zh">我的台詞</span></button>
        <button class="tab${mine ? "" : " on"}" role="tab" aria-selected="${!mine}" data-action="tab" data-tab="all">Whole scene <span class="zh">整個劇本</span></button>
      </div>
      ${body}
      <p class="tip">Speak slowly and clearly. Look at your partner. <span class="zh">說慢一點、清楚一點，看著你的搭檔。</span></p>`;
  }

  function render() {
    player.stop();
    timer.stop();
    modalRoot.innerHTML = "";
    const scene = state.sceneId && SCENES[state.sceneId];
    if (state.view === "qr") app.innerHTML = classQrView();
    else if (!scene) app.innerHTML = homeView();
    else app.innerHTML = state.role ? roleView(scene) : setupView(scene);
    document.title = scene ? `${scene.title} · Role-Play Practice` : "Role-Play Practice";
    window.scrollTo(0, 0);
  }

  // ---------- Partial updates while choosing words (keeps the keyboard open)

  function refreshBlank(key) {
    const scene = SCENES[state.sceneId];
    const blank = scene.blanks.find((b) => b.key === key);
    const value = state.choices[key] || "";
    const idea = value && ideaFor(blank, value);
    const box = app.querySelector(`[data-blank="${key}"]`);
    box.querySelectorAll(".chip").forEach((c) => {
      const on = !!idea && c.dataset.value === idea[0];
      c.classList.toggle("on", on);
      c.setAttribute("aria-pressed", on);
    });
    box.querySelector(".other").classList.toggle("on", !!value && !idea);
    app.querySelector(".missing").innerHTML = missingNote(scene);
  }

  // ---------- Events

  const actions = {
    home: () => commit({ view: "home", sceneId: null, choices: {}, role: null }, { push: true }),
    "class-qr": () => commit({ view: "qr", sceneId: null }, { push: true }),
    roles: () => commit({ role: null, tab: "mine" }, { push: true }),
    edit: () => {
      ui.editing = true;
      render();
    },
    pick: (el) => {
      commit({ choices: { ...state.choices, [el.dataset.key]: el.dataset.value } }, { rerender: false });
      app.querySelector(`.other[data-key="${el.dataset.key}"]`).value = "";
      refreshBlank(el.dataset.key);
    },
    share: () => {
      const scene = SCENES[state.sceneId];
      openQrModal(baseUrl() + hashFor(state, { share: true }), `${scene.title}: our words`, "掃描取得你們組的詞");
    },
    role: (el) => commit({ role: el.dataset.role, tab: "mine" }, { push: true }),
    tab: (el) => commit({ tab: el.dataset.tab }),
    listen: (el) => {
      const scene = SCENES[state.sceneId];
      const line = scene.lines[Number(el.dataset.line)];
      if (el.classList.contains("playing")) return player.stop();
      player.play([{ text: fill(scene, line.en, state.choices, "speech"), pitch: linePitch(scene, line), el }]);
    },
    "play-all": (el) => {
      const scene = SCENES[state.sceneId];
      const label = el.querySelector(".label");
      const reset = () => {
        el.classList.remove("on");
        el.querySelector(".ico").innerHTML = ICON.play;
        label.innerHTML = 'Play scene <span class="zh">播放</span>';
      };
      if (el.classList.contains("on")) {
        player.stop();
        return reset();
      }
      el.classList.add("on");
      el.querySelector(".ico").innerHTML = ICON.stop;
      label.innerHTML = 'Stop <span class="zh">停止</span>';
      const items = scene.lines.map((line, i) => ({
        text: fill(scene, line.en, state.choices, "speech"),
        pitch: linePitch(scene, line),
        el: app.querySelector(`[data-row="${i}"]`),
      }));
      player.play(items, reset);
    },
    timer: (el) => timer.toggle(el),
  };

  app.addEventListener("click", (e) => {
    const el = e.target.closest("[data-action]");
    if (el && actions[el.dataset.action]) actions[el.dataset.action](el);
  });

  app.addEventListener("input", (e) => {
    if (!e.target.matches(".other")) return;
    const key = e.target.dataset.key;
    commit({ choices: { ...state.choices, [key]: e.target.value } }, { rerender: false });
    refreshBlank(key);
  });

  addEventListener("keydown", (e) => {
    if (e.key === "Escape") modalRoot.innerHTML = "";
  });
  addEventListener("popstate", syncFromUrl);
  addEventListener("hashchange", syncFromUrl);

  speech.init();
  render();
})();
