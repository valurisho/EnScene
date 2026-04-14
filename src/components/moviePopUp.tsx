export default async function MovieDialog(movieId:number) {
    
const url = `https://api.themoviedb.org/3/movie/${movieId}`;
  const options = {
    headers: {
      method: "GET",
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZDhiN2Y0Y2FkMzA2M2ZiYWQzNWFlZTZlOWJlYzkwMiIsIm5iZiI6MTc3NTA1ODMzMy41OTYsInN1YiI6IjY5Y2QzZDlkODRkYmExMDI3Mzg3YThmMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.B7wdF_8JyWlvUh_aVtd7PGg15HjSHdwYunP4GQwRQ6Q",
    }
  };

    return(
        <div>
            
        </div>
    )
}