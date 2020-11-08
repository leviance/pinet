function model_file_card_user_profile(file){
  return `<div class="card p-2 border mb-2">
              <div class="media align-items-center">
                  <div class="avatar-sm mr-3">
                      <div class="avatar-title bg-soft-primary text-primary rounded font-size-20">
                          <i class="ri-file-text-fill"></i>
                      </div>
                  </div>
                  <div class="media-body">
                      <div class="text-left">
                          <h5 class="font-size-14 mb-1">${file.file}</h5>
                          <p class="text-muted font-size-13 mb-0">${bytesToSize(file.file_size)}</p>
                      </div>
                  </div>

                  <div class="ml-4">
                      <ul class="list-inline mb-0 font-size-18">
                          <li class="list-inline-item">
                              <a target="_blank" href="assets/images/users/${file.file_src}" class="text-muted px-1">
                                  <i class="ri-download-2-line"></i>
                              </a>
                          </li>
                          <li class="list-inline-item dropdown">
                              <a class="dropdown-toggle text-muted px-1" href="JavaScript:void(0);" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  <i class="ri-more-fill"></i>
                              </a>
                              <div class="dropdown-menu dropdown-menu-right">
                                  <a data-uid="${file._id}" class="dropdown-item" href="JavaScript:void(0);">Chuyển tiếp</a>
                                  <div class="dropdown-divider"></div>
                                  <a data-uid="${file._id}" class="dropdown-item" href="JavaScript:void(0);">Xóa</a>
                              </div>
                          </li>
                      </ul>
                  </div>
              </div>
            </div>`
}

function model_image_card_user_profile(message){
  let model_image = ""
  message.images.forEach(function(image){
        model_image +=`<div class="card p-2 border mb-2">
                        <div class="media align-items-center">
                            <div class="avatar-sm mr-3">
                                <a class="popup-img d-inline-block m-1" href="assets/images/users/${image}" title="${convert_timestamp(message.created_at)}">
                                    <img src="assets/images/users/${image}" alt="" class="rounded border">
                                </a>
                            </div>
                            <div class="media-body">
                                <div class="text-left">
                                    <h5 class="font-size-14 mb-1">${image}</h5>
                                </div>
                            </div>

                            <div class="ml-4">
                                <ul class="list-inline mb-0 font-size-18">
                                    <li class="list-inline-item">
                                        <a target="_blank" href="assets/images/users/${image}" class="text-muted px-1">
                                            <i class="ri-download-2-line"></i>
                                        </a>
                                    </li>
                                    <li class="list-inline-item dropdown">
                                        <a class="dropdown-toggle text-muted px-1" href="JavaScript:void(0);" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i class="ri-more-fill"></i>
                                        </a>
                                        <div class="dropdown-menu dropdown-menu-right">
                                            <a data-uid="${message._id}" image-name="${image}" class="dropdown-item" href="JavaScript:void(0);">Chuyển tiếp</a>
                                            <div class="dropdown-divider"></div>
                                            <a data-uid="${message._id}" image-name="${image}" class="dropdown-item" href="JavaScript:void(0);">Xóa</a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                      </div>`
                    })
  
  return model_image
}

function render_personal_data_to_user_profile_slidebar(friend_profile,messages_file, messages_image){
  $('#collapseOne').empty()
  $('#collapseTwo .card-body').empty()
  $('#collapseThree .card-body').empty()

  $('.user-profile-sidebar .user-profile-avatar').attr('src', `assets/images/users/${friend_profile.avatar}`)
  $('.user-profile-sidebar .user-profile-username').text(friend_profile.username)

  
  $('#collapseOne').append(`
    <div class="card-body">
      <div class="mt-4">
          <p class="text-muted mb-1">Email</p>
          <h5 class="user-profile-email font-size-14">${friend_profile.local.email || friend_profile.facebook.email || friend_profile.google.email}</h5>
      </div>

      <div class="mt-4">
          <p class="text-muted mb-1">Tuổi</p>
          <h5 class="user-profile-age font-size-14">${friend_profile.age || "Chưa cập nhập."}</h5>
      </div>

      <div class="mt-4">
        <p class="text-muted mb-1">Địa chỉ</p>
        <h5 class="user-profile-address font-size-14">${friend_profile.address || "Chưa cập nhập."}</h5>
        </div>

      <div class="mt-4">
          <p class="text-muted mb-1">Lớp</p>
          <h5 class="user-profile-class font-size-14 mb-0">${friend_profile.class || "Chưa cập nhập."}</h5>
      </div>
    </div>`)

  messages_file.forEach(function (file_attachment) {
    $('#collapseTwo .card-body').append(model_file_card_user_profile(file_attachment))
  })

  messages_image.forEach(function(message) {
    $('#collapseThree .card-body').append(model_image_card_user_profile(message))
    view_message_image()
  })
}

function render_group_data_to_user_profile_slidebar(group_profile,messages_file, messages_image){
  $('#collapseOne').empty()
  $('#collapseTwo .card-body').empty()
  $('#collapseThree .card-body').empty()

  $('.user-profile-sidebar .user-profile-avatar').attr('src', `assets/images/users/${group_profile.avatar}`)
  $('.user-profile-sidebar .user-profile-username').text(group_profile.group_name)
  
  $('#collapseOne').append(`
    <div class="card-body">
      <div class="mt-4">
          <p class="text-muted mb-1">Quản trị viên</p>
          <h5 class="user-profile-email font-size-14">${group_profile.user_created_name}</h5>
      </div>

      <div class="mt-4">
          <p class="text-muted mb-1">Thành viên</p>
          <h5 class="user-profile-age font-size-14">${group_profile.user_amount}</h5>
      </div>

      <div class="mt-4">
        <p class="text-muted mb-1">Giới thiệu</p>
        <h5 class="user-profile-address font-size-14">${group_profile.invite_message}</h5>
        </div>

      <div class="mt-4">
          <p class="text-muted mb-1">Ngày tạo</p>
          <h5 class="user-profile-class font-size-14 mb-0">${convert_timestamp(group_profile.created_at)}</h5>
      </div>
    </div>`)

    messages_file.forEach(function (file_attachment) {
      $('#collapseTwo .card-body').append(model_file_card_user_profile(file_attachment))
    })
  
    messages_image.forEach(function(message) {
      $('#collapseThree .card-body').append(model_image_card_user_profile(message))
      view_message_image()
    })
}

function view_user_profile(target_id, type){
  let url = null

  if(type == "chat_personal") url = `/view-user-profile-${target_id}`
  if(type == "chat_group") url = `/view-group-profile-${target_id}`

  $.ajax({
    url: url, 
    type: 'GET',
    success: function([profile,messages_file, messages_image, type]){
      if(type == "chat_personal"){
        render_personal_data_to_user_profile_slidebar(profile,messages_file, messages_image)
      } 
      if(type == "chat_group"){
        render_group_data_to_user_profile_slidebar(profile,messages_file, messages_image)
      }

      $('.user-profile-sidebar').show()
    },
    error: function(){
      alertify.error(error_undefine_mess)
    }
  })
}

$(document).ready(function(){
  $('button.user-profile-show').unbind('click').bind('click', function(){
    let target_id = $('#chat-frame').attr('data-uid');
    let type = $('#chat-frame').attr('chat-type')

    view_user_profile(target_id, type)
  })
  $('a.user-profile-show').unbind('click').bind('click', function(){
    let target_id = $(this).attr('data-uid');
    view_user_profile(target_id, "chat_personal")
  })
})