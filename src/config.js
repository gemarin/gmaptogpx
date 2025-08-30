let config = null;
const API_BASE =
  "https://gmaptogpx.onrender.com" ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:9001";

export async function loadConfig() {
  const res = await fetch(`${API_BASE}/config`);
  config = await res.json();
}

export function getApiUrl() {
  if (!config) throw new Error("API config not loaded");
  return `http://localhost:${config.apiPort}`;
}
