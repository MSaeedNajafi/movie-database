import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import Films from "./componenets/Films";

function App() {
  const api_key = "1f54bd990f1cdfb230adb312546d765d";
  const image_base_url = "https://image.tmdb.org/t/p/w500";

  const [loading, setLoading] = useState(null);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [result, setResult] = useState([]);
  const [genres, setGenres] = useState([]);
  const [data, setData] = useState([]);
  const [desc, setDesc] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [backdrop_path, setBackdrop_path] = useState("");
  const [films, setFilms] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [listID, setListID] = useState(1);

  useEffect(async () => {
    await loadMovies();
  }, [listID]);

  const loadMore = () => {
    setListID(listID + 1);
  };

  const loadBefore = () => {
    setListID(listID - 1);
  };

  const fetchMovies = async (url) => {
    return fetch(url, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json;charset=utf-8",
      }),
    }).then((res) => res.json());
  };

  const loadMovies = async () => {
    setData([]);
    setFilms([]);
    setLoading(true);
    await fetchMovies(
      `https://api.themoviedb.org/4/list/${listID}?page=1&api_key=${api_key}`
    )
      .then(async (data) => {
        setData(data);
        setName(data.name);
        setImage(data.poster_path);
        setDesc(data.description);
        setBackdrop_path(data.backdrop_path);
        setResult(data.results);
        if (genres.length == 0) {
          await getGenres();
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getGenres = async () => {
    let genres = await fetchMovies(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=en-US`
    );
    setGenres(genres);
    return genres;
  };

  const getAllMovies = async () => {
    setLoadingMovies(true);
    setFilms([]);
    let nums = Array.from(Array(data.total_pages + 1).keys());
    nums.shift();
    const urls = nums.map(
      (pageNo) =>
        `https://api.themoviedb.org/4/list/${listID}?page=${pageNo}&api_key=${api_key}`
    );
    let movies = [];
    for (let url in urls) {
      let curMovies = await fetchMovies(urls[url]);
      movies.push(curMovies.results);
    }

    let movs = [];

    for (let i = 0; i < movies.length; i++) {
      for (let j = 0; j < movies[i].length; j++) {
        movs.push(movies[i][j]);
        setFilms((items) => [...items, movies[i][j]]);
      }
    }
    setLoadingMovies(false);
    // console.log(movs);
    return movs;
  };

  return (
    <>
      {loading === false && (
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          style={{ marginTop: 50 }}
        >
          <Container
            maxWidth="lg"
            style={{ border: "1px solid grey", padding: 20, marginBottom: 50 }}
          >
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h1 " gutterBottom style={{ fontSize: 30 }}>
                {name}
              </Typography>
              <br />
              <Typography variant="h1 " gutterBottom style={{}}>
                total movies: {data.total_results}
              </Typography>
              <br />
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <img
                src={image_base_url + backdrop_path}
                alt="Logo"
                style={{ maxWidth: "100%" }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              <Button
                variant="contained"
                onClick={getAllMovies}
                disabled={loadingMovies ? true : false}
              >
                {loadingMovies
                  ? "loading movies ..."
                  : `Get All ${name} Movies`}
              </Button>
            </Grid>

            <Grid item xs={12} style={{ borderTop: "1px solid gray" }}>
              <div>
                <br />
                {films.length > 0 && (
                  <Films
                    img={image_base_url + backdrop_path}
                    image_base_url={image_base_url}
                    genres={genres}
                    films={films}
                  />
                )}
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              {listID == 1 ? (
                <></>
              ) : (
                <Button
                  variant="outlined"
                  onClick={loadBefore}
                  disabled={loadingMovies ? true : false}
                >
                  Previous
                </Button>
              )}

              <Button
                variant="outlined"
                onClick={loadMore}
                disabled={loadingMovies ? true : false}
              >
                Next
              </Button>
            </Grid>
          </Container>
        </Grid>
      )}
    </>
  );
}

export default App;
