function send_text_message_personal(message, receiver_id){
  $.ajax({
    url: "/user-send-text-message-personal",
    type: "POST",
    data: { message, receiver_id},
    success: function(message){
      if(message.receiver.id == $('#chat-frame').attr('data-uid')){
        append_message_personal_to_chat_frame([message])
        update_message_in_list_message_when_send_new_message(message)
        $('#list-messages-frame .typing').remove()
      }
      // cập nhật tin nhắn trong mesage list bằng tin nhắn vừa gửi 
    },
    error: function(msg){
      alertify.error(msg)
    }
  })

}

$(document).ready(function() {  
  socket.on('receive-personal-text-message', function(message){
    message_audio.play()
    if(message.sender.id == $('#chat-frame').attr('data-uid')){
      append_message_personal_to_chat_frame([message])
      $('#list-messages-frame .typing').remove()
    }

    append_message_to_list_chat(message)
    increase_total_message_not_read(message)
  })
});