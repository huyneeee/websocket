const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
require("dotenv").config();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      process.env.ORIGIN1,
      process.env.ORIGIN2,
      process.env.ORIGIN3,
      process.env.ORIGIN4,
      process.env.ORIGIN5,
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message_room", (data) => {
    io.to(data.room).emit("receive_message_room", data);
  });

  socket.on("send_message_all", (data) => {
    io.sockets.emit("receive_message_all", data);
  });

  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("send_message_one", (data) => {
    io.to(data.id).emit("receive_message_one", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});
const port = process.env.PORT || 8000;

app.get("/", function (req, res) {
  res.send("Hello World");
});

server.listen(port, () => {
  console.log("SERVER RUNNING");
});
