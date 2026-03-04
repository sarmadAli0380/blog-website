const API_BASE = process.env.REACT_APP_API_URL ;

const TOKEN_KEY = "blogify_token";

export const auth = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
  isLoggedIn() {
    return !!localStorage.getItem(TOKEN_KEY);
  },
};

function escapeHtml(str = "") {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toSafeHtmlContent(content = "") {
  const trimmed = content.trim();
  const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(trimmed);
  if (looksLikeHtml) return trimmed;
  return `<p>${escapeHtml(trimmed).replaceAll("\n", "<br/>")}</p>`;
}

function normalizeBlog(b) {
  return {
    id: b._id,
    title: b.title,
    description: b.description,
    image: b.image || "https://via.placeholder.com/600x300",
    content: toSafeHtmlContent(b.content || ""),
    author: b?.author?.name || "Unknown",
    date: b.createdAt || new Date().toISOString(),
  };
}

async function apiFetch(path, options = {}) {
  const token = auth.getToken();
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  let data;
  const text = await res.text();
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  async signup({ name, email, password }) {
    return apiFetch("/api/users/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },
  async login({ email, password }) {
    return apiFetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  async me() { return apiFetch("/api/users/me"); },
  async getBlogs() {
    const data = await apiFetch("/api/blogs");
    return Array.isArray(data) ? data.map(normalizeBlog) : [];
  },
  async getBlogById(id) {
    const b = await apiFetch(`/api/blogs/${id}`);
    return normalizeBlog(b);
  },
  async createBlog({ title, description, content, image }) {
    const payload = { title, description, content, image: image || "https://via.placeholder.com/600x300" };
    const created = await apiFetch("/api/blogs", { method: "POST", body: JSON.stringify(payload) });
    return normalizeBlog(created?.data || created);
  },
};