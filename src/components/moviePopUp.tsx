import { useEffect, useReducer, useState } from "react";
import { asyncReducer, type AsyncState } from "../asyncState";
import {
  buildMovieImageUrl,
  createTmdbRequestInit,
  fetchFromApi,
} from "../api";
import FavoriteRatingDialog from "./favoriteRatingDialog";
import { useFavorites } from "../hooks/useFavorites";
import { toMovieDetails } from "../movieAdapters";
import type {
  FavoriteMovie,
  MovieDetails,
  MovieDetailsResponse,
  MovieSummary,
} from "../types";

type MoviePopUpProps = {
  movieId: number | null;
  onClose: () => void;
};

function formatRuntime(runtime: number | null): string {
  if (!runtime) {
    return "Runtime unavailable";
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  if (hours === 0) {
    return `${minutes}m`;
  }

  return `${hours}h ${minutes}m`;
}

function getReleaseYear(releaseDate: string): string {
  return releaseDate ? releaseDate.slice(0, 4) : "Year unknown";
}

function toMovieSummary(movie: MovieDetails): MovieSummary {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.originalTitle,
    posterPath: movie.posterPath,
    backdropPath: movie.backdropPath,
    overview: movie.overview,
    releaseDate: movie.releaseDate,
    voteAverage: movie.voteAverage,
    voteCount: movie.voteCount,
  };
}

export default function MoviePopUp({ movieId, onClose }: MoviePopUpProps) {
  const [reloadToken, setReloadToken] = useState(0);
  const [isRatingMode, setIsRatingMode] = useState(false);
  const [personalRating, setPersonalRating] = useState(3);
  const { favoriteMovies, isFavorite, removeFavorite, saveFavorite } =
    useFavorites();
  const [state, dispatch] = useReducer(asyncReducer<MovieDetails>, {
    status: "idle",
  } as AsyncState<MovieDetails>);

  useEffect(() => {
    if (movieId === null) {
      dispatch({ type: "reset" });
      return;
    }

    const controller = new AbortController();

    async function loadMovieDetails() {
      dispatch({ type: "loadStart" });

      const response = await fetchFromApi<MovieDetailsResponse>(
        `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits`,
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

      dispatch({ type: "loadSuccess", data: toMovieDetails(response.data) });
    }

    void loadMovieDetails();

    return () => controller.abort();
  }, [movieId, reloadToken]);

  useEffect(() => {
    setIsRatingMode(false);
    setPersonalRating(3);
  }, [movieId]);

  if (movieId === null) {
    return null;
  }

  const movie = state.status === "success" ? state.data : null;
  const posterUrl = movie ? buildMovieImageUrl(movie.posterPath, "w500") : null;
  const backdropUrl = movie
    ? buildMovieImageUrl(movie.backdropPath, "w780")
    : null;
  const favoriteCandidate = movie ? toMovieSummary(movie) : null;
  const movieIsFavorite = movie ? isFavorite(movie.id) : false;
  const existingFavorite: FavoriteMovie | undefined = movie
    ? favoriteMovies.find((favorite) => favorite.movieId === movie.id)
    : undefined;

  function startRatingMode() {
    setPersonalRating(existingFavorite?.personalRating || 3);
    setIsRatingMode(true);
  }

  function handleSaveFavorite() {
    if (!favoriteCandidate) {
      return;
    }

    saveFavorite(favoriteCandidate, personalRating);
    setIsRatingMode(false);
  }

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <section
        aria-labelledby="movie-dialog-title"
        aria-modal="true"
        className="dialog dialog--fullscreen"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div
          className="dialog__backdrop-hero"
          style={
            backdropUrl
              ? { backgroundImage: `linear-gradient(180deg, rgba(8, 8, 8, 0.08), rgba(8, 8, 8, 0.86)), url(${backdropUrl})` }
              : undefined
          }
        >
          <div className="dialog__header">
            <p className="dialog__eyebrow">Movie details</p>
            <button className="dialog__close" onClick={onClose} type="button">
              Close
            </button>
          </div>
        </div>

        {state.status === "loading" || state.status === "idle" ? (
          <div className="status-panel">
            <p>Loading movie details...</p>
          </div>
        ) : null}

        {state.status === "error" ? (
          <div className="status-panel status-panel--error">
            <p>{state.message}</p>
            <button
              className="movie-card__button"
              onClick={() => setReloadToken((current) => current + 1)}
              type="button"
            >
              Retry
            </button>
          </div>
        ) : null}

        {movie ? (
          <div className="dialog__sheet">
            <div className="dialog__body">
            {posterUrl ? (
              <img
                alt={`${movie.title} poster`}
                className="dialog__poster"
                src={posterUrl}
              />
            ) : (
              <div className="dialog__poster dialog__poster--placeholder">
                Poster unavailable
              </div>
            )}

            <div className="dialog__content">
              {isRatingMode ? (
                <FavoriteRatingDialog
                  movieTitle={movie.title}
                  onCancel={() => setIsRatingMode(false)}
                  onRatingChange={setPersonalRating}
                  onSave={handleSaveFavorite}
                  rating={personalRating}
                />
              ) : (
                <>
                  <div className="dialog__hero">
                    <h2 id="movie-dialog-title" className="dialog__title">
                      {movie.title}
                    </h2>
                    <div className="dialog__meta">
                      <span>{getReleaseYear(movie.releaseDate)}</span>
                      <span>{movie.director || "Director unavailable"}</span>
                    </div>
                    <div className="dialog__facts">
                      <span>{formatRuntime(movie.runtime)}</span>
                      <span>{movie.voteAverage.toFixed(1)} / 10</span>
                      {existingFavorite ? (
                        <span>Your rating: {existingFavorite.personalRating} / 5</span>
                      ) : null}
                    </div>
                  </div>

                  <p className="dialog__overview">
                    {movie.overview || "No overview available for this movie yet."}
                  </p>

                  <div className="dialog__tags">
                    {movie.genres.length > 0 ? (
                      movie.genres.map((genre) => (
                        <span className="dialog__tag" key={genre}>
                          {genre}
                        </span>
                      ))
                    ) : (
                      <span className="dialog__tag">Genres unavailable</span>
                    )}
                  </div>

                  <div className="dialog__actions">
                    {movieIsFavorite ? (
                      <>
                        <button
                          className="movie-card__button"
                          onClick={startRatingMode}
                          type="button"
                        >
                          Edit rating
                        </button>
                        <button
                          className="movie-card__button movie-card__button--secondary"
                          onClick={() => removeFavorite(movie.id)}
                          type="button"
                        >
                          Remove favorite
                        </button>
                      </>
                    ) : (
                      <button
                        className="movie-card__button"
                        onClick={startRatingMode}
                        type="button"
                      >
                        Add to favorites
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
