import { useEffect, useReducer, useState } from "react";
import { asyncReducer, type AsyncState } from "../asyncState";
import type { DiscoverMoviesResponse, MovieSummary } from "../types";
import { createTmdbRequestInit, fetchFromApi } from "../api";
import { toMovieSummary } from "../movieAdapters";
import PopularMovies from "./popularMovies";

type Props = {
  query: string;
};

export default function SearchResults({ query }: Props) {
  const [reloadToken, setReloadToken] = useState(0);
  const [state, dispatch] = useReducer(asyncReducer<MovieSummary[]>, {
    status: "idle",
  } as AsyncState<MovieSummary[]>);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovies() {
      dispatch({ type: "loadStart" });

      const response = await fetchFromApi<DiscoverMoviesResponse>(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`,
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
  }, [query, reloadToken]);

  switch (state.status) {
    case "idle":
    case "loading":
      return (
        <div className="status-panel">
          <p>Loading search results...</p>
        </div>
      );

    case "error":
      return (
        <div className="status-panel status-panel--error">
          <p>{state.message}</p>
          <button
            className="movie-card__button"
            onClick={() => setReloadToken((current) => current + 1)}
            type="button"
          >
            Retry search
          </button>
        </div>
      );

    case "success":
      return (
        <PopularMovies
          emptyMessage={`No movies matched "${query}".`}
          movieList={state.data}
        />
      );
  }
}
