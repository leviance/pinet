let form_data_user_send_image = null;

function preview_image_before_send(images){
  $('#chat-frame .preview-file-attachment').show()
  $('#chat-frame .preview-file-attachment').children().remove()

  images.forEach(function(image,i){
    let reader = new FileReader();

    reader.onload = function(e){
      // show img in #test-img-user-avatar for check error or loaded then if loaded display in #img-user-avatar 
      base64_img = e.target.result

      $('#chat-frame .preview-file-attachment').append(`
        <div class="img-content" >
          <img src="${base64_img}" alt="">
          <div data-name="${image.name}" class="btn-remove-file-attachment-in-preview"><i class="fa fa-times" aria-hidden="true"></i></div>
        </div>`)

        remove_file_showing_in_preview()
    }

    reader.readAsDataURL(image)
    
  })
  
  
}

function append_image_sent_to_chat_frame(message, type_of_message){
  let id_in_chat_frame = $('#chat-frame').attr('data-uid')
  let model_images_to_append = ""
  let sender_name = ""
  
   // xem chat frame đang mở có phải là cuộc trò truyện này không nếu phải thì append message vào nếu không thì thôi
   if(type_of_message == "receive"){
    type_of_message = ""

    if(message.type == "chat_group"){
      if(message.receiver.id != id_in_chat_frame) return false
      else sender_name = `<div class="conversation-name">${message.sender.username}</div>`
    }
    if(message.type == "chat_personal"){
      if(message.sender.id != id_in_chat_frame) return false
    }
  }

  if(type_of_message == "send") type_of_message = "right"

  message.images.forEach(function(image_name){
    model_images_to_append += `
      <li data-uid="${message._id}" class="list-inline-item message-img-list">
        <div>
            <a class="popup-img d-inline-block m-1" href="/assets/images/users/${image_name}">
                <img src="/assets/images/users/${image_name}" alt="" class="rounded border">
            </a>
        </div>
        <div class="message-img-link">
            <ul class="list-inline mb-0">
                <li class="list-inline-item">
                    <a href="/assets/images/users/${image_name}">
                        <i class="ri-download-2-line"></i>
                    </a>
                </li>
                <li class="list-inline-item dropdown">
                    <a class="dropdown-toggle" href="javascript:void(0)" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="ri-more-fill"></i>
                    </a>
                    <div class="dropdown-menu">
                        <a data-uid="${message._id}" class="dropdown-item btn-coppy-image-message" href="javascript:void(0)">Sao chép <i class="ri-file-copy-line float-right text-muted"></i></a>
                        <a data-uid="${message._id}" class="dropdown-item btn-forward-image-message" href="javascript:void(0)">Chuyển tiếp <i class="ri-chat-forward-line float-right text-muted"></i></a>
                        <a data-uid="${message._id}" class="dropdown-item btn-delete-image-message" href="javascript:void(0)">Xóa <i class="ri-delete-bin-line float-right text-muted"></i></a>
                    </div>
                </li>
            </ul>
        </div>
      </li>`
  })


  $('#list-messages-frame').append(`
  <li data-uid="${message._id}" class="${type_of_message}">
    <div class="conversation-list">
      <div class="chat-avatar">
          <img class="chat-persional-user-avatar" src="/assets/images/users/${message.sender.avatar}" alt="">
      </div>

      <div class="user-chat-content">
          <div class="ctext-wrap">
              <div class="ctext-wrap-content">
                  <ul class="list-inline message-img  mb-0">
                    ${model_images_to_append}
                  </ul>
                  <p class="chat-time mb-0"><i class="ri-time-line align-middle"></i> <span class="align-middle">${convert_timestamp(message.created_at)}</span></p>
              </div>
                  
              <div class="dropdown align-self-start">
                  <a class="dropdown-toggle" href="javascript:void(0)" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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

  view_message_image()
  scroll_to_bottom_chat_frame()

  $('#chat-frame .preview-file-attachment').hide()
  $('#chat-frame .preview-file-attachment').children().remove()
}

function user_send_file_image(message_type){
  $.ajax({
      url: `/user-send-file-image-${message_type}`,
      type: "POST",
      cache: false,
      contentType: false,
      processData: false,
      data: form_data_user_send_image,
      success: function(message){
        form_data_user_send_image = null
        append_image_sent_to_chat_frame(message, "send")
        update_message_in_list_message_when_send_new_message(message)
      }, 
      error: function(msg){
        alertify.error(msg)
        form_data_user_send_image = null
        $('#chat-frame .preview-file-attachment').hide()
        $('#chat-frame .preview-file-attachment').children().remove()
      }
    })
}

$(document).ready(function(){
  $('#btn-user-send-image').on('click', function(){
    $('#sub-btn-user-send-image').click();
  })

  $('#sub-btn-user-send-image').on('change', function(event){
    let images = event.target.files;
    let receiver_id = $('#chat-frame').attr('data-uid')
    
    if(!validation_images(images)) return false; 
    
    preview_image_before_send(images)

    let form_data = new FormData()
    for(let i = 0; i < images.length; i++) {
      form_data.append('message_images', images[i])
    }

    form_data.append('receiver_id', receiver_id)
    
    form_data_user_send_image = form_data
  })


  socket.on('receiver-image-message', function(message){
    message_audio.play()
    append_image_sent_to_chat_frame(message, "receive")
    increase_total_message_not_read(message)
  })
})