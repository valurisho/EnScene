import { useEffect, useState, type ReactNode } from "react";
import {
  loadFavoriteMovies,
  saveFavoriteMovies,
  toFavoriteMovie,
} from "../favoritesStorage";
import type {
  FavoriteMovie,
  MovieSummary,
} from "../types";
import { FavoritesContext } from "./favoritesContextValue";

type FavoritesProviderProps = {
  children: ReactNode;
};

// creating the shared favorites state so any child can call useFavorites
export function FavoritesProvider({ children }: FavoritesProviderProps) {
  // Load saved favorites from localStorage when the app first starts.
  const [favoriteMovies, setFavoriteMovies] =
    useState<FavoriteMovie[]>(loadFavoriteMovies);

  // Save favorites again every time the list changes.
  useEffect(() => {
    saveFavoriteMovies(favoriteMovies);
  }, [favoriteMovies]);

  function isFavorite(movieId: number): boolean {
    return favoriteMovies.some((movie) => movie.movieId === movieId);
  }

  function removeFavorite(movieId: number) {
    setFavoriteMovies((currentFavorites) =>
      currentFavorites.filter((movie) => movie.movieId !== movieId),
    );
  }

  function saveFavorite(movie: MovieSummary, personalRating: number) {
    setFavoriteMovies((currentFavorites) => {
      const isMovieFavorite = currentFavorites.some(
        (favoriteMovie) => favoriteMovie.movieId === movie.id,
      );

      if (isMovieFavorite) {
        // If the movie is already saved, just update the rating.
        return currentFavorites.map((favoriteMovie) =>
          favoriteMovie.movieId === movie.id
            ? { ...favoriteMovie, personalRating }
            : favoriteMovie,
        );
      }

      // If it is a new favorite, add it to the beginning of the list.
      return [toFavoriteMovie(movie, personalRating), ...currentFavorites];
    });
  }

  return (
    <FavoritesContext.Provider
      value={{
        favoriteMovies,
        isFavorite,
        removeFavorite,
        saveFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
