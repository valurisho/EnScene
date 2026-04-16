import { HashRouter, Route, Routes } from "react-router-dom";
import { FavoritesProvider } from "./context/favoritesContext";
import { SearchProvider } from "./context/searchContext";
import { useFavorites } from "./hooks/useFavorites";
import FavoritesPage from "./pages/favoritesPage";
import MovieMain from "./pages/movieMain";

function AppShell() {
  const { favoriteMovies } = useFavorites();

  return (
    <>
      <main className="movie-app">
        <div className="movie-app__topbar">
          <p className="movie-app__brand-mark">EnScene</p>
          <div aria-label={`Favorites: ${favoriteMovies.length}`} className="movie-app__favorite-count">
            <span aria-hidden="true" className="movie-app__favorite-icon">
              {favoriteMovies.length > 0 ? "♥" : "♡"}
            </span>
            <span className="movie-app__favorite-number">{favoriteMovies.length}</span>
          </div>
        </div>
        <Routes>
          <Route element={<MovieMain />} path="/" />
          <Route element={<FavoritesPage />} path="/favorites" />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <FavoritesProvider>
        <SearchProvider>
          <AppShell />
        </SearchProvider>
      </FavoritesProvider>
    </HashRouter>
  );
}
