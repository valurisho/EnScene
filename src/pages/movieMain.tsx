import { useEffect, useReducer, useState } from "react";
import { asyncReducer, type AsyncState } from "../asyncState";
import { createTmdbRequestInit, fetchFromApi } from "../api";
import { toMovieSummary } from "../movieAdapters";
import type { DiscoverMoviesResponse, MovieSummary } from "../types";
import PopularMovies from "../components/popularMovies";
import SearchResults from "../components/searchResults";

export default function MovieMain() {
  const [searchText, setSearchText] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [reloadToken, setReloadToken] = useState(0);
  const [state, dispatch] = useReducer(asyncReducer<MovieSummary[]>, {
    status: "idle",
  } as AsyncState<MovieSummary[]>);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(searchText.trim());
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovies() {
      dispatch({ type: "loadStart" });

      const response = await fetchFromApi<DiscoverMoviesResponse>(
        "https://api.themoviedb.org/3/discover/movie?include_adult=false&sort_by=popularity.desc",
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
  }, [reloadToken]);

  switch (state.status) {
    case "idle":
      return (
        <main className="movie-app">
          <div className="status-panel">
            <p>Loading movies...</p>
          </div>
        </main>
      );
    case "error":
      return (
        <>
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
        </>
      );
    case "loading":
      return (
        <>
          <div className="status-panel">
            <p>Loading trending movies...</p>
          </div>
        </>
      );
    case "success":
      return (
        <>
          <div className="movie-page__intro">
            <p className="movie-app__subtitle">
              Browse popular movies, search the catalog, and save personal
              favorites to revisit later.
            </p>
          </div>
          <input
            className="movie-app__search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search movies..."
          />
          {debouncedQuery === "" ? (
            <PopularMovies emptyMessage="No discover movies are available right now." movieList={state.data} />
          ) : (
            <SearchResults query={debouncedQuery} />
          )}
        </>
      );
  }
}
