const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const osc = require("osc");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: 57121
});

let currentHumidity = 0;

udpPort.on("message", function (msg) {
  if (msg.address === "/humidity") {
    currentHumidity = msg.args[0];
    console.log("습도 수신:", currentHumidity);

    io.emit("humidity", currentHumidity);  // 웹소켓 브로드캐스트
  }
});

app.get("/api/humidity", (req, res) => {
  res.json({ humidity: currentHumidity });
});

udpPort.open();

server.listen(3000, () => {
  console.log("🌐 서버 실행 중: http://localhost:3000");
});