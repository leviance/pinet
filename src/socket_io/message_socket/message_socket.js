const {contact_services, message_services} = require('../../services/index')
const emit_socket = require('../../helper/emit_socket')

let message_socket = (io) => {
  io.on('connection', socket => {
    socket.on('request-user-send-text-message', async (data) => {
      let sender_id = socket.request.session.user_id
      let receiver_id = data.receiver_id

      check_has_contact = await contact_services.check_has_contact(sender_id,receiver_id)

      if(check_has_contact != null) {
        message_services.user_send_text_message_persional(sender_id,receiver_id, data.message)

        let data_to_emit = {
          receiver_id: receiver_id,
          sender_id: sender_id,
          message: data.message,
          time_stamp: data.time_stamp
        }

        emit_socket("receiver-user-send-text-message",data_to_emit, io)
      }
    })

  })
}

module.exports = message_socket