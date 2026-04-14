import { useState } from 'react';
import './App.css';
import test from './test';
import type { Movie } from './types';

//need a search query that will put the name of the movie that they are looking for.

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleShowMovies = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await test();
      setMovies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load movies.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-shell">
      <h1>Movie Test Data</h1>
      <button className="counter" onClick={() => void handleShowMovies()}>
        {loading ? 'Loading...' : 'Show Movies'}
      </button>

      {error ? <p className="status error">{error}</p> : null}

      <section className="movie-list">
        {movies.map((movie) => (
          <article className="movie-card" key={movie.id}>
            <h2>{movie.title}</h2>
            <p className="movie-date">
              Release date: {movie.release_date || 'Unknown'}
            </p>
            <p>{movie.overview || 'No overview available.'}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;
 