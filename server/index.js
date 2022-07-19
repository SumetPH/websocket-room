const express = require("express");
const cors = require("cors");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = [
  { id: 0, name: "Admin" },
  { id: 1, name: "One" },
  { id: 2, name: "Two" },
];

app.use(cors());

app.get("/", (req, res) => {
  io.emit("noti", "HI");
  return res.json("Hello World.");
});

app.get("/users", (req, res) => {
  return res.json({ users });
});

app.get("/noti/:id", (req, res) => {
  const date = new Date();
  io.to(req.params.id).emit("msg", {
    msg: "from api",
    date: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`,
  });
  return res.json(`send noti to id:${req.params.id}`);
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("joined", (id) => {
    const idStr = String(id);
    console.log({ joined: idStr });
    socket.join(idStr);
    io.to(idStr).emit("joinedCallback", `join to id:${idStr}`);
  });

  socket.on("sendTo", (payload) => {
    console.log({ payload });
    io.to(String(payload.id)).emit("msg", payload);
  });
});

server.listen(8000, () => {
  console.log("listening on http://localhost:8000");
});
