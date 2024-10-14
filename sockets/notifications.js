module.exports = (io, socket) => {
  const subscribeToNotifications = (userId) => {
    socket.join(`user:${userId}`);
  };

  const unsubscribeFromNotifications = (userId) => {
    socket.leave(`user:${userId}`);
  };

  socket.on('subscribe_to_notifications', subscribeToNotifications);
  socket.on('unsubscribe_from_notifications', unsubscribeFromNotifications);
};