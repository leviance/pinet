let btn_edit_profile = $('#btn-user-edit-profile')
let btn_save_edit_profile = $('#btn-user-save-edit-profile')
let btn_cancel_edit_profile = $('#btn-user-cancel-edit-profile')

let username_origin = $('#setting-profile-username').text().trim()
let email_origin = $('#setting-profile-email').text().trim()
let age_origin = $('#setting-profile-age').text().trim()
let address_origin = $('#setting-profile-address').text().trim()
let class_origin = $('#setting-profile-class').text().trim()

let list_user_info = [username_origin,email_origin,age_origin,address_origin,class_origin]

function append_form_for_user_eddit_infor(user_info){
  let tag_to_append = $('.persional-information')
  tag_to_append.each(function(index){

    if(user_info[index] != "Chưa cập nhập"){
      $(this).append(`<input class="form-user-edit-infor" type="text" value="${user_info[index]}" >`)
    }

    else {
      $(this).append(`<input class="form-user-edit-infor" type="text" >`)
    }
    
  })

}

function click_btn_edit_profile(){
  btn_edit_profile.hide()
  btn_save_edit_profile.show()
  btn_cancel_edit_profile.show()

  $('.persional-information h5').hide()

  append_form_for_user_eddit_infor(list_user_info)

}

function click_btn_save_edit_profile(){
  btn_edit_profile.show()
  btn_save_edit_profile.hide()
  btn_cancel_edit_profile.hide()

  $('.persional-information h5').show()

  let new_list_user_infor = []

  $('.persional-information input').each(function(){
    let value = $(this).val()

    new_list_user_infor.push(value)
  })
  
  $('.form-user-edit-infor').each(function(){
    $(this).remove()
  })

  // if user change information
  if(JSON.stringify(new_list_user_infor) != JSON.stringify(list_user_info)){
    let changes = []
    for(let i = 0; i < new_list_user_infor.length; i++){
      if(new_list_user_infor[i] != list_user_info[i]){
        changes[i] = new_list_user_infor[i]
      }
      else{
        changes[i] = ""
      }
    }

    let data = {
      username: changes[0],
      email: changes[1],
      age: changes[2],
      address: changes[3],
      classes: changes[4],
    }
    
    for (let key in data){
      if(data[key] == "") delete data[key]
    }

    if(!Object.keys(data).length) return

    $.ajax({
      type: "PUT",
      url: "/user-edit-information",
      data: data,
      success: function(msg) {
        alertify.success(msg)
      },
      error: function(msg) {
        alertify.error(msg.responseText)
      }
    })
    
  }
}

function click_btn_cancel_edit_profile(){
  btn_edit_profile.show()
  btn_cancel_edit_profile.hide()
  btn_save_edit_profile.hide()

  $('.persional-information h5').show()
  $('.persional-information input').remove()
}

function user_edit_profile(){
  btn_save_edit_profile.hide()
  btn_cancel_edit_profile.hide()

  // click in button edit profile
  btn_edit_profile.bind('click', function(){
    click_btn_edit_profile()
  })
  
  // click in button save profile
  btn_save_edit_profile.bind('click', function(){
    click_btn_save_edit_profile()
  })

  // click in button cancel
  btn_cancel_edit_profile.bind('click', function(){
    click_btn_cancel_edit_profile()
  })
  
}


$(document).ready(function(){
  user_edit_profile()
})