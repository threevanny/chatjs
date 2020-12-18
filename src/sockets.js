const Chat = require("./models/chat");

module.exports = (io) => {
  let users = {};

  io.on("connection", async (socket) => {
    console.log("New user connected.");

    let messages = await Chat.find({}).limit(4);
    socket.emit("load old msgs", messages);

    socket.on("new user", (data, cb) => {
      if (data in users) {
        cb(false);
      } else {
        cb(true);
        socket.nickname = data;
        users[socket.nickname] = socket;
        updateNickname();
      }
    });

    socket.on("send message", async (data, cb) => {
      //console.log(data);
      let msg = data.trim();

      if (msg.substr(0, 3) === "/w ") {
        msg = msg.substr(3);
        let index = msg.indexOf(" ");
        if (index != -1) {
          let name = msg.substring(0, index);
          msg = msg.substring(index + 1);
          if (name in users) {
            users[name].emit("whisper", {
              msg: msg,
              nick: socket.nickname,
            });
          } else {
            cb("Error! Please enter a active user.");
          }
        } else {
          cb("Erro Please enter your mesage.");
        }
      } else {
        let newMessage = new Chat({
          nick: socket.nickname,
          msg: msg,
        });
        await newMessage.save();

        io.sockets.emit("new message", {
          msg: data,
          nick: socket.nickname,
        });
      }
    });

    socket.on("disconnect", (data) => {
      if (!socket.nickname) return;

      delete users[socket.nickname];
      updateNickname();
    });

    function updateNickname() {
      io.sockets.emit("usernames", Object.keys(users));
    }
  });
};
