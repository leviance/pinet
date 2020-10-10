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
    
    if(form_data_user_send_image_personal != null){
      // chat_image_message_personal.js
      user_send_file_image()
    }
    
    if(form_data_user_send_file_personal != null){
      // chat_file_message_personal.js
      user_send_file_attachment()
    }
  }

  // send message group
  if(chat_type == "chat_group"){
    if(message != ""){
      let receiver_id = $('#chat-frame').attr('data-uid')
      send_text_message_group(message,receiver_id)
      $('.emojionearea-editor').html("")
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
      },
      click: function(){
        if(!$('.emojionearea-picker').hasClass('hidden')) {
          $('.emojionearea-picker').addClass('hidden')
          $('.emojionearea-button').removeClass('active')
        }
      }
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
        <li data-uid="${message._id}" class="show-modal-chat-persional typing" chat-type="chat_personal" > 
          <a href="javascript: void(0);">
              <div class="media">
                  <div class="chat-user-img online align-self-center mr-3">
                          <img src="/assets/images/users/${message.receiver.avatar}" class="rounded-circle avatar-xs" alt="">
                      <span class="user-status"></span>
                  </div>
  
                  <div class="media-body overflow-hidden">
                      <h5 class="text-truncate font-size-15 mb-1">${message.receiver.username}</h5>
                      <p class="chat-user-message text-truncate mb-0">${message_show}</p>
                  </div>
                  <div class="font-size-11">${convert_timestamp(message.created_at)}</div>
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
        <li data-uid="${message._id}" class="show-modal-chat-persional typing" chat-type="chat_personal" > 
          <a href="javascript: void(0);">
              <div class="media">
                  <div class="chat-user-img online align-self-center mr-3">
                          <img src="/assets/images/users/${message.sender.avatar}" class="rounded-circle avatar-xs" alt="">
                      <span class="user-status"></span>
                  </div>
  
                  <div class="media-body overflow-hidden">
                      <h5 class="text-truncate font-size-15 mb-1">${message.sender.username}</h5>
                      <p class="chat-user-message text-truncate mb-0">${message_show}</p>
                  </div>
                  <div class="font-size-11">${convert_timestamp(message.created_at)}</div>
              </div>
          </a>
      </li>`)
    }

    show_personal_chat_frame()
  }
}

$(document).ready(function(){
  config_emojione()
  convert_unicode_to_emoji()
  scroll_to_bottom_chat_frame()
})