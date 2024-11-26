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

function calculatePeopleInRoom(socket, room) {
  let size = io.sockets.adapter.rooms.get(room).size;
  let info = [room, size];
  socket.nsp.to(room).emit("people-in-room", info);
}

function joinRoom(socket, room) {
  socket.join(room);
  calculatePeopleInRoom(socket, room);
}

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join-room", (data) => joinRoom(socket, data));

  socket.on("send-message", (data) => {
    socket.to(data.room).emit("receive-message", data);
  });
});

server.listen(5174, () => console.log("Server is running."));
