import React, { useState, useEffect } from "react";
import { Grid, Button, Typography, IconButton } from "@mui/material";

import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import { Link } from "react-router-dom";

const pages = {
  JOIN: "pages.join",
  CREATE: "pages.create",
};

const Info = () => {
  const [page, setPage] = useState(pages.JOIN);

  const joinInfo = () => {
    return "Join an existing room using a room code shared by the host.";
  };

  const createInfo = () => {
    return "Create a new room and invite others to join your music session.";
  };

  useEffect(() => {
    console.log("Info component mounted");

    return () => {
      console.log("Info component unmounted");
    };
  }, []);

  const handlePageChange = () => {
    setPage((prevPage) =>
      prevPage === pages.CREATE ? pages.JOIN : pages.CREATE,
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} textAlign="center">
        <Typography variant="h4">What is House Party?</Typography>
      </Grid>

      <Grid item xs={12} textAlign="center">
        <Typography variant="body1">
          {page === pages.JOIN ? joinInfo() : createInfo()}
        </Typography>
      </Grid>

      <Grid item xs={12} textAlign="center">
        <IconButton onClick={handlePageChange}>
          {page === pages.CREATE ? (
            <NavigateBeforeIcon />
          ) : (
            <NavigateNextIcon />
          )}
        </IconButton>
      </Grid>

      <Grid item xs={12} textAlign="center">
        <Button component={Link} to="/" variant="contained" color="secondary">
          Back
        </Button>
      </Grid>
    </Grid>
  );
};

export default Info;
