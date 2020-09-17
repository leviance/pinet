const {user_socket} = require('./user_socket/user_socket')
const contact_socket = require('./contact_socket/contact_socket')

const init_socket_io = (io) => {
  user_socket(io)
  contact_socket(io)
}

module.exports = init_socket_io;