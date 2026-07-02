// Base URL of the backend API.
// In dev, this is empty and Vite's proxy (vite.config.js) forwards /api to localhost:5000.
// In production (Vercel), set VITE_API_URL to your deployed Render backend URL,
// e.g. https://creditlens-backend.onrender.com
export const API_BASE = import.meta.env.VITE_API_URL || "";

export function apiUrl(path) {
  return `${API_BASE}${path}`;
}
