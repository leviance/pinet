const LINK_AUTHENTICATE_ZOOM = "https://zoom.us/oauth/authorize?response_type=code&client_id=cupaaFOhTIKz4m_Q9wICcQ&redirect_uri=https://pinet-unitech.herokuapp.com/zoom-auth-callback"

function handle_when_user_click_btn_call_video(){
  $("#btn-video-call").bind("click", function(){
    let chat_id = $("#chat-frame").attr("data-uid")
    let chat_type = $("#chat-frame").attr("chat-type")

    $(".loading").show();

    $.ajax({
      type: "POST",
      url: `/user-click-btn-call-video`,
      data:{
        chat_type,
        chat_id
      },
      success: function(response){
        $(".loading").hide();

        if(response.result_create_meeting.user_has_not_authorized){
          if(confirm("Cho phép ứng dụng truy cập vào Zoom để sử dụng tính năng này")){
            window.open(window.location.replace(LINK_AUTHENTICATE_ZOOM), '_blank');
          }
        }

        // appear when user the is not host (need host to create meeting)
        if(response.result_create_meeting.message){
          alertify.success(response.result_create_meeting.message)
        }

        if(response.result_create_meeting.link_join_meeting){
          $(".loading").hide();
          if(confirm("Mở ứng dụng Zoom.")){
            window.open(response.result_create_meeting.link_join_meeting, '_blank');
          }
        }


        // append message to chat model and list chat
        let message = response.result_send_mess
        // nếu trả về là link để người dùng auth với zoom thì không có message

        /**
         * nếu có message có nghĩa là người dùng đã xác thực zoom rồi và trả về link meeting được tạo
         * và sẽ append link meeting vào modal chat
         * cập nhật các event liên quan
         */
        if(message){
          if(message.receiver.id == $('#chat-frame').attr('data-uid')){
            append_message_group_to_chat_frame([message])
            update_message_in_list_message_when_send_new_message(message)
            $('#list-messages-frame .typing').remove()
          }
          append_message_to_list_chat(message)
        }
      },
      error: function(error){
        $(".loading").hide();
          alertify.error(error.responseText)
      }
    })
  })
}

$(document).ready(function(){
  handle_when_user_click_btn_call_video()


  socket.on('receiver-meeting-created', function(data){
    let chat_id_opening = $("#chat-frame").attr("data-uid")

    // check if the ongoing conversation is a data-target
    if(chat_id_opening == data.group_id){
      $("#btn-video-call").append(`<i class="fa fa-circle have-a-zoom-meeting" aria-hidden="true"></i>`)
    }
    message_audio.play()
  })
})