const emit_socket = require('../../helper/emit_socket')
const user_model = require('../../models/users.model')

let add_contact = (io) => {
  io.on('connection', socket => {
    socket.on('request-add-friend', async (data) => {
      let sender_id = socket.request.session.user_id

      let sender_data = await user_model.find_user_by_id(sender_id)

      let data_to_emit = {
        receiver_id: data.receiver_id,
        sender_avatar: sender_data.avatar,
        sender_username: sender_data.username,
        sender_id: sender_id
      }

      emit_socket('receive-request-add-friend',data_to_emit, io)
    })
  })
}

module.exports = add_contact