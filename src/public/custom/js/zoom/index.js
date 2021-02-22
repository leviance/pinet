const LINK_AUTHENTICATE_ZOOM = "https://zoom.us/oauth/authorize?response_type=code&client_id=cupaaFOhTIKz4m_Q9wICcQ&redirect_uri=https://65474866f406.ngrok.io/zoom-auth-callback"

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

        if(response.user_has_not_authorized){
          if(confirm("Cho phép ứng dụng truy cập vào Zoom để sử dụng tính năng này")){
            window.open(window.location.replace(LINK_AUTHENTICATE_ZOOM), '_blank');
          }
        }

        // appear when user the is not host (need host to create meeting)
        if(response.message){
          alertify.success(response.message)
        }

        if(response.link_join_meeting){
          $(".loading").hide();
          if(confirm("Mở ứng dụng Zoom.")){
            window.open(response.link_join_meeting, '_blank');
          }
        }
      },
      error: function(error){
        $(".loading").hide();
        if(confirm("Cho phép ứng dụng truy cập vào Zoom để sử dụng tính năng này")){
          window.open(window.location.replace(LINK_AUTHENTICATE_ZOOM), '_blank');
        }
        else{
          alertify.error(error.responseText)
        }
        
      }
    })
  })
}

$(document).ready(function(){
  handle_when_user_click_btn_call_video()
})