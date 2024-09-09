const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chat-space-frontend-gamma.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = 8080;

app.use(
  cors({
    origin: "https://chat-space-frontend-gamma.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to the server 👨‍💻");
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("join-room", (room, username) => {
    socket.join(room);
    console.log(`User ${username || socket.id} joined room ${room}`);

    io.to(room).emit(
      "userJoined",
      `${username || socket.id} has joined the room`
    );
  });

  socket.on("message", ({ room, message }) => {
    console.log(`Message in ${room}: ${message}`);
    io.to(room).emit("receive-message", message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("Listening on port " + PORT);
});
