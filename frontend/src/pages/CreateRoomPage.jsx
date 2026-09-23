import { useState } from "react";
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormHelperText,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Collapse,
  Alert,
} from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const CreateRoomPage = ({
  votesToSkipDefault = 2,
  guestCanPauseDefault = true,
  update = false,
  roomCode = null,
  updateCallback = () => {},
}) => {
  const navigate = useNavigate();

  const [guestCanPause, setGuestCanPause] = useState(guestCanPauseDefault);

  const [votesToSkip, setVotesToSkip] = useState(votesToSkipDefault);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleVotesChange = (e) => {
    setVotesToSkip(e.target.value);
  };

  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === "true");
  };

  const handleRoomButtonPressed = async () => {
    try {
      const response = await api.post("/create-room/", {
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
      });

      console.log("ROOM CREATED:", response.data);

      navigate(`/room/${response.data.code}`);
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to create room.");
    }
  };

  const handleUpdateButtonPressed = async () => {
    try {
      const response = await api.patch("/update-room/", {
        votes_to_skip: votesToSkip,
        guest_can_pause: guestCanPause,
        code: roomCode,
      });

      console.log(response.data);

      setSuccessMsg("Room updated successfully!");
      setErrorMsg("");

      updateCallback();
    } catch (error) {
      console.error(error);

      setErrorMsg("Error updating room...");
      setSuccessMsg("");
    }
  };

  const renderCreateButtons = () => {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={handleRoomButtonPressed}
          >
            Create A Room
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Button
            color="secondary"
            variant="outlined"
            fullWidth
            component={Link}
            to="/"
          >
            Back
          </Button>
        </Grid>
      </Grid>
    );
  };

  const renderUpdateButtons = () => {
    return (
      <Grid item xs={12}>
        <Button
          color="primary"
          variant="contained"
          fullWidth
          onClick={handleUpdateButtonPressed}
        >
          Update Room
        </Button>
      </Grid>
    );
  };

  const title = update ? "Update Room" : "Create a Room";

  return (
    <Grid
      container
      spacing={3}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: "100vh" }}
    >
      <Grid item xs={12}>
        <Collapse in={errorMsg !== "" || successMsg !== ""}>
          {successMsg ? (
            <Alert severity="success" onClose={() => setSuccessMsg("")}>
              {successMsg}
            </Alert>
          ) : (
            <Alert severity="error" onClose={() => setErrorMsg("")}>
              {errorMsg}
            </Alert>
          )}
        </Collapse>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h4">{title}</Typography>
      </Grid>

      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormHelperText>Guest Control of Playback State</FormHelperText>

          <RadioGroup
            row
            value={guestCanPause.toString()}
            onChange={handleGuestCanPauseChange}
          >
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
            />

            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
            />
          </RadioGroup>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <FormControl>
          <TextField
            required
            type="number"
            value={votesToSkip}
            onChange={handleVotesChange}
            inputProps={{
              min: 1,
              style: { textAlign: "center" },
            }}
          />

          <FormHelperText>Votes Required To Skip Song</FormHelperText>
        </FormControl>
      </Grid>

      {update ? renderUpdateButtons() : renderCreateButtons()}
    </Grid>
  );
};

export default CreateRoomPage;
