import { Grid, Button, ButtonGroup, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const HomePage = () => (
  <Grid container spacing={3}>
    <Grid item xs={12} textAlign="center">
      <Typography variant="h3">House Party</Typography>
    </Grid>

    <Grid item xs={12} textAlign="center">
      <ButtonGroup disableElevation variant="contained">
        <Button component={Link} to="/join">
          Join a Room
        </Button>

        <Button component={Link} to="/info">
          Info
        </Button>

        <Button component={Link} to="/create" color="secondary">
          Create a Room
        </Button>
      </ButtonGroup>
    </Grid>
  </Grid>
);

export default HomePage;