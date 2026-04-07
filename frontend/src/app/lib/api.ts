type ApiError = Error & { status?: number; details?: unknown };

const API_BASE_URL: string =
  // Vite env (recommended): VITE_API_BASE_URL="http://localhost:8080"
  (import.meta as any)?.env?.VITE_API_BASE_URL ??
  // Fallback for local dev
  "http://localhost:8080";

export async function apiFetch<T>(
  path: string,
  init?: RequestInit & { json?: unknown }
): Promise<T> {
  const headers = new Headers(init?.headers);
  if (init?.json !== undefined) headers.set("content-type", "application/json");

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
  });

  if (!res.ok) {
    const err: ApiError = new Error(`Request failed: ${res.status} ${res.statusText}`);
    err.status = res.status;
    try {
      err.details = await res.json();
    } catch {
      // ignore non-JSON error bodies
    }
    throw err;
  }

  return (await res.json()) as T;
}

