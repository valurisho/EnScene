import type { FavoriteMovie, MovieSummary } from "./types";

const FAVORITES_STORAGE_KEY = "enscene.favoriteMovies";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isFavoriteMovie(value: unknown): value is FavoriteMovie {
  return (
    isRecord(value) &&
    typeof value.movieId === "number" &&
    typeof value.title === "string" &&
    (typeof value.posterPath === "string" || value.posterPath === null) &&
    typeof value.releaseDate === "string" &&
    typeof value.personalRating === "number"
  );
}

//saves to local storage
export function loadFavoriteMovies(): FavoriteMovie[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);
    return Array.isArray(parsedValue)
      ? parsedValue.filter(isFavoriteMovie)
      : [];
  } catch {
    return [];
  }
}

export function saveFavoriteMovies(movies: FavoriteMovie[]): void {
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(movies));
}

export function toFavoriteMovie(
  movie: MovieSummary,
  personalRating: number,
): FavoriteMovie {
  return {
    movieId: movie.id,
    title: movie.title,
    posterPath: movie.posterPath,
    releaseDate: movie.releaseDate,
    personalRating,
  };
}
