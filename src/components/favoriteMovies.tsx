import { useState } from "react";
import { buildMovieImageUrl } from "../api";
import { useFavorites } from "../hooks/useFavorites";
import MoviePopUp from "./moviePopUp";

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
              className="movie-card movie-card--interactive"
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

              <div className="movie-card__content">
                <p className="movie-card__meta">
                  {movie.releaseDate || "Release date unavailable"}
                </p>
                <h2>{movie.title}</h2>
                <p className="movie-card__rating">
                  Personal rating:{" "}
                  {movie.personalRating > 0 ? movie.personalRating : "Not rated yet"}
                </p>
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
