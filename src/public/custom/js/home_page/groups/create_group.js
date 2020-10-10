

function select_member_to_create_group(){
  $('#btn-select-member-to-create-group').on('click', function(){
    let list_friend_to_create_group = $('#result-list-friend-to-create-new-group')
    list_friend_to_create_group.children().remove()
    list_friend_to_create_group.append(`<li>${lazy_loadings}</li><li>${lazy_loadings}</li>`)

    $.ajax({
      url: "/user-get-list-friend-to-create-group",
      type: "GET",
      success: function(data) {
        list_friend_to_create_group.children().remove()

        data.forEach(function(friend, i) {
          list_friend_to_create_group.append(`
          <li data-uid="${friend.user_id}">
              <div class="custom-control custom-checkbox result-list-friend-to-create-new-group">
                  <input type="checkbox" class="custom-control-input" id="memberCheck${i+1}">
                  <label class="custom-control-label" for="memberCheck${i+1}" ></label>
                  <div class="media align-items-center" >
                      <div class="chat-user-img mr-3">
                          <div class="avatar-xs">
                              <img src="/assets/images/users/${friend.avatar}" class="rounded-circle avatar-xs" alt="">
                          </div>
                      </div>
                      <div class="media-body overflow-hidden">
                          <h5 class="text-truncate font-size-14 mb-0">${friend.username}</h5>
                      </div>
                  </div>
              </div>
          </li>`)

        })

        click_in_check_box_in_select_member_to_create_group()
      },
      error: function(msg){
        alertify.error(msg)
        list_friend_to_create_group.children().remove()
      }
    })
    
  })
}

function prepend_group_to_chat_list(data){
  $('#chat-message-list').prepend(`
    <li data-uid="${data._id}" class="show-modal-chat-group typing" chat-type="chat_group" >
        <a href="javascript:void(0)">
            <div class="media">
                <div class="chat-user-img align-self-center online mr-3">
                    <div class="avatar-xs">
                      <img src="/assets/images/users/group_avatar.png" class="rounded-circle avatar-xs" alt="">
                    </div>
                    <span class="user-status"></span>
                </div>
                <div class="media-body overflow-hidden">
                    <h5 class="text-truncate font-size-15 mb-1">${data.group_name}</h5>
                    <p class="chat-user-message text-truncate mb-0">${data.invite_message}</p>
                </div>
                <div class="font-size-11">${convert_timestamp(data.created_at)}</div>
                <div class="unread-message">
                    <span class="badge badge-soft-danger badge-pill">new</span>
                </div>
            </div>
        </a>
    </li>`)

    show_group_chat_frame()
    message_audio.play()
}

function prepend_group_to_list_groups(data){
  $('#chat-groups-list').prepend(`
    <li data-uid="${data._id}" chat-type="chat_group" >
        <a href="javascript: void(0);">
            <div class="media align-items-center">
                <div class="chat-user-img mr-3">
                  <div class="avatar-xs">
                    <img src="/assets/images/users/group_avatar.png" class="rounded-circle avatar-xs" alt="">
                  </div>
                </div>
                <div class="media-body overflow-hidden">
                    <h5 class="text-truncate font-size-14 mb-0">
                      ${data.group_name}
                      <span class="badge badge-soft-danger badge-pill float-right">New</span>
                    </h5>
                </div>
            </div>
        </a>
    </li>`)

    show_group_chat_frame()
}

function create_group(){
  $('#btn-create-group').on('click', function(){
    let find_friend_checked = $('#result-list-friend-to-create-new-group input')
    let list_id_friend_to_create_group = []

    find_friend_checked.each(function(i,input){
      if(input.checked){
        list_id_friend_to_create_group.push(input.parentElement.parentElement.getAttribute('data-uid'))
      }
    })

    let group_name = $('#addgroupname-input').val().trim()
    let invite_message = $('#addgroupdescription-input').val().trim()
    
    if(group_name.length < 1){
      alertify.error('Bạn cần đặt tên nhóm.')
      return false;
    }
    if(list_id_friend_to_create_group.length < 2){
      alertify.error('Bạn cần chọn tối thiểu 2 thành viên để tại nhóm.')
      return false
    }
    
    $.ajax({
      url: "/create-new-group",
      type: "POST",
      data: {
        group_name: group_name,
        list_id_members:list_id_friend_to_create_group,
        invite_message: invite_message
      },
      success: function(data){
        prepend_group_to_chat_list(data)
        prepend_group_to_list_groups(data)
        
        alertify.success('Nhóm đã được tạo')
        $('#addgroupname-input').val("")
        $('#result-list-friend-to-create-new-group').children().remove()
        $('#addgroupdescription-input').val("")
      },
      error: function(msg){
        alertify.error(msg);
      }
    })

  })
}

function click_in_check_box_in_select_member_to_create_group(){
  $('.result-list-friend-to-create-new-group >div').on('click', function(){
    $(this).parent().find('label').click()
  })
}

$(document).ready(function(){
  create_group()
  select_member_to_create_group()

  socket.on('receiver-create-new-group', function(data){
    message_audio.play()
    prepend_group_to_chat_list(data)
    prepend_group_to_list_groups(data)
  })

  
})