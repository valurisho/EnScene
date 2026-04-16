import { NavLink } from "react-router-dom";

export default function MainTabs() {
  return (
    <nav aria-label="Browse" className="movie-app__main-tabs">
      <NavLink
        className={({ isActive }) =>
          `movie-app__main-tab ${isActive ? "movie-app__main-tab--active" : ""}`
        }
        end
        to="/"
      >
        All movies
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          `movie-app__main-tab ${isActive ? "movie-app__main-tab--active" : ""}`
        }
        to="/favorites"
      >
        Favorites
      </NavLink>
    </nav>
  );
}
