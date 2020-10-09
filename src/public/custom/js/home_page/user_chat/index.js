function user_send_messages(message, chat_type){
  // send message personal
  if(chat_type == "chat_personal"){
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

  // send message group
  if(chat_type == "chat_group"){
    console.log("chat ggroup")
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
    let message = el[0].emojioneArea.getText()
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

$(document).ready(function(){
  config_emojione()
  convert_unicode_to_emoji()
})