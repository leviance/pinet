const message_valid = {
  "email_incorrect": "Email bạn vừa nhập vào không hợp lệ",
  "password_incorrect": "Mật khẩu bạn vừa nhập vào không hợp lệ",
  "name_account_incorrect": "Tên tài khoản bạn vừa nhập vào không hợp lệ",
  "email_used": "Tài khoản email đã được sử dụng",
  "valid_correct": `Tài khoản đã được tạo thành công vui lòng kiểm tra Email để kích hoạt tài khoản!`
}

function valid_email(email) {
  let re = /^[a-zA-Z0-9]+(@gmail.com)$/;

  result_valid = re.test(email);

  if(result_valid === false) return false;
  
  if(email.length > 255) return false;

  return true;
}

function valid_name_account(name_account) {
  let re = /^[A-Za-z0-9âăêưôđơèéẹẻẽỳýỵỹỷểệễềếủũụùúửữựừứỉĩịìíòóỏõọổồốỗộảạãáàẳặẵắằẩẫậấầÂĂÊƯÔĐƠÈÉẸẺẼỲÝỴỸỶỂỆỄỀẾỦŨỤÙÚỬỮỰỪỨỈĨỊÌÍÒÓỎÕỌỔỒỐỖỘẢẠÃÁÀẲẶẴẮẰẨẪẬẤẦ]+$/;
  
  let result_valid = re.test(name_account);
  
  if(result_valid === false) return false;

  if(name_account.length > 255 || name_account.length < 1) return false;

  return true;
}

function valid_password(password) {
  let re = /^[A-Za-z0-9âăêưôđơèéẹẻẽỳýỵỹỷểệễềếủũụùúửữựừứỉĩịìíòóỏõọổồốỗộảạãáàẳặẵắằẩẫậấầÂĂÊƯÔĐƠÈÉẸẺẼỲÝỴỸỶỂỆỄỀẾỦŨỤÙÚỬỮỰỪỨỈĨỊÌÍÒÓỎÕỌỔỒỐỖỘẢẠÃÁÀẲẶẴẮẰẨẪẬẤẦ]+$/;
  
  let result_valid = re.test(password);

  if(result_valid === false) return false;

  if(password.length > 255 || password.length < 1) return false;

  return true;
}

function render_valid_message_incorrect(data) {
  let id = ""
  let message = ""

  if(data === "email") {
    id = "email-input-group";
    message = message_valid.email_incorrect
  }

  if(data === "account") {
    id = "name-account-input-group";
    message = message_valid.name_account_incorrect
  }

  if(data === "password") {
    id = "password-input-group";
    message = message_valid.password_incorrect
  }

  if(data === "used") {
    id = "email-input-group";
    message = message_valid.email_used
  }

  $(`#${id}`).append(`
    <div class="valid-message" style="width: 100%; height: auto; text-align: center;">
        <label style="color: red; font-size: 13px; ">${message}</label>
    </div>`)
}

function remove_all_message_valid() {
  $(".valid-message").remove()
}

function render_valid_message_correct(){
  $(`#password-input-group`).append(`
    <div class="valid-message" style="width: 100%; height: auto; text-align: center;">
        <label style="color: #7269ef; font-size: 13px; ">
          ${message_valid.valid_correct}
        </label>
    </div>`)
}

function render_message_from_server(message) {
  if(message === "Địa chỉ mail đã được sử dụng") {
    $(`#email-input-group`).append(`
      <div class="valid-message" style="width: 100%; height: auto; text-align: center;">
          <label style="color: red; font-size: 13px; ">${message}</label>
      </div>`)
  }
  if(message === "Tên tài khoản đã đã tồn tại") {
    $(`#name-account-input-group`).append(`
      <div class="valid-message" style="width: 100%; height: auto; text-align: center;">
          <label style="color: red; font-size: 13px; ">${message}</label>
      </div>`)
  }
  if(message === "Không thể gửi Mail đến địa chỉ Email của bạn. Vui lòng liên hệ bộ phận hỗ trợ!") {
    $(`#email-input-group`).append(`
      <div class="valid-message" style="width: 100%; height: auto; text-align: center;">
          <label style="color: red; font-size: 13px; ">${message}</label>
      </div>`)
  }
}

function user_register(){

  $("#btn-submit-register").bind("click", function(){
    $(".loading").show();

    let user_email = $("#user_input_email").val();
    let name_account = $("#user_input_username").val();
    let user_password = $("#user_input_password").val();
    
    //when name account || password || email incorrect 
    if(!valid_email(user_email) || !valid_password(user_password) || !valid_name_account(name_account)) {
      $(".loading").hide()
      // delete all previous valid messages
      remove_all_message_valid()

      if(!valid_email(user_email)) return render_valid_message_incorrect("email")
      if(!valid_name_account(name_account)) return render_valid_message_incorrect("account")
      if(!valid_password(user_password)) return render_valid_message_incorrect("password")
    
    }

    // when name account || password || email correct 
    else {
      remove_all_message_valid()
      
      $.ajax({
        type: "POST",
        url: "/user-create-new-account",
        data: {
          user_email,
          name_account,
          user_password
        },
        success: function(msg) {
          $(".loading").hide()
          render_valid_message_correct()
        },
        error: function(msg) {
          $(".loading").hide()
          render_message_from_server(msg.responseText)
        }
      })

    }
  
  })

}

$(document).ready(function(){
  $(".loading").hide()

  $("#user_input_email").click()
  user_register()
})

