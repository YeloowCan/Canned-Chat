const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const port = 3001;

const app = express();
const server = http.Server(app);
const io = socketIo(server);

let socketSet = new Set();

io.on('connection', (socket) => {
  socketSet.add(socket);
  socket.on('message', (data) => {
    console.log('服务端收到: ', data);
    socketSet.forEach((ws) => {
      if (ws.connected) {
        ws.send(data);
      } else {
        socketSet.delete(ws);
      }
    });
  });

  socket.on('err', (err) => {
    socket.send(err);
  });
});

server.listen(port);

app.listen(8080, 'localhost', () => {
  console.log('服务器已启动');
});
