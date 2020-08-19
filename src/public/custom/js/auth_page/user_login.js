let message_login = {
  invalid_password: "Mật khẩu bạn vừa nhập vào không hợp lệ",
  invalid_name_account: "Tên tài bạn vừa nhập vào không hợp lệ"
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

function remove_all_message_valid() {
  $(".valid-message").remove()
}

/**
 * 
 * @param {message to appen} msg 
 * @param {type = name_account || password} type 
 */
function render_error_mess(msg, type) {
  if(type == "name_account"){
    $("#login-input-name-account-group").append(`
      <div class="valid-message" style="width: 100%; height: auto; text-align: center;">
          <label style="color: red; font-size: 13px; ">${msg}</label>
      </div>`)
  }

  if(type == "password") {
    $("#login-input-password-group").append(`
      <div class="valid-message" style="width: 100%; height: auto; text-align: center;">
      <br>
          <label style="color: red; font-size: 13px; ">${msg}</label>
      </div>`)
  }
}

function login(){
  remove_all_message_valid();

  let name_account = $("#login-user-input-name-account").val();
  let password = $("#login-input-user-password").val();

  if(!valid_name_account(name_account)) return render_error_mess(message_login.invalid_name_account, "name_account");
  if(!valid_password(password)) return render_error_mess(message_login.invalid_password, "password")

  $(".loading").show();

  $.ajax({
    type: "POST",
    url: "/user-login",
    data: {
      name_account: name_account,
      password: password
    },
    success: function(msg){
      $(".loading").hide();
      window.location.replace("/");
    },
    error: function(msg){
      $(".loading").hide()
      render_error_mess(msg.responseText, "password")
    }
  })

  
}

$(document).ready(function(){
  $(".loading").hide();
  $("#login-user-input-name-account").focus();


  $("#login-button-submit").bind("click", function(){
    login();
  })
  
})