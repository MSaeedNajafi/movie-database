import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { DataGrid } from "@mui/x-data-grid";
function App() {
  const api_key = "1f54bd990f1cdfb230adb312546d765d";
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

  const rows = [];

  const columns = [
    { field: "col1", headerName: "#", width: 50 },
    { field: "col2", headerName: "Title", width: 200 },
    { field: "col3", headerName: "Average", width: 100 },
    { field: "col4", headerName: "Popularity", width: 100 },
    { field: "col5", headerName: "Vote Count", width: 150 },
    { field: "col6", headerName: "Release Date", width: 150 },
    { field: "col7", headerName: "Genres", width: 300 },
  ];

  useEffect(async () => {
    await getAllMovies();
  }, []);

  // useEffect(() => {
  //   console.log("films ->", films);
  // }, [films]);

  // useEffect(() => {
  //   console.log("genres ->", genres);
  // }, [genres]);

  const fetchMovies = async (url) => {
    return fetch(url, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json;charset=utf-8",
      }),
    }).then((res) => res.json());
  };

  const loadMovies = async () => {
    setLoading(true);
    await fetchMovies(
      `https://api.themoviedb.org/4/list/1?page=1&api_key=${api_key}`
    )
      .then(async (data) => {
        // console.log(data);
        setData(data);
        setName(data.name);
        setImage(data.poster_path);
        setDesc(data.description);
        setBackdrop_path(data.backdrop_path);
        setResult(data.results);
        await getGenres();
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getGenres = async () => {
    let genres = await fetchGenres(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${api_key}&language=en-US`
    );

    // console.log(genres);
    setGenres(genres);

    return genres;
  };

  const fetchGenres = async (url) => {
    return fetch(url, {
      method: "GET",
      headers: new Headers({
        "Content-Type": "application/json;charset=utf-8",
      }),
    }).then((res) => res.json());
  };

  const getAllMovies = async () => {
    setLoadingMovies(true);
    setFilms([]);
    let nums = Array.from(Array(data.total_pages + 1).keys());
    nums.shift();
    const urls = nums.map(
      (pageNo) =>
        `https://api.themoviedb.org/4/list/1?page=${pageNo}&api_key=${api_key}`
    );
    let movies = [];
    for (let url in urls) {
      let curMovies = await fetchMovies(urls[url]);
      // console.log(url, curMovies.results);
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
    console.log(movs);
    return movs;
  };

  const findGenre = (l) => {
    let gen = [];
    for (let i = 0; i < l.length; i++) {
      let film = genres.genres.filter((g) => g.id == l[i]);
      gen.push(film[0].name);
    }
    return gen;
  };

  const Films = () => {
    if (films.length > 0) {
      for (let i = 0; i < films.length; i++) {
        let row = {
          id: films[i].id,
          col1: i + 1,
          col2: films[i].original_title,
          col3: films[i].vote_average,
          col4: films[i].popularity,
          col5: films[i].vote_count,
          col6: films[i].release_date,
          col7: findGenre(films[i].genre_ids),
        };

        rows[i] = row;
      }
    }
    return (
      <>
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={25}
            rowsPerPageOptions={[25]}
          />
        </div>
      </>
    );
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      // style={{ height: "100vh" }}
    >
      {name.length == 0 && (
        <Button variant="contained" onClick={loadMovies}>
          Load Movies
        </Button>
      )}
      {loading === false && (
        <Grid item xs={12}>
          <Box sx={{ width: "100%", maxWidth: 500 }}>
            <Typography variant="h1 " gutterBottom>
              {name}
            </Typography>
            <br />
            <Typography variant="h1 " gutterBottom>
              Number of pages: {data.total_pages}
            </Typography>
            <br />
            <Typography variant="h1 " gutterBottom>
              total movies: {data.total_results}
            </Typography>
            <br />
            <Button
              variant="contained"
              onClick={getAllMovies}
              disabled={loadingMovies ? true : false}
            >
              {loadingMovies ? "loading movies ..." : `Get All ${name} Movies`}
            </Button>
          </Box>
          <div>
            <br />
            {films.length > 0 && <Films />}
          </div>
        </Grid>
      )}
    </Grid>
  );
}

export default App;
