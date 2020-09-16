let config_socket_io = (io,app, session) => {
  io.use(function(socket, next) {
    session.sessionMiddleware(socket.request, socket.request.res || {}, next);
  });
  app.use(session.sessionMiddleware);
}

module.exports = config_socket_io