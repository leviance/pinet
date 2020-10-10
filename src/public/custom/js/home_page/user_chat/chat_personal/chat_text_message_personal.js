function send_text_message_personal(message, receiver_id){
  $.ajax({
    url: "/user-send-text-message-persional",
    type: "POST",
    data: { message, receiver_id},
    success: function(message){
      if(message.receiver.id == $('#chat-frame').attr('data-uid')){
        append_message_personal_to_chat_frame([message])
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
    if(message.sender.id == $('#chat-frame').attr('data-uid')){
      append_message_personal_to_chat_frame([message])
    }
    append_message_to_list_chat(message)
    message_audio.play()
  })
});