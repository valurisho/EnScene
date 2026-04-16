import { useEffect, useReducer, useState } from "react";
import { asyncReducer, type AsyncState } from "../asyncState";
import { createTmdbRequestInit, fetchFromApi } from "../api";
import { toMovieSummary } from "../movieAdapters";
import { useSearch } from "../hooks/useSearch";
import type { DiscoverMoviesResponse, MovieSummary } from "../types";
import PopularMovies from "../components/popularMovies";
import SearchResults from "../components/searchResults";
import MainTabs from "../components/mainTabs";
import SearchBar from "../components/searchBar";

const QUICK_GENRES: Array<{ label: string; id: number }> = [
  { label: "Action", id: 28 },
  { label: "Drama", id: 18 },
  { label: "Sci-Fi", id: 878 },
  { label: "Horror", id: 27 },
  { label: "Romance", id: 10749 },
];

function buildDiscoverUrl(genreId: number | null): string {
  const base =
    "https://api.themoviedb.org/3/discover/movie?include_adult=false&sort_by=popularity.desc";
  if (genreId === null) {
    return base;
  }
  return `${base}&with_genres=${genreId}`;
}

export default function MovieMain() {
  const { debouncedQuery, searchText, setSearchText } = useSearch();
  const [reloadToken, setReloadToken] = useState(0);
  const [genreId, setGenreId] = useState<number | null>(null);
  const [state, dispatch] = useReducer(asyncReducer<MovieSummary[]>, {
    status: "idle",
  } as AsyncState<MovieSummary[]>);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovies() {
      dispatch({ type: "loadStart" });

      const response = await fetchFromApi<DiscoverMoviesResponse>(
        buildDiscoverUrl(genreId),
        createTmdbRequestInit(controller.signal),
      );

      if (controller.signal.aborted) {
        return;
      }

      if (!response.ok) {
        if (response.error.kind === "http") {
          dispatch({
            type: "loadError",
            message: `HTTP ${response.error.status}: ${response.error.statusText || "Request failed"}`,
          });
          return;
        }

        dispatch({ type: "loadError", message: response.error.message });
        return;
      }

      dispatch({
        type: "loadSuccess",
        data: response.data.results.map(toMovieSummary),
      });
    }

    void loadMovies();

    return () => controller.abort();
  }, [reloadToken, genreId]);

  const showDiscover = debouncedQuery === "";

  return (
    <>
      <MainTabs />

      <SearchBar
        onChange={setSearchText}
        placeholder="Search for movies..."
        value={searchText}
        variant="dark"
      />

      <div className="movie-app__quick-row">
        <span className="movie-app__quick-label">Quick:</span>
        <div className="movie-app__quick-filters" role="group" aria-label="Genre filters">
          {QUICK_GENRES.map((g) => {
            const isActive = genreId === g.id;
            return (
              <button
                className={`movie-app__quick-pill ${isActive ? "movie-app__quick-pill--active" : ""}`}
                key={g.label}
                onClick={() => setGenreId((current) => (current === g.id ? null : g.id))}
                type="button"
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      {state.status === "error" && (
        <div className="status-panel status-panel--error">
          <p>{state.message}</p>
          <button
            className="movie-card__button"
            onClick={() => setReloadToken((current) => current + 1)}
            type="button"
          >
            Retry request
          </button>
        </div>
      )}

      {(state.status === "idle" || state.status === "loading") && showDiscover && (
        <div className="status-panel status-panel--muted">
          <p>Loading movies...</p>
        </div>
      )}

      {state.status === "success" && showDiscover && (
        <PopularMovies emptyMessage="No discover movies are available right now." movieList={state.data} />
      )}

      {!showDiscover && <SearchResults query={debouncedQuery} />}
    </>
  );
}
