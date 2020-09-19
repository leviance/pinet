const emit_socket = require('../../helper/emit_socket')
const user_model = require('../../models/users.model')

let contact_socket = (io) => {
  io.on('connection', socket => {
    // add friend
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

    // cancel contact sent
    socket.on('cancel-request-add-friend', (data) => {
      let sender_id = socket.request.session.user_id;

      let data_to_emit = {
        receiver_id: data.receiver_id,
        sender_id: sender_id
      }

      emit_socket('receive-cancel-request-add-friend',data_to_emit, io)
    })

    // cancel contact received
    socket.on('request-cancel-contact-received', (data) => {
      let sender_id = socket.request.session.user_id;

      let data_to_emit = {
        receiver_id: data.receiver_id,
        sender_id: sender_id
      }

      emit_socket('receive-request-cancel-contact-received',data_to_emit, io)
    })

    // accept contact
    socket.on('user-accept-contact', async (data) => {
      let sender_id = socket.request.session.user_id;

      let sender_data = await user_model.find_user_by_id(sender_id)

      let data_to_emit = {
        receiver_id: data.receiver_id,
        sender_avatar: sender_data.avatar,
        sender_username: sender_data.username,
        sender_id: sender_id
      }

      emit_socket('receive-user-accept-contact',data_to_emit, io)
    })
  })
}

module.exports = contact_socket