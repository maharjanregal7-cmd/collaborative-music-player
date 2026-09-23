import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import api from "./services/api";
import Homepage from "./pages/Homepage";
import RoomJoinPage from "./pages/RoomJoinPage.jsx";
import CreateRoomPage from "./pages/CreateRoomPage.jsx";
import Room from "./pages/Room.jsx";
import Info from "./pages/Info.jsx";

const App = () => {
  const [roomCode, setRoomCode] = useState(null);

  const clearRoomCode = () => setRoomCode(null);

  useEffect(() => {
    let active = true;

    api
      .get("/user-in-room/")
      .then((response) => {
        if (active) setRoomCode(response.data.code);
      })
      .catch((error) => console.error("Error fetching room:", error));

    return () => {
      active = false;
    };
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={
          roomCode ? (
            <Navigate to={`/room/${roomCode}`} replace />
          ) : (
            <Homepage />
          )
        }
      />
      <Route path="/create" element={<CreateRoomPage />} />
      <Route path="/info" element={<Info />} />
      <Route path="/join" element={<RoomJoinPage />} />
      <Route
        path="/room/:roomCode"
        element={<Room leaveRoomCallback={clearRoomCode} />}
      />
    </Routes>
  );
};

export default App;