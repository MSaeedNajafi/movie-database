import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Grid from "@mui/material/Grid";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function RecipeReviewCard(props) {
  let { film, image_base_url, genres } = props;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // console.log(genres.genres);

  const findGenre = (l) => {
    let gen = [];
    for (let i = 0; i < l.length; i++) {
      let film = genres.genres.filter((g) => g.id == l[i]);
      gen.push(film[0]);
    }
    return gen;
  };

  const generateColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
    return `#${randomColor}`;
  };

  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: generateColor() }} aria-label="recipe">
              {film.original_title.substring(0, 1)}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings" onClick={handleOpen}>
              <MoreVertIcon />
            </IconButton>
          }
          title={film.original_title}
          subheader={film.release_date}
          style={{ height: 50 }}
        />
        <CardMedia
          component="img"
          height="194"
          src={image_base_url + film.poster_path}
          alt="Paella dish"
        />
        <CardContent>
          <Typography
            variant="subtitle2"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              height: 150,
            }}
            // noWrap
          >
            {film.overview}
          </Typography>
        </CardContent>
      </Card>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        // style={{ width: 600 }}
      >
        <Box sx={style}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {film.title}
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              ({film.release_date})
            </Typography>
          </div>
          <div
            style={{
              display: "flex",
              // flexDirection: "row",
              marginBottom: 20,
              justifyContent: "center",
            }}
          >
            {findGenre(film.genre_ids).map((g) => (
              <Typography
                id="modal-modal-description"
                sx={{ mt: 2 }}
                key={g.id}
              >
                {g.name},
              </Typography>
            ))}
          </div>
          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <img
              src={image_base_url + film.poster_path}
              alt="Logo"
              style={{ width: "50%", height: "auto" }}
            />
          </Grid>
          <Typography
            id="modal-modal-description"
            style={{ padding: 5, fontSize: 14, textAlign: "justify" }}
          >
            {film.overview}
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
