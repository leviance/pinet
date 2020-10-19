/**
 * status_send_request_user_typing = false
 * 
 * set it for just emit socket once if not set app will emit socket many time
 * 
 * */
let timer_user_typing, timeoutVal_user_typing = 3000, status_send_request_user_typing = false;

function show_user_is_typing(){
  window.clearTimeout(timer_user_typing)

  let receiver_id = $('#chat-frame').attr('data-uid')
  let chat_type = $('#chat-frame').attr('chat-type')

  let data_to_emit = {
    receiver_id,
    chat_type
  }

  if(chat_type == "chat_personal" && status_send_request_user_typing == false){
    socket.emit('user-is-typing-personal',data_to_emit)
  }
  if(chat_type == "chat_group" && status_send_request_user_typing == false){
    socket.emit('user-is-typing-group',data_to_emit)
  }

  status_send_request_user_typing = true
}

function detected_user_stop_typing() {
	window.clearTimeout(timer_user_typing);
	timer_user_typing = window.setTimeout(() => {
    let receiver_id = $('#chat-frame').attr('data-uid')
    let chat_type = $('#chat-frame').attr('chat-type')

    let data_to_emit = {
    receiver_id,
    chat_type
    }

    if(chat_type == "chat_personal"){
      socket.emit('user-is-stop_typing-personal',data_to_emit)
    }
    if(chat_type == "chat_group"){
      socket.emit('user-is-stop-typing-group',data_to_emit)
    }

    status_send_request_user_typing = false
  }, timeoutVal_user_typing);
}

function typing_model(avatar, username){
  let show_name = ""
  if(username) show_name = `<div class="conversation-name">${username}</div>`
  return `<li class="typing" >
          <div class="conversation-list">
              <div class="chat-avatar">
                  <img src="assets/images/users/${avatar}" alt="">
              </div>
              
              <div class="user-chat-content">
                  <div class="ctext-wrap">
                      <div class="ctext-wrap-content">
                          <p class="mb-0">
                              typing
                              <span class="animate-typing">
                                  <span class="dot"></span>
                                  <span class="dot"></span>
                                  <span class="dot"></span>
                              </span>
                          </p>
                      </div>
                  </div>

                  ${show_name}
              </div>
              
          </div>
        </li>`
}

function show_user_is_typing_personal(){
  socket.on('receive-user-is-typing-personal', function(data){
    if($('#chat-frame').attr('data-uid') == data.sender_id){
      let typing_div = $('#list-messages-frame .typing')
      if(typing_div.length == 0){
        $('#list-messages-frame').append(typing_model(data.sender_avatar, null))
        scroll_to_bottom_chat_frame()
      }
    }
  })
}

function show_user_is_typing_group(){
  socket.on('receive-user-is-typing-group', function(data){
    if($('#chat-frame').attr('data-uid') == data.group_id){
      let typing_div = $('#list-messages-frame .typing')
      if(typing_div.length == 0){
        $('#list-messages-frame').append(typing_model(data.sender_avatar, data.sender_username))
        scroll_to_bottom_chat_frame()
      }
    }
  })
}

function user_stop_typing(){
  socket.on('receive-user-is-stop_typing-personal', function(data){
    if($('#chat-frame').attr('data-uid') == data.sender_id){
      $('#list-messages-frame .typing').remove()
    }
  })

  socket.on('receive-user-is-stop_typing-group', function(data){
    if($('#chat-frame').attr('data-uid') == data.group_id){
      $('#list-messages-frame .typing').remove()
    }
  })
}

$(document).ready(function(){
  show_user_is_typing_personal()
  show_user_is_typing_group()
  user_stop_typing()
})