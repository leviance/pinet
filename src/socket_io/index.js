const {user_socket} = require('./user_socket/user_socket')
const contact_socket = require('./contact_socket/contact_socket')
const message_socket = require('./message_socket/message_socket')
const user_status = require('./user_socket/user_status')

const init_socket_io = (io) => {
  user_socket(io)
  contact_socket(io)
  message_socket(io)
  user_status(io)
}

module.exports = init_socket_io;