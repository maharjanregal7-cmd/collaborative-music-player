import React, { useEffect, useState } from "react";
import api from "./services/api";
import Homepage from "./pages/Homepage";
import { Route, Routes } from "react-router-dom";
import RoomJoinPage from "./pages/RoomJoinPage.jsx";
import CreateRoomPage from "./pages/CreateRoomPage.jsx";
import Room from "./pages/Room.jsx";
import Info from "./pages/Info.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/create" element={<CreateRoomPage />} />
      <Route path="/info" element={<Info />} />
      <Route path="/join" element={<RoomJoinPage />} />
      {/* <Route path="/room/:roomCode" element={<Room />} /> */}
      <Route
        path="/room/:roomCode"
        element={<Room leaveRoomCallback={clearRoomCode} />}
      />
    </Routes>
  );
};

export default App;
