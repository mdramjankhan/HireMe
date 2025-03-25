const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer();
const io = socketIo(server, { cors: { origin: 'http://localhost:5173' } });
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => console.log('Client disconnected'));
});
server.listen(5000, () => console.log('Test server on port 5000'));