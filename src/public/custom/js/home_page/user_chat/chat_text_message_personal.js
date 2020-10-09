function append_text_message_sent_to_chat_frame(data){
  $('#list-messages-frame').append(`
      <li data-uid="${data._id}" class="right">
        <div class="conversation-list">
            <div class="chat-avatar">
                <img src="assets/images/users/${data.sender.avatar}" alt="">
            </div>

            <div class="user-chat-content">
                <div class="ctext-wrap">
                    <div class="ctext-wrap-content">
                        <p class="mb-0">
                            ${data.text}
                        </p>
                        <p class="chat-time mb-0"><i class="ri-time-line align-middle"></i> <span class="align-middle">${data.time_stamp}</span></p>
                    </div>
                        
                    <div class="dropdown align-self-start">
                        <a class="dropdown-toggle" href="javascript:void(0)" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="ri-more-2-fill"></i>
                        </a>
                        <div class="dropdown-menu">
                            <a class="dropdown-item btn-copy-text-message" href="javascript:void(0)">Copy <i class="ri-file-copy-line float-right text-muted"></i></a>
                            <a data-uid="${data._id}" class="dropdown-item btn-forward-message" href="javascript:void(0)">Chuyển tiếp <i class="ri-chat-forward-line float-right text-muted"></i></a>
                            <a data-uid="${data._id}" class="dropdown-item btn-delete-message" href="javascript:void(0)">Xóa <i class="ri-delete-bin-line float-right text-muted"></i></a>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
      </li>`)

      scroll_to_bottom_chat_frame()
      convert_unicode_to_emoji()
}

function append_message_to_list_chat(data){
  let check_is_in_chat_list = $('#chat-message-list').find(`li[data-uid=${data._id}]`)
  let message =""

  if(data.text != null) message = `Bạn: ${data.text}`
  if(data.file != null) message = "Bạn đã gửi 1 file đính kèm"
  if(data.images.length > 0) message = "Bạn đã gửi 1 hình ảnh"

  if(check_is_in_chat_list.length === 0){
    $('#chat-message-list').prepend(`
      <li data-uid="${data._id}" class="show-modal-chat-persional" chat-type="chat_personal" > 
        <a href="javascript: void(0);">
            <div class="media">
                <div class="chat-user-img online align-self-center mr-3">
                        <img src="/assets/images/users/${data.receiver.avatar}" class="rounded-circle avatar-xs" alt="">
                    <span class="user-status"></span>
                </div>

                <div class="media-body overflow-hidden">
                    <h5 class="text-truncate font-size-15 mb-1">${data.receiver.username}</h5>
                    <p class="chat-user-message text-truncate mb-0">${message}</p>
                </div>
                <div class="font-size-11">${data.time_stamp}</div>
            </div>
        </a>
    </li>`)
  }

  show_modal_chat_personal()
}

function send_text_message(message, receiver_id){
  let time_stamp = get_current_time()

  $.ajax({
    url: "/user-send-text-message-persional",
    type: "POST",
    data: { message, receiver_id},
    success: function(data){
      data.time_stamp = time_stamp
      append_text_message_sent_to_chat_frame(data)
      append_message_to_list_chat(data)
    },
    error: function(msg){
      alertify.error(msg)
    }
  })

}


function append_received_text_message_to_chat_frame(data) {
  //  check modal chat with user send message open
  let current_user_id_in_chat_modal = $('#chat-frame').attr('data-uid')

  if(current_user_id_in_chat_modal == data.sender_id){
    let sender_avatar = $('#chat-frame .chat-persional-user-avatar').attr('src')
    let time_stamp = get_current_time()

    $('#list-messages-frame').append(`
    <li data-uid="${data.sender_id}" class="">
      <div class="conversation-list">
          <div class="chat-avatar">
              <img src="${sender_avatar}" alt="">
          </div>
  
          <div class="user-chat-content">
              <div class="ctext-wrap">
                  <div class="ctext-wrap-content">
                      <p class="mb-0">
                          ${data.message}
                      </p>
                      <p class="chat-time mb-0"><i class="ri-time-line align-middle"></i> <span class="align-middle">${time_stamp}</span></p>
                  </div>
                      
                  <div class="dropdown align-self-start">
                      <a class="dropdown-toggle" href="javascript:void(0)" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i class="ri-more-2-fill"></i>
                      </a>
                      <div class="dropdown-menu">
                          <a class="dropdown-item btn-copy-text-message" href="javascript:void(0)">Copy <i class="ri-file-copy-line float-right text-muted"></i></a>
                          <a data-uid="${data.sender_id}" class="dropdown-item btn-forward-message" href="javascript:void(0)">Chuyển tiếp <i class="ri-chat-forward-line float-right text-muted"></i></a>
                          <a data-uid="${data.sender_id}" class="dropdown-item btn-delete-message" href="javascript:void(0)">Xóa <i class="ri-delete-bin-line float-right text-muted"></i></a>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </li>`)

    scroll_to_bottom_chat_frame()
    convert_unicode_to_emoji()
  }
}


$(document).ready(function() {  
  socket.on('receiver-user-send-text-message', function(data){
    append_received_text_message_to_chat_frame(data)
    message_audio.play()
  })
  
});