function show_personal_chat_frame(){
  $('.show-modal-chat-persional').unbind('click').bind('click', function(){
    $('#chat-message-list li').removeClass('active')
    this.classList.add('active')
    
    remove_all_file_in_preview_and_forms()
    
    $(".user-chat").addClass("user-chat-show")
    $('#list-messages-frame li').remove()
    $('#list-messages-frame').append(lazy_loadings_message_frame)

    let user_id = ""
    let user_avatar = ""
    let username = ""
    let chat_type = ""

    // when click btn in #chat-message-list
    if($(this)[0].localName == "li"){
      user_id = $(this).attr('data-uid')
      chat_type = $(this).attr('chat-type')
      user_avatar = $(this).find('img').attr('src')
      username = $(this).find('h5').text()
    }

    // when click btn in #list-friends
    if($(this)[0].localName == "div"){
      let wrap_user_info = $(this).parents('li')

      user_id = wrap_user_info.attr('data-uid')
      chat_type = wrap_user_info.attr('chat-type')
      user_avatar = wrap_user_info.find('img').attr('src')
      username = wrap_user_info.find('h5').text()
    }
    
    if(chat_type == "chat_group") return false

    $('#chat-frame').attr('data-uid', user_id)
    $('#chat-frame').attr('chat-type', chat_type)
    $('#chat-frame .chat-persional-username').text(username)
    $('#chat-frame .chat-persional-user-avatar').attr('src', user_avatar)
    

    $.ajax({
      type: 'GET',
      url: `/get-persional-messages/${user_id}`,
      success: function(messages){
        append_message_personal_to_chat_frame(messages)
        $('.loading-message-chat-frame').remove()
        get_friends_status_when_get_message(user_id);
      },
      error: function(msg){
        $('.loading-message-chat-frame').remove()
        alertify.error(error_undefine_mess)
      }
    })
    
  })
}

function append_message_personal_to_chat_frame(messages){
  let user_id = $('#profile-setting-accordion').attr('data-uid')

  messages.forEach(function(message){
    // if message send
    if(message.sender.id == user_id){
      // if message is text
      if(message.text != null) {
        render_text_message_personal_to_chat_frame(message, "send")
      }
      // if message is images
      if(message.images.length > 0){
        render_image_message_personal_to_chat_frame(message, "send")
      }
      // if message is file
      if(message.file != null){
        render_file_message_personal_to_chat_frame(message, "send")
      }
    }

    // if message receive
    if(message.sender.id != user_id){
      // if message is text
      if(message.text != null) {
        render_text_message_personal_to_chat_frame(message, "receive")
      }
      // if message is images
      if(message.images.length > 0){
        render_image_message_personal_to_chat_frame(message, "receive")
      }
      // if message is file
      if(message.file != null){
        render_file_message_personal_to_chat_frame(message, "receive")
      }
    }
  })
}

function render_text_message_personal_to_chat_frame(message, type){
  let message_class = ""

  if(type == "send"){
    message_class = "right"
  }

  $('#list-messages-frame').append(`
  <li data-uid="${message._id}" class="${message_class}">
    <div class="conversation-list">
        <div class="chat-avatar">
            <img src="assets/images/users/${message.sender.avatar}" alt="">
        </div>

        <div class="user-chat-content">
            <div class="ctext-wrap">
                <div class="ctext-wrap-content">
                    <p class="mb-0  message-text-content">
                        
                    </p>
                    <p class="chat-time mb-0"><i class="ri-time-line align-middle"></i> <span class="align-middle">${convert_timestamp(message.created_at)}</span></p>
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
  </li>`);
  
  $('#list-messages-frame li').last().find('p.message-text-content').text(message.text);

  scroll_to_bottom_chat_frame()
  convert_unicode_to_emoji()
  view_message_image()
}

function render_image_message_personal_to_chat_frame(message, type){
  let message_class = ""
  let model_images = ""

  if(type == "send"){
    message_class = "right"
  }

  message.images.forEach(function(image){
    model_images += model_messae_img(message, image)
  })

  $('#list-messages-frame').append(`
    <li data-uid="${message._id}" class="${message_class}">
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
        </div>
      </div>
    </li>`)

    scroll_to_bottom_chat_frame()
    view_message_image()
}

function render_file_message_personal_to_chat_frame(message, type){
  let message_class = ""

  if(type == "send"){
    message_class = "right"
  }

  $('#list-messages-frame').append(`
  <li data-uid="${message._id}" class="${message_class} message-file-attachment">
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
                    <a class="dropdown-toggle" href="JavaScript:void(0);" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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

  scroll_to_bottom_chat_frame()
  convert_unicode_to_emoji()
  view_message_image()
}

$(document).ready(function() {
  show_personal_chat_frame()
})