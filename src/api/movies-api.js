export const getMovies = async () => {
    const response = await  fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=d7ca441f381ab8be26309990a8088d9d&language=en-US&include_adult=false&page=1`
    )
    return response.json()
  };