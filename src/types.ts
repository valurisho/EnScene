export type Movie = {
  id: number;
  title: string;
  overview: string;
  release_date: string;
};

export type MovieDomain = Movie[];

export type MovieSummary = {
    id: number;
    title: string;
    originalTitle: string;
    posterPath: string;
    overview: string;
    releaseDate: string;
    voteAverage: number;
    voteCount: number;
}

export type MoveDetails = {
    id: number;
    title: string;
    originalTitle: string;
    posterPath: string;
    overview: string;
    releaseDate: string;
    voteAverage: number;
    voteCount: number;
    runtime: string;
    genres: string[];
    cast: string[];
    crew: string[];
    reviews: string[];
    watchProviders: string[];
}

export type FavoriteMovie = {
    movieId: number; 
    title: string;
    posterPath: string;
    releaseDate: string;
    personalRating: number;
}