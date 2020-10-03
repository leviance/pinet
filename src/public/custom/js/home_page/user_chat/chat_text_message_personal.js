function append_text_message_sent_to_chat_frame(message){
  let time_stamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

  $('#list-messages-frame').append(`
      <li data-uid="5f70877beb777fab7c927d05" class="right">
        <div class="conversation-list">
            <div class="chat-avatar">
                <img src="assets/images/users/m1pfw79v6p6-1600262189839-118888269_337684064047029_1890860285678180105_n.jpg" alt="">
            </div>

            <div class="user-chat-content">
                <div class="ctext-wrap">
                    <div class="ctext-wrap-content">
                        <p class="mb-0">
                            ${message}
                        </p>
                        <p class="chat-time mb-0"><i class="ri-time-line align-middle"></i> <span class="align-middle">${time_stamp}</span></p>
                    </div>
                        
                    <div class="dropdown align-self-start">
                        <a class="dropdown-toggle" href="javascript:void(0)" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="ri-more-2-fill"></i>
                        </a>
                        <div class="dropdown-menu">
                            <a class="dropdown-item btn-copy-text-message" href="javascript:void(0)">Copy <i class="ri-file-copy-line float-right text-muted"></i></a>
                            <a data-uid="5f70877beb777fab7c927d05" class="dropdown-item btn-forward-message" href="javascript:void(0)">Chuyển tiếp <i class="ri-chat-forward-line float-right text-muted"></i></a>
                            <a data-uid="5f70877beb777fab7c927d05" class="dropdown-item btn-delete-message" href="javascript:void(0)">Xóa <i class="ri-delete-bin-line float-right text-muted"></i></a>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
      </li>`)

      scroll_to_bottom_chat_frame()

      $("p").each(function() {
        var original = $(this).html();
        var converted = emojione.toImage(original);
        $(this).html(converted);
      });
}

function send_text_message(message, receiver_id){
  let time_stamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

  let data_to_emit = {
    receiver_id: receiver_id,
    message: message,
    time_stamp: time_stamp
  }
  socket.emit('request-user-send-text-message', data_to_emit)

  append_text_message_sent_to_chat_frame(message)
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
                      <p class="chat-time mb-0"><i class="ri-time-line align-middle"></i> <span class="align-middle">${data.time_stamp}</span></p>
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
  
  if(form_data_user_send_file_image_personal != null){
    // chat_file_message_personal.js
    user_send_file_image()
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