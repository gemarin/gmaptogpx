let config = null;
const API_BASE = "https://gmaptogpx.onrender.com";

export async function loadConfig() {
  const res = await fetch(`${API_BASE}/config`);
  config = await res.json();
}

export function getApiUrl() {
  if (!config) throw new Error("API config not loaded");
  return `${API_BASE}:${config.apiPort}`;
}
