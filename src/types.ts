export type Movie = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
};

export type MovieDomain = Movie[];

export type MovieApi = {
  id: number;
  title: string;
  original_title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
};

//this is to make sure that the API works as it returns a page number
export type DiscoverMoviesResponse = {
  page: number;
  results: MovieApi[];
  total_pages: number;
  total_results: number;
};

export type MovieSummary = {
  id: number;
  title: string;
  originalTitle: string;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
};

export type MovieDetailsResponse = MovieApi & {
  tagline?: string;
  runtime: number | null;
  genres: Array<{ id: number; name: string }>;
  credits?: {
    crew: Array<{ job: string; name: string }>;
  };
};

export type MovieDetails = {
  id: number;
  title: string;
  originalTitle: string;
  posterPath: string | null;
  backdropPath: string | null;
  overview: string;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  runtime: number | null;
  genres: string[];
  director: string | null;
  tagline: string;
};

export type FavoriteMovie = {
  movieId: number;
  title: string;
  posterPath: string | null;
  releaseDate: string;
  personalRating: number;
};

export type FavoritesContextValue = {
  favoriteMovies: FavoriteMovie[];
  isFavorite: (movieId: number) => boolean;
  saveFavorite: (movie: MovieSummary, personalRating: number) => void;
  removeFavorite: (movieId: number) => void;
};
