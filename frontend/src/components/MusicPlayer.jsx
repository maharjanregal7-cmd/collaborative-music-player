import React from "react";
import {
  Card,
  Grid,
  Typography,
  IconButton,
  LinearProgress,
} from "@mui/material";

import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";

const MusicPlayer = ({
  title = "",
  artist = "",
  image_url = "",
  is_playing = false,
  time = 0,
  duration = 1,
  votes = 0,
  votes_required = 0,
}) => {
  const skipSong = async () => {
    try {
      await fetch("/spotify/skip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error skipping song:", error);
    }
  };

  const pauseSong = async () => {
    try {
      await fetch("/spotify/pause", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error pausing song:", error);
    }
  };

  const playSong = async () => {
    try {
      await fetch("/spotify/play", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error playing song:", error);
    }
  };

  const songProgress = duration ? (time / duration) * 100 : 0;

  return (
    <Grid item xs={12}>
      <Card sx={{ p: 2 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={4}>
            <img
              src={image_url}
              alt={title}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Grid>

          <Grid item xs={8}>
            <Typography variant="h5">{title}</Typography>

            <Typography variant="subtitle1" color="text.secondary">
              {artist}
            </Typography>

            <div>
              <IconButton
                onClick={() => (is_playing ? pauseSong() : playSong())}
              >
                {is_playing ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>

              <IconButton onClick={skipSong}>
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {votes}/{votes_required}
                </Typography>
                <SkipNextIcon />
              </IconButton>
            </div>
          </Grid>
        </Grid>

        <LinearProgress
          variant="determinate"
          value={songProgress}
          sx={{ mt: 2 }}
        />
      </Card>
    </Grid>
  );
};

export default MusicPlayer;
