const {user_socket} = require('./user_socket/user_socket')
const add_contact = require('./contact_socket/add_contact')

const init_socket_io = (io) => {
  user_socket(io)
  add_contact(io)
}

module.exports = init_socket_io;