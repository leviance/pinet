const {user_socket} = require('./user_socket/user_socket')

const init_socket_io = (io) => {
  user_socket(io)
}

module.exports = init_socket_io;