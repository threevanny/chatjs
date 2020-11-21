const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const path = require("path");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/chat", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((db) => console.log("MongoDB database is ready to use."))
  .catch((err) => console.log(err));

const app = express();
const server = http.createServer(app);
const io = socketio.listen(server);

require("./sockets")(io);

app.use(express.static(path.join(__dirname, "public")));

app.set("port", process.env.PORT || 3000);

server.listen(app.get("port"), () => {
  console.log("The server is listening on port: ", app.get("port"));
});
