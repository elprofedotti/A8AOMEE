module.exports = (io, socket) => {
  const joinRoom = (roomId) => {
    socket.join(roomId);
  };

  const leaveRoom = (roomId) => {
    socket.leave(roomId);
  };

  const sendMessage = (roomId, message) => {
    io.to(roomId).emit('new_message', message);
  };

  socket.on('join_room', joinRoom);
  socket.on('leave_room', leaveRoom);
  socket.on('send_message', sendMessage);
};