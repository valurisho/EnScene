import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { FavoritesProvider } from "./context/favoritesContext";
import { useFavorites } from "./hooks/useFavorites";
import FavoritesPage from "./pages/favoritesPage";
import MovieMain from "./pages/movieMain";

function AppShell() {
  const { favoriteMovies } = useFavorites();

  return (
    <main className="movie-app">
      <div className="movie-app__header">
        <div className="movie-app__masthead">
          <div className="movie-app__brand">
            <p className="movie-app__eyebrow">EnScene</p>
            <h1>Track the movies you want to remember</h1>
            <p className="movie-app__subtitle">
              Discover movies from TMDB, search what you want to watch next,
              and keep a personal favorites list with your own ratings.
            </p>
          </div>
        </div>

        <nav className="movie-app__toolbar" aria-label="Primary">
          <NavLink
            className={({ isActive }) =>
              `movie-app__tab ${isActive ? "movie-app__tab--active" : ""}`
            }
            to="/"
          >
            Discover
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `movie-app__tab ${isActive ? "movie-app__tab--active" : ""}`
            }
            to="/favorites"
          >
            My Favorites ({favoriteMovies.length})
          </NavLink>
        </nav>
      </div>

      <Routes>
        <Route element={<MovieMain />} path="/" />
        <Route element={<FavoritesPage />} path="/favorites" />
      </Routes>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
    {/* passing the context to the whole app */}
      <FavoritesProvider>
        <AppShell />
      </FavoritesProvider>
    </BrowserRouter>
  );
}
