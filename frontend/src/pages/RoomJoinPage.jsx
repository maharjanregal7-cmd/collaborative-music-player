import { useState } from "react";
import { TextField, Grid, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../services/api";

const Homepage = () => {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleButtonPressed = async () => {
    try {
      await api.post("/join-room/", { code: roomCode });
      navigate(`/room/${roomCode}`);
    } catch {
      setError("Invalid Room Code");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Grid
        container
        direction="column"
        spacing={2}
        alignItems="center"
        sx={{ width: 300 }}
      >
        <Typography variant="h3">Join a Room</Typography>

        <TextField
          fullWidth
          error={!!error}
          label="Code"
          placeholder="Enter a Room Code"
          value={roomCode}
          helperText={error}
          variant="outlined"
          onChange={(e) => setRoomCode(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleButtonPressed}
          color="primary"
        >
          Enter Room
        </Button>

        <Button
          fullWidth
          variant="outlined"
          component={Link}
          to="/"
          color="secondary"
        >
          Back
        </Button>
      </Grid>
    </div>
  );
};

export default Homepage;
