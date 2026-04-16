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

function BackIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="22"
      viewBox="0 0 24 24"
      width="22"
    >
      <path
        d="M15 18 9 12l6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function MoviePopUp({ movieId, onClose }: MoviePopUpProps) {
  if (movieId === null) {
    return null;
  }

  return <MoviePopUpContent key={movieId} movieId={movieId} onClose={onClose} />;
}

function MoviePopUpContent({ movieId, onClose }: { movieId: number; onClose: () => void }) {
  const [reloadToken, setReloadToken] = useState(0);
  const [isRatingMode, setIsRatingMode] = useState(false);
  const [personalRating, setPersonalRating] = useState(3);
  const { favoriteMovies, isFavorite, removeFavorite, saveFavorite } =
    useFavorites();
  const [state, dispatch] = useReducer(asyncReducer<MovieDetails>, {
    status: "idle",
  } as AsyncState<MovieDetails>);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovieDetails() {
      dispatch({ type: "loadStart" });

      let response;
      try {
        response = await fetchFromApi<MovieDetailsResponse>(
          `https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits`,
          createTmdbRequestInit(controller.signal),
        );
      } catch (error) {
        dispatch({ type: "loadError", message: String(error) });
        return;
      }

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

  const movie = state.status === "success" ? state.data : null;
  const posterUrl = movie ? buildMovieImageUrl(movie.posterPath, "w500") : null;
  const backdropUrl = movie
    ? buildMovieImageUrl(movie.backdropPath, "w1280")
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

  const heroStyle =
    backdropUrl !== null
      ? {
          backgroundImage: `linear-gradient(
            to bottom,
            rgba(10, 10, 10, 0.05) 0%,
            rgba(10, 10, 10, 0.55) 55%,
            #0a0a0a 100%
          ), url(${backdropUrl})`,
        }
      : undefined;

  return (
    <div
      className="dialog-backdrop dialog-backdrop--cinematic"
      onClick={onClose}
      role="presentation"
    >
      <section
        aria-labelledby="movie-dialog-title"
        aria-modal="true"
        className="dialog dialog--fullscreen dialog--cinematic"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div
          className="dialog__backdrop-hero dialog__backdrop-hero--cinematic"
          style={heroStyle}
        >
          <button
            aria-label="Go back"
            className="dialog__hero-back"
            onClick={onClose}
            type="button"
          >
            <BackIcon />
          </button>
        </div>

        <div className="dialog__sheet--cinematic">
          {state.status === "loading" || state.status === "idle" ? (
            <div className="dialog__status dialog__status--cinematic">
              <p>Loading movie details...</p>
            </div>
          ) : null}

          {state.status === "error" ? (
            <div className="dialog__status dialog__status--cinematic dialog__status--error">
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

          {movie && isRatingMode ? (
            <div className="dialog__rating-panel">
              <FavoriteRatingDialog
                movieTitle={movie.title}
                onCancel={() => setIsRatingMode(false)}
                onRatingChange={setPersonalRating}
                onSave={handleSaveFavorite}
                rating={personalRating}
              />
            </div>
          ) : null}

          {movie && !isRatingMode ? (
            <div className="dialog__body--cinematic">
              <div className="dialog__poster-column">
                {posterUrl ? (
                  <img
                    alt={`${movie.title} poster`}
                    className="dialog__poster dialog__poster--framed"
                    src={posterUrl}
                  />
                ) : (
                  <div className="dialog__poster dialog__poster--framed dialog__poster--placeholder">
                    Poster unavailable
                  </div>
                )}
              </div>

              <div className="dialog__main-column">
                <div className="dialog__title-block">
                  <h2
                    className="dialog__title dialog__title--cinematic"
                    id="movie-dialog-title"
                  >
                    {movie.title}
                  </h2>
                  <p className="dialog__title-meta">
                    <span>{getReleaseYear(movie.releaseDate)}</span>
                    <span className="dialog__title-meta-sep">·</span>
                    <span>
                      Directed by {movie.director || "Unknown"}
                    </span>
                  </p>
                </div>

                {movie.tagline ? (
                  <p className="dialog__tagline">{movie.tagline}</p>
                ) : null}

                <p className="dialog__overview dialog__overview--cinematic">
                  {movie.overview ||
                    "No overview available for this movie yet."}
                </p>

                <div className="dialog__tags dialog__tags--cinematic">
                  {movie.genres.length > 0 ? (
                    movie.genres.map((genre) => (
                      <span className="dialog__tag dialog__tag--cinematic" key={genre}>
                        {genre}
                      </span>
                    ))
                  ) : (
                    <span className="dialog__tag dialog__tag--cinematic">
                      Genres unavailable
                    </span>
                  )}
                </div>
              </div>

              <aside className="dialog__aside" aria-label="Movie actions">
                <div className="dialog__widget">
                  <div className="dialog__widget-row">
                    <span className="dialog__widget-label">Runtime</span>
                    <span className="dialog__widget-value">
                      {formatRuntime(movie.runtime)}
                    </span>
                  </div>
                  <div className="dialog__widget-row">
                    <span className="dialog__widget-label">TMDB score</span>
                    <span className="dialog__widget-value dialog__widget-value--accent">
                      ★ {movie.voteAverage.toFixed(1)} / 10
                    </span>
                  </div>
                  <hr className="dialog__widget-rule" />
                  {movieIsFavorite && existingFavorite ? (
                    <p className="dialog__widget-note">
                      Your rating: {existingFavorite.personalRating} / 5
                    </p>
                  ) : null}
                  <div className="dialog__widget-actions">
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
                </div>
              </aside>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
