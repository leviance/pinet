const {contact_services, message_services, group_services} = require('../../services/index')
const emit_socket = require('../../helper/emit_socket')

let message_socket = (io) => {
  io.on('connection', socket => {
    
    socket.on('request-user-send-text-message', async (data) => {
      let sender_id = socket.request.session.user_id
      let receiver_id = data.receiver_id

      check_has_contact = await contact_services.check_has_contact(sender_id,receiver_id)

      if(check_has_contact != null) {
        message_services.user_send_text_message_personal(sender_id,receiver_id, data.message)

        let data_to_emit = {
          receiver_id: receiver_id,
          sender_id: sender_id,
          message: data.message,
          time_stamp: data.time_stamp
        }

        emit_socket("receiver-user-send-text-message",data_to_emit, io)
      }
    })

    socket.on('user-is-typing-personal', data => {
      let data_to_emit = {
        receiver_id: data.receiver_id,
        chat_type: data.chat_type,
        sender_id: socket.request.session.user_id,
        sender_avatar: socket.request.session.avatar
      }

      emit_socket("receive-user-is-typing-personal",data_to_emit, io)
    })

    socket.on('user-is-typing-group', async (data) => {
      try {
        let data_to_emit = {
          group_id: data.receiver_id,
          chat_type: data.chat_type,
          sender_id: socket.request.session.user_id,
          sender_avatar: socket.request.session.avatar,
          sender_username: socket.request.session.username,
        }
        
        let list_id_members = await group_services.get_list_members(data_to_emit.group_id,data_to_emit.sender_id)

        list_id_members.forEach(member_id => {
          data_to_emit.receiver_id = member_id
          emit_socket("receive-user-is-typing-group",data_to_emit, io)
        })
      } catch (error) {
        console.log("Someone try hacking socket.on('user-is-typing-group')")
      }
    })

    socket.on('user-is-stop_typing-personal', data => {
      let data_to_emit = {
        receiver_id: data.receiver_id,
        chat_type: data.chat_type,
        sender_id: socket.request.session.user_id,
      }

      emit_socket("receive-user-is-stop_typing-personal",data_to_emit, io)
    })

    socket.on('user-is-stop-typing-group', async data => {
      let data_to_emit = {
        group_id: data.receiver_id,
        chat_type: data.chat_type,
        sender_id: socket.request.session.user_id,
      }

      let list_id_members = await group_services.get_list_members(data_to_emit.group_id,data_to_emit.sender_id)

      list_id_members.forEach(member_id => {
        data_to_emit.receiver_id = member_id
        emit_socket("receive-user-is-stop_typing-group",data_to_emit, io)
      })
    })

  })
}

module.exports = message_socket