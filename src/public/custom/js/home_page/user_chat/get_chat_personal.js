function message_let_talk_together(partner_name){
  let modal_list_messages = $('#list-messages-frame');

  modal_list_messages.append(`
    <li class="message-let-talk-together" >
      <div class="conversation-list">
        <div class="user-chat-content">
          <div class="ctext-wrap-content">
            <p class="mb-0"> Hãy gửi lời chào đến ${partner_name} </p>
          </div>
        </div>
      </div>
    </li>`)
}

function model_messae_img(message, image){
  return `<li data-uid="${message._id}" class="list-inline-item message-img-list">
            <div>
                <a class="popup-img d-inline-block m-1" href="/assets/images/users/${image}" >
                    <img src="/assets/images/users/${image}" alt="" class="rounded border">
                </a>
            </div>
            <div class="message-img-link">
                <ul class="list-inline mb-0">
                    <li class="list-inline-item">
                        <a href="/assets/images/users/${image}">
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
}

function render_img_mess_to_chat_frame(message){
  let partner_id = $('#chat-frame').attr('data-uid');
  let model_images = ``

  message.images.forEach(function(image){
    model_images += model_messae_img(message, image)
  })

  // neu message do người dùng gửi đi thì gắn class right
  let type_of_message = ""

  // if the message is sent by user
  if(message.sender.id != partner_id){
    type_of_message = "right"
  }

  $('#list-messages-frame').prepend(`
  <li data-uid="${message._id}" class="${type_of_message}">
    <div class="conversation-list">
      <div class="chat-avatar">
          <img class="chat-persional-user-avatar" src="assets/images/users/${message.sender.avatar}" alt="">
      </div>

      <div class="user-chat-content">
          <div class="ctext-wrap">
              <div class="ctext-wrap-content">
                  <ul class="list-inline message-img  mb-0">
                    ${model_images}
                  </ul>
                  <p class="chat-time mb-0"><i class="ri-time-line align-middle"></i> <span class="align-middle">${message.human_time}</span></p>
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
      </div>
    </div>
  </li>
  `)
}

function render_text_mess_to_chat_frame(message, type){
  // if user  sent message
  let type_of_message = ""

  if(type == "sent"){
    type_of_message = "right"
  }

  $('#list-messages-frame').prepend(`
  <li data-uid="${message._id}" class="${type_of_message}">
    <div class="conversation-list">
        <div class="chat-avatar">
            <img src="assets/images/users/${message.sender.avatar}" alt="">
        </div>

        <div class="user-chat-content">
            <div class="ctext-wrap">
                <div class="ctext-wrap-content">
                    <p class="mb-0">
                        ${message.text}
                    </p>
                    <p class="chat-time mb-0"><i class="ri-time-line align-middle"></i> <span class="align-middle">${message.human_time}</span></p>
                </div>
                    
                <div class="dropdown align-self-start">
                    <a class="dropdown-toggle" href="javascript:void(0)" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="ri-more-2-fill"></i>
                    </a>
                    <div class="dropdown-menu">
                        <a class="dropdown-item btn-copy-text-message" href="javascript:void(0)">Copy <i class="ri-file-copy-line float-right text-muted"></i></a>
                        <a data-uid="${message._id}" class="dropdown-item btn-forward-message" href="javascript:void(0)">Chuyển tiếp <i class="ri-chat-forward-line float-right text-muted"></i></a>
                        <a data-uid="${message._id}" class="dropdown-item btn-delete-message" href="javascript:void(0)">Xóa <i class="ri-delete-bin-line float-right text-muted"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </li>`)
}

function render_file_message_to_chat_frame(message){
  let partner_id = $('#chat-frame').attr('data-uid');

  // neu message do người dùng gửi đi thì gắn class right
  let type_of_message = ""

  // if the message is sent by user
  if(message.sender.id != partner_id){
    type_of_message = "right"
  }

  $('#list-messages-frame').prepend(`
  <li data-uid="${message._id}" class="${type_of_message}">
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
                                    <p class="text-muted font-size-13 mb-0">${message.file_size}</p>
                                </div>
                            </div>

                            <div class="ml-4">
                                <ul class="list-inline mb-0 font-size-20">
                                    <li class="list-inline-item">
                                        <a href="/assets/file/${message.file}" class="text-muted">
                                            <i class="ri-download-2-line"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <p class="chat-time mb-0"><i class="ri-time-line align-middle"></i> <span class="align-middle">${message.human_time}</span></p>
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
        </div>
        
    </div>
  </li>`)
}

function append_message_to_chat_frame(data, partner_id){
  data.forEach(function(message){
    // if message is file
    if(message.images.length > 0){
      render_img_mess_to_chat_frame(message)
    }
    // if message is text
    if(message.text != null){
      // if user receive message
      if(message.sender.id == partner_id){ 
        render_text_mess_to_chat_frame(message, "received")
      }
      // if user send message
      else{
        render_text_mess_to_chat_frame(message, "sent")
      }
    }
    // if message is file
    if(message.file != null){
      render_file_message_to_chat_frame(message)
    }
  })
}

function append_data_to_chat_frame(data, partner_name, partner_id){
  if(data.length == 0){
    message_let_talk_together(partner_name)
  } 

  if(data.length > 0){
    append_message_to_chat_frame(data, partner_id)
  }
}

function show_modal_chat_personal(){
  $('.show-modal-chat-persional').on('click', function(){
    $(".user-chat").addClass("user-chat-show")
    $('#list-messages-frame li').remove()

    $('#list-messages-frame').append(lazy_loadings_message_frame)

    let wrap_user_info = $(this).parents('li')

    let user_id = wrap_user_info.attr('data-uid')
    let user_avatar = wrap_user_info.find('img').attr('src')
    let username = wrap_user_info.find('h5').text()

    $('#chat-frame').attr('data-uid', user_id)
    $('#chat-frame .chat-persional-user-avatar').attr('src', user_avatar)
    $('#chat-frame .chat-persional-username').text(username)

    $.ajax({
      type: 'GET',
      url: `/get-persional-messages/${user_id}`,
      success: function(data){
        append_data_to_chat_frame(data,username,user_id)
        $('.loading-message-chat-frame').remove()

        // scroll chat frame to bottom
        scroll_to_bottom_chat_frame()
        convert_unicode_to_emoji()
        view_message_image()
      },
      error: function(msg){
        $('.loading-message-chat-frame').remove()
        alertify.error(error_undefine_mess)
      }
    })
    
  })
}



$(document).ready(function() {
  show_modal_chat_personal()
  scroll_to_bottom_chat_frame()
  
})