const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

function calculatePeopleInRoom(socket, room, minus) {
  let size = io.sockets.adapter.rooms.get(room).size;
  let info = [room, size - minus];
  socket.nsp.to(room).emit("people-in-room", info);
}

function joinRoom(socket, current, newroom) {
  socket.join(newroom);
  if (current !== "") {
    calculatePeopleInRoom(socket, current, 1);
  }
  calculatePeopleInRoom(socket, newroom, 0);
}

io.on("connection", (socket) => {
  let currentRoom = "";

  socket.on("join-room", (data) => {
    joinRoom(socket, data.room, data.newRoom);
    currentRoom = data.newRoom;
  });

  socket.on("send-message", (data) => {
    socket.to(data.room).emit("receive-message", data);
  });

  socket.on("disconnect", function () {
    if (currentRoom !== "") {
      calculatePeopleInRoom(socket, currentRoom, 0);
    }
  });
});

server.listen(5174, () => console.log("Server is running."));
