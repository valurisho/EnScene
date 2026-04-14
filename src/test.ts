import { fetchFromApi } from "./api";
import type { Movie } from "./types";

type DiscoverMoviesResponse = {
  results: Movie[];
};

const controller = new AbortController();
const signal = controller.signal;

const url = "https://api.themoviedb.org/3/discover/movie";
const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZDhiN2Y0Y2FkMzA2M2ZiYWQzNWFlZTZlOWJlYzkwMiIsIm5iZiI6MTc3NTA1ODMzMy41OTYsInN1YiI6IjY5Y2QzZDlkODRkYmExMDI3Mzg3YThmMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.B7wdF_8JyWlvUh_aVtd7PGg15HjSHdwYunP4GQwRQ6Q",
  },
  signal,
};

export default async function test(): Promise<Movie[]> {
  const result = await fetchFromApi<DiscoverMoviesResponse>(url, options);
  if (!result.ok) {
    throw new Error(
      `Request failed: ${result.error.kind} - ${"message" in result.error ? result.error.message : `${result.error.status} ${result.error.statusText}`}`,
    );
  }
  return result.data.results;
}
