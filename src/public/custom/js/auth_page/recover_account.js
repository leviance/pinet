const message_valid = {
  "email_incorrect": "Email bạn nhập vào không hợp lệ.",
  "verify_code_incorrect": "Mã xác thực không hợp lệ"
}

function valid_email(email) {
  let re = /^[a-zA-Z0-9]+(@gmail\.com)$/;

  result_valid = re.test(email);

  if(result_valid === false) return false;
  
  if(email.length > 255) return false;

  return true;
}

function valid_verify_code(verify_code) {
  let re = /^[A-Za-z0-9]+$/
  let result_valid  = re.test(verify_code)

  if(result_valid === false) return false

  if(verify_code.length == 0 || verify_code.length > 20) return false

  return true;
}

function render_message(message){
  $("#modal-1 .input-group").append(`
    <div class="valid-message" style="width: 100%; height: auto; text-align: center;">
        <label style="color: red; font-size: 13px; ">${message}</label>
    </div>`)
}

function remove_all_message_valid() {
  $(".valid-message").remove()
}

let email = "";
function get_verify_code(){
  $("#btn-submit-recover-account").bind("click", function(){
    $(".loading").show();
    email = $("#input_email_to_recover_account").val();

    if(valid_email(email)){
      $.ajax({
        type: "get",
        url: `/recover-account/${email}`,
        success: function(msg) {
          remove_all_message_valid()
          $(".loading").hide();
          
          // show modal input verify code
          $("#modal-1").hide()
          $("#modal-2").show()
        },
        error: function(msg) {
          $(".loading").hide();
          remove_all_message_valid()
          render_message(msg.responseText)
        }
      })
    }

    else {
      remove_all_message_valid()
      render_message(message_valid.email_incorrect)
      $(".loading").hide();
    }
  })
}

function submit_verify_code(){
  $("#btn-submit-verify_code").bind("click", function(){
    $(".loading").show();

    let verify_code = $("#input_verify_code_to_recover_account").val();
    if(!valid_verify_code(verify_code)) {
      remove_all_message_valid()
      $(".loading").hide();
      $("#modal-2 .input-group").append(`
          <div class="valid-message" style="width: 100%; height: auto; text-align: center;">
              <label style="color: red; font-size: 13px; ">${message_valid.verify_code_incorrect}</label>
          </div>`)
      
      return 
    }

    $.ajax({
      type: "GET",
      url: `/send-verify-code/${verify_code}/${email}`,
      success: function(msg) {
        $(".loading").hide();
        remove_all_message_valid()
        
        $("#modal-2 .input-group").append(`
          <div class="valid-message" style="width: 100%; height: auto; text-align: center;">
              <label style="color: #5246eb; font-size: 13px; ">${msg}</label>
          </div>`)
      },
      error: function(msg) {
        $(".loading").hide();
        remove_all_message_valid()
        
        $("#modal-2 .input-group").append(`
          <div class="valid-message" style="width: 100%; height: auto; text-align: center;">
              <label style="color: red; font-size: 13px; ">${msg.responseText}</label>
          </div>`)
      }
    })
  })
}

$(document).ready(function(){
  $(".loading").hide();

  // send email to get verify code
  get_verify_code()

  // send verify code to get password
  submit_verify_code()
})