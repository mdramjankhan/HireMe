// services/socket.js
import io from 'socket.io-client';

let socket;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL); // Vite syntax
  }
  return socket;
};