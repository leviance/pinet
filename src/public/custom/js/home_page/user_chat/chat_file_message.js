let form_data_for_user_send_file = null;

function preview_file_before_send(files){
  $('#chat-frame .preview-file-attachment').show()
  $('#chat-frame .preview-file-attachment').children().remove()

  files.forEach(function(file){
    $('#chat-frame .preview-file-attachment').append(`
      <div class="file-attachment">
        <div class="card p-2 mb-2">
            <div class="media align-items-center">
                <div class="avatar-sm mr-3">
                    <div class="avatar-title bg-soft-primary text-primary rounded font-size-20">
                        <i class="ri-file-text-fill"></i>
                    </div>
                </div>
                <div class="media-body">
                    <div class="text-left">
                        <h5 class="font-size-14 mb-1">${file.name}</h5>
                        <p class="text-muted font-size-13 mb-0">${file.size}</p>
                    </div>
                </div>
            </div>
        </div>
        <div data-name="${file.name}" class="btn-remove-file-attachment-in-preview"><i class="fa fa-times" aria-hidden="true"></i></div>
      </div>`)

      remove_file_showing_in_preview()
  })
}

function append_file_sent_to_chat_frame(messages, type = ""){
  messages.forEach(function(message){
    let id_in_chat_frame = $('#chat-frame').attr('data-uid')
    let sender_name = ""

     // xem chat frame đang mở có phải là cuộc trò truyện này không nếu phải thì append message vào nếu không thì thôi
    if(type == ""){
      if(message.type == "chat_group"){
        if(message.receiver.id != id_in_chat_frame) return false
        else sender_name = `<div class="conversation-name">${message.sender.username}</div>`
      }
      if(message.type == "chat_personal"){
        if(message.sender.id != id_in_chat_frame) return false
      }
    }

    $('#list-messages-frame').append(`
      <li data-uid="${message._id}" class="${type} message-file-attachment">
        <div class="conversation-list">
            <div class="chat-avatar">
                <img src="assets/images/users/${message.sender.avatar}" alt="">
            </div>

            <div class="user-chat-content">
                <div class="ctext-wrap">
            
                    <div class="ctext-wrap-content">
                        <div class="card p-2 mb-2">
                            <div class="media align-items-center">
                                <div class="avatar-sm mr-3">
                                    <div class="avatar-title bg-soft-primary text-primary rounded font-size-20">
                                        <i class="ri-file-text-fill"></i>
                                    </div>
                                </div>
                                <div class="media-body">
                                    <div class="text-left">
                                        <h5 class="font-size-14 mb-1">${message.file}</h5>
                                        <p class="text-muted font-size-13 mb-0">${bytesToSize(message.file_size)}</p>
                                    </div>
                                </div>

                                <div class="ml-4">
                                    <ul class="list-inline mb-0 font-size-20">
                                        <li class="list-inline-item">
                                            <a href="/assets/file/${message.file_src}" class="text-muted">
                                                <i class="ri-download-2-line"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <p class="chat-time mb-0"><i class="ri-time-line align-middle"></i> <span class="align-middle">${convert_timestamp(message.created_at)}</span></p>
                    </div>
                        
                    <div class="dropdown align-self-start">
                        <a class="dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="ri-more-2-fill"></i>
                        </a>
                        <div class="dropdown-menu">
                          <a data-uid="${message._id}" class="dropdown-item btn-forward-message" href="javascript:void(0)">Chuyển tiếp <i class="ri-chat-forward-line float-right text-muted"></i></a>
                          <a data-uid="${message._id}" class="dropdown-item btn-delete-message" href="javascript:void(0)">Xóa <i class="ri-delete-bin-line float-right text-muted"></i></a>
                        </div>
                    </div>
                    
                </div>
                ${sender_name}
            </div>
        </div>
      </li>`)
  })

  scroll_to_bottom_chat_frame()
  $('#chat-frame .preview-file-attachment').hide()
  $('#chat-frame .preview-file-attachment').children().remove()
}

function user_send_file_attachment(message_type){
  $.ajax({
      url: `/user-send-file-attachment-${message_type}`,
      type: "POST",
      cache: false,
      contentType: false,
      processData: false,
      data: form_data_for_user_send_file,
      success: function(messages){
        form_data_for_user_send_file = null
        append_file_sent_to_chat_frame(messages, "right")
        update_message_in_list_message_when_send_new_message(messages[0])
      }, 
      error: function(msg){
        alertify.error(msg)
        form_data_for_user_send_file = null
        $('#chat-frame .preview-file-attachment').hide()
        $('#chat-frame .preview-file-attachment').children().remove()
      }
    })
}

$(document).ready(function(){
  $('#btn-user-send-attachment-file').on('click', function(){
    $('#sub-btn-user-send-attachment-file').click()
  })

  $('#sub-btn-user-send-attachment-file').on('change', function(event){
    let files = event.target.files;
    let receiver_id = $('#chat-frame').attr('data-uid')
     
    if(!validation_files(files)) return false; 

    preview_file_before_send(files)

    let form_data = new FormData()
    for(let i = 0; i < files.length; i++) {
      form_data.append('message_file', files[i])
    }

    form_data.append('receiver_id', receiver_id)

    form_data_for_user_send_file = form_data
  })

  socket.on('receiver-user-send-attachment-message', function(messages){
    message_audio.play()
    append_file_sent_to_chat_frame(messages)
    increase_total_message_not_read(messages[0])
  })
})