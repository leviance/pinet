const emit_socket = require('../helper/emit_socket')

let user_send_text_message_group = (result_send, group_data,io) => {
  let list_members_id_in_group = group_data.members
  list_members_id_in_group.push(group_data.user_created_id)

  list_members_id_in_group.forEach((member_id) => {
    // do not send socket for user send message
    if(member_id != result_send.sender.id){
      let data_to_emit = result_send
      data_to_emit.receiver_id = member_id

      emit_socket("receiver-new-group-text-message",data_to_emit, io)
    }
  })
}

let user_send_text_message_personal = (message , io) => {
  let data_to_emit = message
  data_to_emit.receiver_id = message.receiver.id

  emit_socket("receive-personal-text-message",data_to_emit, io)
}

module.exports = {
  user_send_text_message_group,
  user_send_text_message_personal
}