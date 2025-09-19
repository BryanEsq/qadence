import { exec } from "child_process";
import dayjs from "dayjs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { insertSession } from "./db.js";
import { APP_NAME_MAP as _APP_NAME_MAP } from "./appNames.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let timer = null;
let current = null;
const POLL_MS = 5000; // 5 seconds

export function startTracker() {
  if (timer) return;
  console.log("🚀 Tracker started, polling every", POLL_MS, "ms");
  timer = setInterval(tick, POLL_MS);
}

export function stopTracker() {
  if (timer) {
    clearInterval(timer);
    timer = null;
    console.log("🛑 Tracker stopped");
  }
  commit(true);
}

// ---- Helpers ----
function normalizeApp(proc) {
  const key = (proc || "").toLowerCase();
  if (_APP_NAME_MAP && _APP_NAME_MAP[key]) return _APP_NAME_MAP[key];
  const base = key.replace(/\.exe$/, "");
  return base ? base.charAt(0).toUpperCase() + base.slice(1) : proc;
}

function cleanBrowserTitle(title) {
  if (!title) return title;
  return String(title)
    .replace(/\s*(?:-|–|—)?\s*and\s+\d+\s+(?:more\s+)?pages?$/i, "")
    .replace(/\s*(?:-|–|—)?\s*(Microsoft Edge|Google Chrome)\s*$/i, "")
    .replace(/\s*(?:-|–|—)?\s*(Profile|Person)\s*\d+\s*$/i, "")
    .replace(/\s*(?:\(\d+\s+tabs?\)|-(\s*)\d+\s+tabs?)\s*$/i, "")
    .trim();
}

function sameCtx(a, b) {
  if (!a || !b) return false;
  return a.app === b.app && a.title === b.title;
}

// ---- Main loop ----
async function tick() {
  try {
    const info = await getActiveWindow();
    if (!info) {
      console.log("⚠️ No active window info returned");
      return;
    }

    // Normalize + clean
    const rawProc = info.ProcessName || "Unknown";
    const app = normalizeApp(rawProc);
    let title = info.Title || "";

    if (/^(msedge\.exe|chrome\.exe)$/i.test(rawProc)) {
      title = cleanBrowserTitle(title);
    }

    const ctx = { app, title };
    const now = dayjs();

    if (!current) {
      current = { ctx, start: now };
      console.log("🟢 New session started:", ctx);
      return;
    }

    if (sameCtx(current.ctx, ctx)) {
      return; // still same app+title
    } else {
      console.log("🔄 Context changed → committing old session");
      commit(false);
      current = { ctx, start: now };
    }
  } catch (err) {
    console.error("❌ Tracker error:", err);
  }
}

// ---- Commit to DB ----
function commit(flush = false) {
  if (!current) return;
  const end = dayjs();
  const dur = end.diff(current.start, "second");

  if (dur >= 5) {
    console.log(
      `💾 Committing session: ${current.ctx.app} | ${current.ctx.title} | ${dur}s`
    );
    insertSession({
      app: current.ctx.app,
      title: current.ctx.title,
      file_path: '', // match DB column
      start: current.start.valueOf(),
      end: end.valueOf(),
      duration: dur
  });

  } else {
    console.log("⏭️ Ignoring short session (<5s)");
  }

  current = flush ? null : null;
}

// ---- Active window getter ----
function getActiveWindow() {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, "get-active-window.ps1");
    exec(
      `powershell -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}"`,
      { windowsHide: true },
      (err, stdout, stderr) => {
        if (err) {
          console.error("⚠️ PowerShell exec error:", err);
          return reject(err);
        }
        if (stderr && stderr.trim()) {
          console.error("⚠️ PowerShell stderr:", stderr);
        }

        try {
          const trimmed = stdout.trim();
          if (!trimmed) return resolve(null);
          resolve(JSON.parse(trimmed));
        } catch (e) {
          console.error("❌ JSON parse failed, raw was:", stdout);
          resolve(null);
        }
      }
    );
  });
}
