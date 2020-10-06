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

function send_text_message(message, receiver_id){
  let time_stamp = get_current_time()

  $.ajax({
    url: "/user-send-text-message-persional",
    type: "POST",
    data: { message, receiver_id},
    success: function(data){
      data.time_stamp = time_stamp
      append_text_message_sent_to_chat_frame(data)
    },
    error: function(msg){
      alertify.error(msg)
    }
  })

}

function convert_unicode_to_emoji(){
  $("p").each(function() {
    let original = $(this).html();
    let converted = emojione.toImage(original);
    $(this).html(converted);
  });
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
          let message = el[0].emojioneArea.getText()
          user_send_personal_message(message)
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
    let message = el[0].emojioneArea.getText()
    user_send_personal_message(message)
    
  })
}

function user_send_personal_message(message){
  if(message != ""){
    let receiver_id = $('#chat-frame').attr('data-uid')
    send_text_message(message,receiver_id)
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

$(document).ready(function() {
  config_emojione()
  convert_unicode_to_emoji()

  socket.on('receiver-user-send-text-message', function(data){
    append_received_text_message_to_chat_frame(data)
    message_audio.play()
  })
  
});