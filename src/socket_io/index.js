const {user_socket} = require('./user_socket/user_socket')
const contact_socket = require('./contact_socket/contact_socket')
const notifications_socket = require('./notification_socket/notification_socket')
const message_socket = require('./message_socket/message_socket')

const init_socket_io = (io) => {
  user_socket(io)
  contact_socket(io)
  notifications_socket(io)
  message_socket(io)
}

module.exports = init_socket_io;