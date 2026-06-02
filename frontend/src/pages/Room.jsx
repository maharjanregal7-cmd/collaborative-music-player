import React, { useState, useEffect, useCallback } from "react";
import { Grid, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

const Room = ({ leaveRoomCallback = () => {} }) => {
  const navigate = useNavigate();
  const { roomCode } = useParams();

  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const [song, setSong] = useState({});

  const authenticateSpotify = useCallback(async () => {
    try {
      const response = await fetch("/spotify/is-authenticated");
      const data = await response.json();

      setSpotifyAuthenticated(data.status);

      if (!data.status) {
        const authResponse = await fetch("/spotify/get-auth-url");
        const authData = await authResponse.json();

        window.location.replace(authData.url);
      }
    } catch (error) {
      console.error("Spotify authentication failed:", error);
    }
  }, []);

  const getRoomDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/get-room?code=${roomCode}`);

      if (!response.ok) {
        leaveRoomCallback();
        navigate("/");
        return;
      }

      const data = await response.json();

      setVotesToSkip(data.votes_to_skip);
      setGuestCanPause(data.guest_can_pause);
      setIsHost(data.is_host);

      if (data.is_host) {
        authenticateSpotify();
      }
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  }, [roomCode, navigate, leaveRoomCallback, authenticateSpotify]);

  const getCurrentSong = useCallback(async () => {
    try {
      const response = await fetch("/spotify/current-song");

      if (!response.ok) {
        setSong({});
        return;
      }

      const data = await response.json();
      setSong(data);
    } catch (error) {
      console.error("Error fetching current song:", error);
    }
  }, []);

  const leaveButtonPressed = async () => {
    try {
      await fetch("/api/leave-room", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      leaveRoomCallback();
      navigate("/");
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  };

  useEffect(() => {
    getRoomDetails();
  }, [getRoomDetails]);

  useEffect(() => {
    getCurrentSong();

    const interval = setInterval(() => {
      getCurrentSong();
    }, 1000);

    return () => clearInterval(interval);
  }, [getCurrentSong]);

  if (showSettings) {
    return (
      <Grid container spacing={2}>
        <Grid size={12} textAlign="center">
          <CreateRoomPage
            update={true}
            votesToSkip={votesToSkip}
            guestCanPause={guestCanPause}
            roomCode={roomCode}
            updateCallback={getRoomDetails}
          />
        </Grid>

        <Grid size={12} textAlign="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowSettings(false)}
          >
            Close
          </Button>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid size={12} textAlign="center">
        <Typography variant="h4">Code: {roomCode}</Typography>
      </Grid>

      <MusicPlayer {...song} />

      {isHost && (
        <Grid size={12} textAlign="center">
          <Button variant="contained" onClick={() => setShowSettings(true)}>
            Settings
          </Button>
        </Grid>
      )}

      <Grid size={12} textAlign="center">
        <Button variant="contained" color="error" onClick={leaveButtonPressed}>
          Leave Room
        </Button>
      </Grid>
    </Grid>
  );
};

export default Room;
