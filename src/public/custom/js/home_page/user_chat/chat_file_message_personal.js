let form_data_user_send_file_personal = null;

function validation_files(files){
  let limit = 1048576 * 1024;
  let result = true

  files.forEach(function(file){
    if(file.size < 1024 || file.size > limit) {
      alertify.error(message_validation_file.file_size_incorrect)
      result = false
      return false
    };
  })

  return result
}

function remove_file_attachment_in_preview(){
  $('.btn-remove-file-attachment-in-preview').unbind('click').bind('click', function(){
    let file_to_preview = $('.preview-file-attachment .file-attachment')

    let name_of_file = $(this).attr('data-name')

    if(file_to_preview.length == 1){
      $('#chat-frame .preview-file-attachment').hide()
      form_data_user_send_file_personal = null
    }

    if(form_data_user_send_file_personal != null){
      let data = form_data_user_send_file_personal.getAll('message_file')

      form_data_user_send_file_personal.delete('message_file')

      for(let i = 0; i < data.length; i++){
        if(data[i].name != name_of_file){
          form_data_user_send_file_personal.append('message_file', data[i])
        }
      }
    }
   
    $(this).parent().remove()
  })
}

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

      remove_file_attachment_in_preview()
  })
}

function append_image_sent_to_chat_frame(files_attachment, type = ""){
  files_attachment.forEach(function(file){
    $('#list-messages-frame').append(`
      <li data-uid="${file._id}" class="${type} message-file-attachment">
        <div class="conversation-list">
            <div class="chat-avatar">
                <img src="assets/images/users/${file.sender.avatar}" alt="">
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
                                        <h5 class="font-size-14 mb-1">${file.file}</h5>
                                        <p class="text-muted font-size-13 mb-0">${bytesToSize(file.file_size)}</p>
                                    </div>
                                </div>

                                <div class="ml-4">
                                    <ul class="list-inline mb-0 font-size-20">
                                        <li class="list-inline-item">
                                            <a href="/assets/file/${file.file_src}" class="text-muted">
                                                <i class="ri-download-2-line"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <p class="chat-time mb-0"><i class="ri-time-line align-middle"></i> <span class="align-middle">${convert_timestamp(file.created_at)}</span></p>
                    </div>
                        
                    <div class="dropdown align-self-start">
                        <a class="dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="ri-more-2-fill"></i>
                        </a>
                        <div class="dropdown-menu">
                          <a data-uid="${file._id}" class="dropdown-item btn-forward-message" href="javascript:void(0)">Chuyển tiếp <i class="ri-chat-forward-line float-right text-muted"></i></a>
                          <a data-uid="${file._id}" class="dropdown-item btn-delete-message" href="javascript:void(0)">Xóa <i class="ri-delete-bin-line float-right text-muted"></i></a>
                        </div>
                    </div>
                    
                </div>
            </div>
            
        </div>
      </li>`)
  })

  scroll_to_bottom_chat_frame()
  $('#chat-frame .preview-file-attachment').hide()
  $('#chat-frame .preview-file-attachment').children().remove()
}

function user_send_file_attachment(){
  $.ajax({
      url: "/user-send-file-attachment-persional",
      type: "POST",
      cache: false,
      contentType: false,
      processData: false,
      data: form_data_user_send_file_personal,
      success: function(data){
        console.log(data);
        form_data_user_send_file_personal = null
        append_image_sent_to_chat_frame(data, "right")
      }, 
      error: function(msg){
        alertify.error(msg)
        form_data_user_send_file_personal = null
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

    form_data_user_send_file_personal = form_data
  })

  socket.on('receiver-user-send-attachment-message', function(files){
    message_audio.play()

    if(files[0].sender.id == $('#chat-frame').attr('data-uid')){
      append_image_sent_to_chat_frame(files)
      scroll_to_bottom_chat_frame()
    }
  })
})