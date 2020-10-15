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

let user_send_file_attachment_group = (files_message, group_profile, io) => {
  let list_members = group_profile.members
  list_members.push(group_profile.user_created_id)

  let data_to_emit = files_message

  list_members.forEach( member_id => {
    if(member_id != files_message[0].sender.id){
      data_to_emit.receiver_id = member_id
      emit_socket('receiver-user-send-attachment-message',data_to_emit, io)
    }
  })
}

let user_send_file_image_personal = (message, io) => {
  let data_to_emit = message
  data_to_emit.receiver_id = message.receiver.id

  emit_socket("receiver-image-message",data_to_emit, io)
}

let user_send_file_image_group = (images_message,group_profile,io) => {
  let data_to_emit = images_message
  let list_members = group_profile.members
  list_members.push(group_profile.user_created_id)

  list_members.forEach(member_id => {
    if(member_id != images_message.sender.id){
      data_to_emit.receiver_id = member_id

      emit_socket("receiver-image-message", data_to_emit, io)
    }
  })
}

module.exports = {
  user_send_text_message_group,
  user_send_text_message_personal,
  user_send_file_attachment_group,
  user_send_file_image_personal,
  user_send_file_image_group
}