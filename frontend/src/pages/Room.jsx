import { useState, useEffect, useCallback } from "react";
import { Grid, Button, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "../components/MusicPlayer";
import api from "../services/api";

const Room = ({ leaveRoomCallback = () => {} }) => {
  const navigate = useNavigate();
  const { roomCode } = useParams();

  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [song, setSong] = useState({});

  const authenticateSpotify = useCallback(async () => {
    try {
      const response = await fetch("/spotify/is-authenticated");
      const data = await response.json();

      if (!data.is_authenticated) {
        const authResponse = await fetch("/spotify/get-auth-url");
        const authData = await authResponse.json();

        window.location.replace(authData.url);
      }
    } catch {
      console.error("Spotify authentication failed:");
    }
  }, []);

  const refreshRoomDetails = useCallback(async () => {
    try {
      const response = await api.get("/get-room/", {
        params: { code: roomCode },
      });

      setVotesToSkip(response.data.votes_to_skip);
      setGuestCanPause(response.data.guest_can_pause);
      setIsHost(response.data.is_host);
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  }, [roomCode]);

  const leaveButtonPressed = async () => {
    try {
      await api.post("/leave-room/");
      leaveRoomCallback();
      navigate("/");
    } catch {
      console.error("Error leaving room:");
    }
  };

  useEffect(() => {
    let active = true;

    api
      .get("/get-room/", { params: { code: roomCode } })
      .then((response) => {
        if (!active) return;

        setVotesToSkip(response.data.votes_to_skip);
        setGuestCanPause(response.data.guest_can_pause);
        setIsHost(response.data.is_host);

        if (response.data.is_host) {
          authenticateSpotify();
        }
      })
      .catch(() => {
        if (!active) return;
        leaveRoomCallback();
        navigate("/");
      });

    return () => {
      active = false;
    };
  }, [roomCode, navigate, leaveRoomCallback, authenticateSpotify]);

  useEffect(() => {
    let active = true;

    const loadSong = async () => {
      try {
        const response = await fetch("/spotify/current-song");
        if (!active) return;
        setSong(response.ok ? await response.json() : {});
      } catch {
        if (active) setSong({});
      }
    };

    loadSong();

    const interval = setInterval(loadSong, 1000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (showSettings) {
    return (
      <Grid container spacing={2}>
        <Grid size={12} textAlign="center">
          <CreateRoomPage
            update={true}
            votesToSkipDefault={votesToSkip}
            guestCanPauseDefault={guestCanPause}
            roomCode={roomCode}
            updateCallback={refreshRoomDetails}
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