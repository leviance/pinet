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

function user_send_messages(message, chat_type){
  // send message personal
  if(chat_type == "chat_personal"){
    if(message != ""){
      let receiver_id = $('#chat-frame').attr('data-uid')
      send_text_message_personal(message,receiver_id)
      $('.emojionearea-editor').html("")
    }
    
    if(form_data_user_send_image != null){
      // chat_image_message.js
      user_send_file_image("personal")
    }
    
    if(form_data_for_user_send_file != null){
      // chat_file_message.js
      user_send_file_attachment("personal")
    }
  }

  // send message group
  if(chat_type == "chat_group"){
    if(message != ""){
      let receiver_id = $('#chat-frame').attr('data-uid')
      send_text_message_group(message,receiver_id)
      $('.emojionearea-editor').html("")
    }

    if(form_data_for_user_send_file != null){
      // chat_file_message.js
      user_send_file_attachment("group")
    }

    if(form_data_user_send_image != null){
      // chat_image_message.js
      user_send_file_image("group")
    }
  }
  
}

function config_emojione(){
  let el = $("#input-user-chat-input").emojioneArea({
    standalone: false,
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    shortname: false,
    emojiPlaceholder: ":smile_cat:",
    searchPlaceholder: "Search",
    buttonTitle: "Use your TAB key to insert emoji faster",
    pickerPosition: "top",
    events: {
      keyup: function(editor, event){
        if(event.keyCode === 13){
          let message = el[0].emojioneArea.getText().trim()
          let chat_type = $('#chat-frame').attr('chat-type')
          user_send_messages(message,chat_type)
        }
        detected_user_stop_typing()
      },
      keypress: function(){
        show_user_is_typing()
      },
      click: function(){
        if(!$('.emojionearea-picker').hasClass('hidden')) {
          $('.emojionearea-picker').addClass('hidden')
          $('.emojionearea-button').removeClass('active')
        }
      },
    }
  });

  $('#btn-send-chat').on('click', function(){
    let message = el[0].emojioneArea.getText().trim()
    let chat_type = $('#chat-frame').attr('chat-type')

    user_send_messages(message,chat_type)
  })
}

function convert_unicode_to_emoji(){
  $("p").each(function() {
    let original = $(this).html();
    let converted = emojione.toImage(original);

    $(this).html(converted);
  });
}

function append_message_to_list_chat(message){
  let message_show =""

  if(message.text != null) message_show = `Bạn: ${message.text}`
  if(message.file != null) message_show = "Bạn đã gửi 1 file đính kèm"
  if(message.images.length > 0) message_show = "Bạn đã gửi 1 hình ảnh"

  // if message is chat group
  if(message.type == "chat_group"){
    let check_is_in_chat_list = $('#chat-message-list').find(`li[data-uid=${message.receiver.id}]`)
    
    if(check_is_in_chat_list.length === 0){
      $('#chat-message-list').prepend(`
        <li data-uid="${message.receiver.id}" class="show-modal-chat-persional typing" chat-type="chat_personal" > 
          <a href="javascript: void(0);">
              <div class="media">
                  <div class="chat-user-img offline align-self-center mr-3">
                          <img src="/assets/images/users/${message.receiver.avatar}" class="rounded-circle avatar-xs" alt="">
                      <span class="user-status"></span>
                  </div>
  
                  <div class="media-body overflow-hidden">
                      <h5 class="text-truncate font-size-15 mb-1">${message.receiver.username}</h5>
                      <p class="chat-user-message text-truncate mb-0">${message_show}</p>
                  </div>
                  <div class="font-size-11">${convert_timestamp(message.created_at)}</div>
                  <div class="unread-message" id="unRead1"><span class="badge badge-soft-danger badge-pill">1</span></div>
              </div>
          </a>
      </li>`)
    }
  }
  
  // if message is chat persional
  if(message.type == "chat_personal"){
    let check_is_in_chat_list = $('#chat-message-list').find(`li[data-uid=${message.sender.id}]`)

    if(check_is_in_chat_list.length === 0){
      $('#chat-message-list').prepend(`
        <li data-uid="${message.sender.id}" class="show-modal-chat-persional typing" chat-type="chat_personal" > 
          <a href="javascript: void(0);">
              <div class="media">
                  <div class="chat-user-img offline align-self-center mr-3">
                          <img src="/assets/images/users/${message.sender.avatar}" class="rounded-circle avatar-xs" alt="">
                      <span class="user-status"></span>
                  </div>
  
                  <div class="media-body overflow-hidden">
                      <h5 class="text-truncate font-size-15 mb-1">${message.sender.username}</h5>
                      <p class="chat-user-message text-truncate mb-0">${message_show}</p>
                  </div>
                  <div class="font-size-11">${convert_timestamp(message.created_at)}</div>
                  <div class="unread-message" id="unRead1"><span class="badge badge-soft-danger badge-pill">1</span></div>
              </div>
          </a>
      </li>`)
    }

    show_personal_chat_frame()
  }
}

function remove_file_showing_in_preview(){
  $('.btn-remove-file-attachment-in-preview').unbind('click').bind('click', function(){
    let image_to_preview =  $('.preview-file-attachment .img-content')
    let file_to_preview = $('.preview-file-attachment .file-attachment')

    let name_of_file = $(this).attr('data-name')

    if(image_to_preview.length == 1){
      $('#chat-frame .preview-file-attachment').hide()
      form_data_user_send_image = null
    }

    if(file_to_preview.length == 1){
      $('#chat-frame .preview-file-attachment').hide()
      form_data_for_user_send_file = null
    }

    if(form_data_user_send_image != null){
      let data = form_data_user_send_image.getAll('message_images')

      form_data_user_send_image.delete('message_images')

      for(let i = 0; i < data.length; i++){
        if(data[i].name != name_of_file){
          form_data_user_send_image.append('message_images', data[i])
        }
      }
    }

    if(form_data_for_user_send_file != null){
      let data = form_data_for_user_send_file.getAll('message_file')

      form_data_for_user_send_file.delete('message_file')

      for(let i = 0; i < data.length; i++){
        if(data[i].name != name_of_file){
          form_data_for_user_send_file.append('message_file', data[i])
        }
      }
    }
   
    $(this).parent().remove()
  })
}

function remove_all_file_in_preview_and_forms() {
  form_data_user_send_image = null
  form_data_for_user_send_file = null
  $('#chat-frame .preview-file-attachment').hide()
  $('#chat-frame .preview-file-attachment').children().remove()
}

function remove_label_count_message_not_read(){
  $('#chat-message-list li').find('a').unbind('click').bind('click', function(){
    $(this).find('.unread-message').remove()
    $('#pills-chat-tab .new-notifications').remove()
  })
}

function get_numbers_message_not_read(){
  let list_messages = $('#chat-message-list li')

  list_messages.each(function(index, message){
    let message_id = $(this).attr('data-uid')
    let message_type = $(this).attr('chat-type')
    let _this = $(this)

    $.ajax({
      url: '/count-message-not-read',
      type: 'POST',
      data: {message_id, message_type},
      success: function(numbers_message_not_read){
        if(numbers_message_not_read > 0){
          _this.find('div.media').append(`<div class="unread-message" id="unRead1"><span class="badge badge-soft-danger badge-pill">${numbers_message_not_read}</span></div>`)
          // show dot red color in message icon left menu
          add_dot_red_color_show_new_message()
        }
      },
      error: function(msg){
        // send error to admin
      }
    })
  })
}

function increase_total_message_not_read(message){
  let message_tag = null;
  let content_message = ""

  if(message.type == "chat_group"){
    message_tag = $('#chat-message-list').find(`li[data-uid="${message.receiver.id}"]`)
  }
  if(message.type == "chat_personal"){
    message_tag = $('#chat-message-list').find(`li[data-uid="${message.sender.id}"]`)
  }
  
  if(message.text != null) content_message = `${message.sender.username}: ${message.text}`
  if(message.file != null) content_message = `${message.sender.username}: đã gửi 1 file đính kèm`
  if(message.images.length > 0) content_message = `${message.sender.username}: đã gửi 1 hình ảnh`

  // move message to the top of the list
  message_tag.remove()
  $('#chat-message-list').prepend(message_tag)
  message_tag.find('.chat-user-message').text(content_message)

  // get numbers message not read of message
  let numbers_message_not_read = + message_tag.find('.unread-message >span').text()

  // if numbers message not read has value then increase 1
  if(numbers_message_not_read){
    numbers_message_not_read += 1
    message_tag.find('.unread-message >span').text(numbers_message_not_read)
  }
  // if not find numbers message not read of message append it to the message
  else{
    message_tag.find('.media').append(`<div class="unread-message" id="unRead1"><span class="badge badge-soft-danger badge-pill">1</span></div>`)
  }
  

  // show dot red color in message icon left menu
  add_dot_red_color_show_new_message()

  // call it for click can get message and show in chat modal
  show_group_chat_frame()
  show_personal_chat_frame()
  // call it for click can remove tag show message not read
  remove_label_count_message_not_read()
}

function update_message_in_list_message_when_send_new_message(message){
  let message_tag = null;
  let content_message = ""

  message_tag = $('#chat-message-list').find(`li[data-uid="${message.receiver.id}"]`)

  if(message.text != null) content_message = `Bạn: ${message.text}`
  if(message.file != null) content_message = `Bạn: đã gửi 1 file đính kèm`
  if(message.images.length > 0) content_message = `Bạn: đã gửi 1 hình ảnh`

  // move message to the top of the list
  message_tag.remove()
  $('#chat-message-list').prepend(message_tag)
  message_tag.find('.chat-user-message').text(content_message)

  // call it for click can get message and show in chat modal
  show_group_chat_frame()
  show_personal_chat_frame()
}

function add_dot_red_color_show_new_message(){
  $('#pills-chat-tab .new-notifications').remove()
  $('#pills-chat-tab').append(`<div class="new-notifications"></div>`)

  $('#pills-chat-tab').unbind('click').bind('click', function(){
    $('#pills-chat-tab .new-notifications').remove()
  })
}

function display_red_dot_notifying_meeting(link_join_meeting){
  if(link_join_meeting){
    $("#btn-video-call").append(`<i class="fa fa-circle have-a-zoom-meeting" aria-hidden="true"></i>`)
  }
  else{
    if($("#btn-video-call .have-a-zoom-meeting")){
      $("#btn-video-call .have-a-zoom-meeting").remove()
    }
  }
}

$(document).ready(function(){
  setTimeout(function(){
    document.querySelector('#chat-message-list li').click()
  },10)
      
  view_message_image()
  config_emojione()
  convert_unicode_to_emoji()
  scroll_to_bottom_chat_frame()
  get_numbers_message_not_read()
  remove_label_count_message_not_read()
  
})