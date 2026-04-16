import { useState } from "react";
import MoviePopUp from "./moviePopUp";
import { buildMovieImageUrl } from "../api";
import { useFavorites } from "../hooks/useFavorites";
import type { MovieSummary } from "../types";

type Props = {
  movieList: MovieSummary[];
  emptyMessage?: string;
};

//only grabs the year
function getReleaseYear(releaseDate: string): string {
  return releaseDate ? releaseDate.slice(0, 4) : "Year unknown";
}

export default function PopularMovies({
  movieList,
  emptyMessage = "No movies to show right now.",
}: Props) {
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const { isFavorite } = useFavorites();

  function openMovieDetails(movieId: number) {
    setSelectedMovieId(movieId);
  }

  if (movieList.length === 0) {
    return (
      <div className="status-panel">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <section className="movie-grid">
        {movieList.map((movie) => {
          const posterUrl = buildMovieImageUrl(movie.posterPath);

          return (
            <article
              className="movie-card movie-card--interactive movie-card--browse"
              key={movie.id}
              onClick={() => openMovieDetails(movie.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openMovieDetails(movie.id);
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
                <span
                  aria-hidden="true"
                  className={`movie-card__heart ${isFavorite(movie.id) ? "movie-card__heart--active" : ""}`}
                >
                  {isFavorite(movie.id) ? "♥" : "♡"}
                </span>
              </div>

              <div className="movie-card__content">
                <h2 className="movie-card__title">{movie.title}</h2>
                <div className="movie-card__meta-row">
                  <span>{getReleaseYear(movie.releaseDate)}</span>
                  <span className="movie-card__dot">•</span>
                  <span className="movie-card__runtime-muted">See details</span>
                </div>
                <div className="movie-card__score">
                  <span className="movie-card__score-star">★</span>
                  <span className="movie-card__score-value">
                    {movie.voteAverage.toFixed(1)}
                  </span>
                  <span className="movie-card__score-scale">/ 10</span>
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
