import { useState } from "react";
import { buildMovieImageUrl } from "../api";
import { useFavorites } from "../hooks/useFavorites";
import MoviePopUp from "./moviePopUp";

function getReleaseYear(releaseDate: string): string {
  return releaseDate ? releaseDate.slice(0, 4) : "Year unknown";
}

export default function FavoriteMovies() {
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const { favoriteMovies, removeFavorite } = useFavorites();

  function openMovieDetails(movieId: number) {
    setSelectedMovieId(movieId);
  }

  if (favoriteMovies.length === 0) {
    return (
      <div className="status-panel">
        <p>No favorites saved yet.</p>
        <p>Add movies from Discover or Search to build your list.</p>
      </div>
    );
  }

  return (
    <>
      <section className="movie-grid">
        {favoriteMovies.map((movie) => {
          const posterUrl = buildMovieImageUrl(movie.posterPath);

          return (
            <article
              className="movie-card movie-card--interactive movie-card--browse"
              key={movie.movieId}
              onClick={() => openMovieDetails(movie.movieId)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openMovieDetails(movie.movieId);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className="movie-card__media">
                {posterUrl ? (
                  <img
                    alt={`${movie.title} poster`}
                    className="movie-card__poster"
                    src={posterUrl}
                  />
                ) : (
                  <div className="movie-card__poster movie-card__poster--placeholder">
                    No poster
                  </div>
                )}
                <div className="movie-card__shade" />
                <span aria-hidden="true" className="movie-card__heart movie-card__heart--active">
                  ♥
                </span>
              </div>

              <div className="movie-card__content">
                <h2 className="movie-card__title">{movie.title}</h2>
                <div className="movie-card__meta-row">
                  <span>{getReleaseYear(movie.releaseDate)}</span>
                  <span className="movie-card__dot">•</span>
                  <span className="movie-card__runtime-muted">
                    {movie.personalRating > 0
                      ? `Your rating: ${movie.personalRating} / 5`
                      : "Not rated yet"}
                  </span>
                </div>
                <div className="movie-card__score">
                  <span className="movie-card__score-star">★</span>
                  <span className="movie-card__score-value">
                    {movie.personalRating > 0 ? movie.personalRating.toFixed(1) : "—"}
                  </span>
                  <span className="movie-card__score-scale">/ 5</span>
                </div>
                <div className="movie-card__actions">
                  <button
                    className="movie-card__button"
                    onClick={(event) => {
                      event.stopPropagation();
                      openMovieDetails(movie.movieId);
                    }}
                    type="button"
                  >
                    View details
                  </button>
                  <button
                    className="movie-card__button movie-card__button--secondary"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeFavorite(movie.movieId);
                    }}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <MoviePopUp
        movieId={selectedMovieId}
        onClose={() => setSelectedMovieId(null)}
      />
    </>
  );
}
