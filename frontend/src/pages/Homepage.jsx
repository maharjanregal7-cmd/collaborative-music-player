import React, { useEffect, useState } from "react";
import { Grid, Button, ButtonGroup, Typography } from "@mui/material";

import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from "./Room";
import Info from "./Info";

const HomePage = () => {
  const [roomCode, setRoomCode] = useState(null);

  const clearRoomCode = () => {
    setRoomCode(null);
  };

  useEffect(() => {
    const fetchUserRoom = async () => {
      try {
        const response = await fetch("/api/user-in-room");
        const data = await response.json();

        setRoomCode(data.code);
      } catch (error) {
        console.error("Error fetching room:", error);
      }
    };

    fetchUserRoom();
  }, []);

  const renderHomePage = () => (
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

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            roomCode ? (
              <Navigate to={`/room/${roomCode}`} replace />
            ) : (
              renderHomePage()
            )
          }
        />

        <Route path="/join" element={<RoomJoinPage />} />

        <Route path="/info" element={<Info />} />

        <Route path="/create" element={<CreateRoomPage />} />

        <Route
          path="/room/:roomCode"
          element={<Room leaveRoomCallback={clearRoomCode} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default HomePage;
