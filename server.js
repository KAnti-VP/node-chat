import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users
let users = {};

io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  socket.on('set username', (username) => {
    if (users[username]) {
      socket.emit('user exists', `${username} username is taken! Try some other username.`);
    } else {
      users[username] = socket.id;
      socket.username = username;
      console.log(`${username} logged in`);
      socket.emit('user set', username);
    }
  });

  socket.on('disconnect', () => {
    const disconnectedUser = Object.keys(users).find(key => users[key] === socket.id);
    console.log(`User disconnected: ${socket.id}`);
    delete users[disconnectedUser];
  });

  socket.on('chat message', (msg) => {
    console.log(`Message: ${msg}`);
    io.emit('chat message', { user: socket.username, message: msg });
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
