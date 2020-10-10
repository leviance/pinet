function send_text_message_group(message, group_id){
  $.ajax({
    url: "/user-send-text-message-group",
    type: "POST",
    data: { message, group_id},
    success: function(message){
      if(message.receiver.id == $('#chat-frame').attr('data-uid')){
        append_message_group_to_chat_frame([message])
      }
      append_message_to_list_chat(message)
    },
    error: function(msg){
      alertify.error(msg)
    }
  })
}

$(document).ready(function(){
  socket.on('receiver-new-group-text-message', function(message){
    if(message.receiver.id == $('#chat-frame').attr('data-uid')){
      append_message_group_to_chat_frame([message])
    }
    append_message_to_list_chat(message)
    message_audio.play()
  })
})