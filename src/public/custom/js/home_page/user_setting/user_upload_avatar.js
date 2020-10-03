let origin_user_avatar = $('#img-user-avatar').attr('src')
let base64_img = null
let user_avatar = null

function user_upload_avatar(){
  $('#user-selectet-avatar').bind('change', function(event){
    let file = event.target.files[0];
    let limit = 1048576 * 10;
    
    if(!$.inArray(file.type,['image/jpg','image/png','image/gif', 'image/jpeg'])) {
      alertify.error(message_validation_file.image_type_incorrect)
      return false
    };

    if(file.size < 1024 || file.size > limit) {
      alertify.error(message_validation_file.image_size_incorrect)
      return false
    };

    let reader = new FileReader();
    reader.onload = function(e){
      // show img in #test-img-user-avatar for check error or loaded then if loaded display in #img-user-avatar 
      base64_img = e.target.result
      let preview = $('#test-img-user-avatar')
      preview.attr('src', base64_img)


      let form_data = new FormData()
      form_data.append("avatar",file)

      user_avatar = form_data
    
    }

    reader.readAsDataURL(file)

  })
}

function handle_error_show_img(){
  $('#test-img-user-avatar').bind("error", function(){
    alertify.error("Không thể hiển thị ảnh này")
  })
}

function send_user_avatar_to_server(){
  $('#test-img-user-avatar').bind("load", function(){
    $.ajax({
        type: "PUT",
        url: "/user-upload-avatar",
        data: user_avatar,
        processData: false,
        contentType: false,
        success: function(msg) {
          alertify.success("Cập nhập ảnh đại diện thành công")
          $('#img-user-avatar').attr("src", base64_img)
        },
        error: function(msg) {
          alertify.error(msg)
        }
      })
  })
}

$(document).ready(function(){
  $(".loading").hide()
  
  user_upload_avatar()
  send_user_avatar_to_server()
  handle_error_show_img()
  
})