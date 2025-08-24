const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4033';

export async function api(path, { method = 'GET', body, headers = {} } = {}) {
  const res = await fetch(API_BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error || 'API error');
  }
  return data;
}
