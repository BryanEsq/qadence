// Minimal, expand as you see this in your data.
const APP_NAME_MAP = {
  "msedge.exe": "MS Edge",
  "chrome.exe": "Chrome",
  "outlook.exe": "Outlook",
  "olk.exe": "Outlook",
  "winword.exe": "Word",
  "excel.exe": "Excel",
  "powerpnt.exe": "PowerPoint",
  "teams.exe": "Microsoft Teams",
  "code.exe": "VS Code",
};

export function normalizeAppName(raw) {
  if (!raw) return "";
  const key = String(raw).toLowerCase();
  if (APP_NAME_MAP[key]) return APP_NAME_MAP[key];
  // fallback: strip .exe and Title-Case
  const base = key.replace(/\.exe$/, "");
  return base.charAt(0).toUpperCase() + base.slice(1);
}
