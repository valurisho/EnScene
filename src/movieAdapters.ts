import type {
  MovieApi,
  MovieDetails,
  MovieDetailsResponse,
  MovieSummary,
} from "./types";


export function toMovieSummary(movie: MovieApi): MovieSummary {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    overview: movie.overview,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    voteCount: movie.vote_count,
  };
}

export function toMovieDetails(movie: MovieDetailsResponse): MovieDetails {
  const director =
    movie.credits?.crew.find((crewMember) => crewMember.job === "Director")
      ?.name ?? null;

  return {
    ...toMovieSummary(movie),
    runtime: movie.runtime,
    genres: movie.genres.map((genre) => genre.name),
    director,
    tagline: movie.tagline?.trim() ?? "",
  };
}
