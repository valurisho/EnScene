export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: FetchError };

export type FetchError =
  | { kind: "network"; message: string }
  | { kind: "http"; status: number; statusText: string }
  | { kind: "parse"; message: string };

const TMDB_ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export function createTmdbRequestInit(signal?: AbortSignal): RequestInit {
  if (!TMDB_ACCESS_TOKEN) {
    throw new Error(
      "Missing TMDB access token. Set VITE_TMDB_ACCESS_TOKEN in .env.local before running the app.",
    );
  }

  return {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
    },
    signal,
  };
}

//just retunrs the posted path based on the url
export function buildMovieImageUrl(
  posterPath: string | null,
  size: "w342" | "w500" | "w780" | "w1280" | "original" = "w342",
): string | null {
  if (!posterPath) {
    return null;
  }

  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
}

export async function fetchFromApi<T>(
  url: string,
  options: RequestInit = {},
): Promise<Result<T>> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      return {
        ok: false,
        error: { kind: "http", status: res.status, statusText: res.statusText },
      };
    }
    try {
      const data: T = await res.json();
      return { ok: true, data};
    } catch (err) {
      return { ok: false, error: { kind: "parse", message: String(err) } };
    }
  } catch (err) {
    return { ok: false, error: { kind: "network", message: String(err) } };
  }
}
