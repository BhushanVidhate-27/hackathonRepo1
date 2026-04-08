type ApiError = Error & { status?: number; details?: unknown };
type ApiBlobResponse = { blob: Blob; filename?: string };

function normalizeBaseUrl(base: string) {
  const trimmed = (base || "").trim();
  if (!trimmed) return "";
  return trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed;
}

const API_BASE_URL: string = (() => {
  // Vite env (recommended for dev): VITE_API_BASE_URL="http://localhost:8080"
  const envBase = (import.meta as any)?.env?.VITE_API_BASE_URL as string | undefined;
  if (envBase) return normalizeBaseUrl(envBase);

  // Dev fallback: talk directly to local backend.
  // Some environments may not expose import.meta.env.DEV reliably; treat localhost as dev too.
  const isViteDev = Boolean((import.meta as any)?.env?.DEV);
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
  if (isViteDev || isLocalhost) return "http://localhost:8080";

  // Prod fallback: same-origin (works behind a reverse proxy / single host deploy).
  return "";
})();

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

export async function apiFetchBlob(
  path: string,
  init?: RequestInit & { json?: unknown }
): Promise<ApiBlobResponse> {
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

  const disposition = res.headers.get("content-disposition") || "";
  const match = disposition.match(/filename="([^"]+)"/);

  return { blob: await res.blob(), filename: match?.[1] };
}

