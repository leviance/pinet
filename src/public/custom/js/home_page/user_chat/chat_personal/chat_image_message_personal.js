let form_data_user_send_image_personal = null;

function validation_images(images){
  const accept_type = ['image/jpg','image/png','image/gif', 'image/jpeg']
  let limit = 1048576 * 10;
  let result = true

  images.forEach(function(image){
    if(!accept_type.includes(image.type)) {
      alertify.error(message_validation_file.image_type_incorrect)
      result = false
      return false
    };

    if(image.size < 1024 || image.size > limit) {
      alertify.error(message_validation_file.image_size_incorrect)
      result = false
      return false
    };
  })

  return result
}

function remove_file_image_in_preview(){
  $('.btn-remove-file-attachment-in-preview').unbind('click').bind('click', function(){
    let image_to_preview =  $('.preview-file-attachment .img-content')
    let file_to_preview = $('.preview-file-attachment .file-attachment')

    let name_of_file = $(this).attr('data-name')

    if(image_to_preview.length == 1){
      $('#chat-frame .preview-file-attachment').hide()
      form_data_user_send_image_personal = null
    }

    if(file_to_preview.length == 1){
      $('#chat-frame .preview-file-attachment').hide()
      form_data_user_send_file_personal = null
    }

    if(form_data_user_send_image_personal != null){
      let data = form_data_user_send_image_personal.getAll('message_images')

      form_data_user_send_image_personal.delete('message_images')

      for(let i = 0; i < data.length; i++){
        if(data[i].name != name_of_file){
          form_data_user_send_image_personal.append('message_images', data[i])
        }
      }
    }
   
    $(this).parent().remove()
  })
}

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

        remove_file_image_in_preview()
    }

    reader.readAsDataURL(image)
    
  })
  
  
}

function append_image_sent_to_chat_frame(data){
  let message_id = data._id
  let avatar = $('#img-user-avatar').attr('src')
  let time_stamp = get_current_time()

  let model_images_to_append = ""

  data.images.forEach(function(image_name){
    model_images_to_append += `
      <li data-uid="${message_id}" class="list-inline-item message-img-list">
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
                        <a data-uid="${message_id}" class="dropdown-item btn-coppy-image-message" href="javascript:void(0)">Sao chép <i class="ri-file-copy-line float-right text-muted"></i></a>
                        <a data-uid="${message_id}" class="dropdown-item btn-forward-image-message" href="javascript:void(0)">Chuyển tiếp <i class="ri-chat-forward-line float-right text-muted"></i></a>
                        <a data-uid="${message_id}" class="dropdown-item btn-delete-image-message" href="javascript:void(0)">Xóa <i class="ri-delete-bin-line float-right text-muted"></i></a>
                    </div>
                </li>
            </ul>
        </div>
      </li>`
  })


  $('#list-messages-frame').append(`
  <li data-uid="${message_id}" class="right">
    <div class="conversation-list">
      <div class="chat-avatar">
          <img class="chat-persional-user-avatar" src="${avatar}" alt="">
      </div>

      <div class="user-chat-content">
          <div class="ctext-wrap">
              <div class="ctext-wrap-content">
                  <ul class="list-inline message-img  mb-0">
                    ${model_images_to_append}
                  </ul>
                  <p class="chat-time mb-0"><i class="ri-time-line align-middle"></i> <span class="align-middle">${time_stamp}</span></p>
              </div>
                  
              <div class="dropdown align-self-start">
                  <a class="dropdown-toggle" href="javascript:void(0)" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <i class="ri-more-2-fill"></i>
                  </a>
                  <div class="dropdown-menu">
                      <a data-uid="${message_id}" class="dropdown-item btn-forward-message" href="javascript:void(0)">Chuyển tiếp <i class="ri-chat-forward-line float-right text-muted"></i></a>
                      <a data-uid="${message_id}" class="dropdown-item btn-delete-message" href="javascript:void(0)">Xóa <i class="ri-delete-bin-line float-right text-muted"></i></a>
                  </div>
              </div>
          </div>
      </div>
    </div>
  </li>`)

  view_message_image()
  scroll_to_bottom_chat_frame()

  $('#chat-frame .preview-file-attachment').hide()
  $('#chat-frame .preview-file-attachment').children().remove()
}

function user_send_file_image(){
  $.ajax({
      url: "/user-send-file-image-persional",
      type: "POST",
      cache: false,
      contentType: false,
      processData: false,
      data: form_data_user_send_image_personal,
      success: function(data){
        append_image_sent_to_chat_frame(data)
        
        form_data_user_send_image_personal = null
        let data_to_emit = {
          receiver_id: data.receiver.id,
          message_id: data._id,
          images: data.images,
        }

        socket.emit('request-user-send-image-message', data_to_emit)
      }, 
      error: function(msg){
        alertify.error(msg)
        form_data_user_send_image_personal = null
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
    
    form_data_user_send_image_personal = form_data
  })


  socket.on('receiver-user-send-image-message', function(data){
    message_audio.play()
    let time_stamp = get_current_time()

    if(data.sender_id == $('#chat-frame').attr('data-uid')){
      let sender_avatar = $('#chat-frame .chat-persional-user-avatar').attr('src')
      let model_images_to_append = ""
      
      data.images.forEach(function(image_name){
        model_images_to_append += `
          <li data-uid="${data.message_id}" class="list-inline-item message-img-list">
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
                            <a data-uid="${data.message_id}" class="dropdown-item btn-coppy-image-message" href="javascript:void(0)">Sao chép <i class="ri-file-copy-line float-right text-muted"></i></a>
                            <a data-uid="${data.message_id}" class="dropdown-item btn-forward-image-message" href="javascript:void(0)">Chuyển tiếp <i class="ri-chat-forward-line float-right text-muted"></i></a>
                            <a data-uid="${data.message_id}" class="dropdown-item btn-delete-image-message" href="javascript:void(0)">Xóa <i class="ri-delete-bin-line float-right text-muted"></i></a>
                        </div>
                    </li>
                </ul>
            </div>
          </li>`
      })
    
    
      $('#list-messages-frame').append(`
      <li data-uid="${data.message_id}" >
        <div class="conversation-list">
          <div class="chat-avatar">
              <img class="chat-persional-user-avatar" src="${sender_avatar}" alt="">
          </div>
    
          <div class="user-chat-content">
              <div class="ctext-wrap">
                  <div class="ctext-wrap-content">
                      <ul class="list-inline message-img  mb-0">
                        ${model_images_to_append}
                      </ul>
                      <p class="chat-time mb-0"><i class="ri-time-line align-middle"></i> <span class="align-middle">${time_stamp}</span></p>
                  </div>
                      
                  <div class="dropdown align-self-start">
                      <a class="dropdown-toggle" href="javascript:void(0)" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <i class="ri-more-2-fill"></i>
                      </a>
                      <div class="dropdown-menu">
                          <a data-uid="${data.message_id}" class="dropdown-item btn-forward-message" href="javascript:void(0)">Chuyển tiếp <i class="ri-chat-forward-line float-right text-muted"></i></a>
                          <a data-uid="${data.message_id}" class="dropdown-item btn-delete-message" href="javascript:void(0)">Xóa <i class="ri-delete-bin-line float-right text-muted"></i></a>
                      </div>
                  </div>
              </div>
          </div>
        </div>
      </li>`)
    
      view_message_image()
      scroll_to_bottom_chat_frame()
    }
    
  })
})