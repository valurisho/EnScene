# EnScene

EnScene is a movie discovery app built with React and TypeScript. Users can browse popular movies, filter by genre, search for specific titles, open a detailed movie view, and save favorites with their own personal ratings. The app uses The Movie Database (TMDB) API for movie data and stores favorites locally in the browser.

## Project Description

EnScene includes:

- movie discovery from a live web API
- search with debounced input
- detailed movie pop-up views
- favorites management with personal ratings
- persistent local storage for saved favorites
- responsive layouts for desktop and mobile

## Core Technologies

- React
- TypeScript
- Vite
- React Router
- TMDB API

## Features

- Browse popular movies from TMDB
- Filter movies by quick genre buttons
- Search movies by title
- View movie details including poster, backdrop, runtime, genres, director, and overview
- Add movies to a favorites list
- Save a personal rating for each favorite
- Edit or remove favorites later
- Persist favorites with `localStorage`
- Navigate between the main browse page and the favorites page with routing
- Show loading and error states for API requests
- Retry failed requests

## Instructions To Run The Project

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the project root and add your TMDB access token:

```env
VITE_TMDB_ACCESS_TOKEN=replace_with_your_tmdb_bearer_token
```

You can also copy the format from `.env.example`.

4. Start the development server:

```bash
npm run dev
```

## API Used And How Data Is Handled

This project uses The Movie Database (TMDB) API.

Endpoints used:

- `GET /discover/movie` to load popular/discover movies
- `GET /search/movie` to search by title
- `GET /movie/{movie_id}?append_to_response=credits` to load detailed movie information
- `https://image.tmdb.org/t/p/...` to render poster and backdrop images

How the data is handled:

- API responses are fetched with `fetch`
- request configuration is centralized in `src/api.ts`
- raw TMDB response objects are converted into app-friendly TypeScript shapes in `src/movieAdapters.ts`
- async request state is managed with a reducer in `src/asyncState.ts`
- loading, success, and error states are displayed in the UI
- favorites are saved to `localStorage` through `src/favoritesStorage.ts`

## Additional Features Implemented

- Custom hooks for shared app state
- Context providers for favorites and search state
- Debounced search input to reduce unnecessary API calls
- Retry buttons for failed API requests
- Personal rating system for favorite movies
- Responsive card grid and full-screen detail dialog
- Hash-based routing setup for static hosting compatibility

## Project Structure

```text
src/
  components/      Reusable UI pieces
  context/         React context providers and context values
  hooks/           Custom hooks
  pages/           Routed page-level components
  api.ts           API request helpers
  asyncState.ts    Shared async reducer logic
  favoritesStorage.ts
  movieAdapters.ts Data transformation helpers
  types.ts         Shared TypeScript types
```

## Notes

- A TMDB access token is required to run the app.
- `.env.local` is ignored by Git so the token is not committed accidentally.
- Favorites are stored in the browser, so they are tied to the current device/browser.

## AI Usage

AI tools were used as a development aid for selected parts of this project.

- AI was used to help work on the React context for favorite movies.
- AI was used to help apply formatting and styling, mainly in the CSS files.
- AI was used to help understand the TMDB API, including finding routes and choosing which endpoints to call for the features implemented in the app.
