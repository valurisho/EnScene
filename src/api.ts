export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: FetchError };

export type FetchError =
  | { kind: "network"; message: string }
  | { kind: "http"; status: number; statusText: string }
  | { kind: "parse"; message: string };

  
//basically returns a Promise which result has a unknown type
// signal?: AbortSignal

//request init is the type of the second parameter of fetch, which is an object that can have method, headers, body, etc.
export async function fetchFromApi<T>(url: string, options: RequestInit = {}): Promise<Result<T>> {
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
