import { useEffect, useReducer } from "react";
import type { Movie, MovieDomain } from "./types";
import { asyncReducer, type AsyncState } from "./asyncState";
import { fetchFromApi } from "./api";

export default function MovieMain() {
  const controller = new AbortController();
  const signal = controller.signal;

  const url = "https://api.themoviedb.org/3/discover/movie";
  const options = {
    headers: {
      method: "GET",
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZDhiN2Y0Y2FkMzA2M2ZiYWQzNWFlZTZlOWJlYzkwMiIsIm5iZiI6MTc3NTA1ODMzMy41OTYsInN1YiI6IjY5Y2QzZDlkODRkYmExMDI3Mzg3YThmMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.B7wdF_8JyWlvUh_aVtd7PGg15HjSHdwYunP4GQwRQ6Q",
    },
    signal,
  };

  const [state, dispatch] = useReducer(asyncReducer<MovieDomain>, {
    status: "idle",
  } as AsyncState<MovieDomain>);

useEffect(() => {

  const loadMovies = async () => {
    dispatch({ type: "loadStart" });

    const res = await fetchFromApi<MovieDomain>(url, options);
    if (!res.ok) {
      if (res.error.kind === "network" || res.error.kind === "parse") {
        dispatch({ type: "loadError", message: res.error.message });
      } else {
        dispatch({
          type: "loadError",
          message: `HTTP ${res.error.status}: ${res.error.statusText || "Request failed"}`,
        });
      }
      return;
    }
    dispatch({type: "loadSuccess", data: res.data })

    // else {
    //   if (!isUsers(res.data)) {
    //     dispatch({
    //       type: "loadError",
    //       message:
    //         "Schema Mismatch. fetched data does not match expected User shape. ",
    //     });
    //     return;
    //   }
    //   dispatch({ type: "loadSuccess", data: res.data });
    // }

    //depends on the Url for use effect
  }
  void loadMovies();

}, [url]);
  switch (state.status) {
    case "idle":
      return <p>Idle (loading will start automatically)</p>;
    case "error":
      return <p>Error: {state.message}</p>;
    case "loading":
      return <p>Loading...</p>;
    case "success":
      return (
        <div>
          {state.data.map((movie) => (
            <div key={movie.id}>
              <h2>
                {movie.title}
              </h2>
              <p>{movie.overview}</p>
               <p>{movie.release_date}</p>
              </div>
          ))}
          {/* {state.data.map((user) => (
            <article
              style={{ border: "1px solid black", marginBottom: "16px" }}
            > */}
              {/* <div key={user.id}>
                <h2>{user.name}</h2>
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
                <p>Website: {user.website}</p>
                <p>
                  Address: {user.address.street}, {user.address.city}{" "}
                  {user.address.zipcode}
                </p>
                <p>Company: {user.company.name}</p>
              </div> */}
            {/* </article>
          ))} */}
          {/* <button onClick={() => setReloadToken((x) => x + 1)}>Refetch</button> */}
        </div>
      );
  }
}
