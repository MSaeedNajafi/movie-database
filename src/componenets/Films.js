import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import RecipeReviewCard from "../componenets/MovieCard";
import TextField from "@mui/material/TextField";

export default function Films(props) {
  let { films, image_base_url, backdrop_path, genres } = props;
  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  const searchItems = (searchValue) => {
    setSearchInput(searchValue.target.value);
    if (searchInput !== "") {
      const filteredData = films.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(searchInput.toLowerCase());
      });
      setFilteredResults(filteredData);
    } else {
      setFilteredResults(films);
    }
  };

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      style={{ border: "1px solid grey", padding: 5 }}
    >
      <Grid item xs={12} style={{ padding: 10 }}>
        <TextField
          id="outlined-name"
          label="Search for a movie name ...."
          value={searchInput}
          onChange={searchItems}
          style={{ width: "100%" }}
        />
      </Grid>

      {searchInput.length > 1
        ? filteredResults.map((film, index) => {
            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                style={{ padding: 10 }}
                key={film.id}
              >
                <RecipeReviewCard
                  img={image_base_url + backdrop_path}
                  film={film}
                  image_base_url={image_base_url}
                  genres={genres}
                />
              </Grid>
            );
          })
        : films.map((film, index) => {
            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                style={{ padding: 10 }}
                key={film.id}
              >
                <RecipeReviewCard
                  img={image_base_url + backdrop_path}
                  film={film}
                  image_base_url={image_base_url}
                  genres={genres}
                />
              </Grid>
            );
          })}
    </Grid>
  );
}
