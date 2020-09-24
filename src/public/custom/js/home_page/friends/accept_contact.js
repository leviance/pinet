function append_to_list_friends(data){
  $('#list-friends').prepend(`
    <li data-uid="${data.user_id}">
      <div class="media align-items-center friend-item">
          <div class="chat-user-img mr-3">
              <div class="avatar-xs">
                  <img src="${data.avatar}" class="rounded-circle avatar-xs" alt="">
              </div>
          </div>
          <div class="media-body overflow-hidden">
              <h5 class="text-truncate font-size-14 mb-0">${data.username}</h5>
          </div>
          <div class="dropdown">
              <a href="#" class="text-muted dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i class="ri-more-2-fill"></i>
              </a>
              <div class="dropdown-menu dropdown-menu-right">
                  <a data-uid="${data.user_id}" class="dropdown-item btn-view-user-profile" href="#">Xem hồ sơ <i class="fa fa-user float-right text-muted" aria-hidden="true"></i></a>
                  <a data-uid="${data.user_id}" class="dropdown-item btn-block-friend " href="#">Chặn <i class="ri-forbid-line float-right text-muted"></i></a>
                  <a data-uid="${data.user_id}" class="dropdown-item btn-unfriend" href="#">Hủy kết bạn <i class="ri-delete-bin-line float-right text-muted"></i></a>
              </div>
          </div>
      </div>
    </li>
  `)
}

function accept_contact_received(){
  $('.btn-accept-contact-received').unbind('click').bind('click', function(){
    let _this = $(this)
    let id_user_send_contact = _this.attr('data-uid')

    _this.parents('li').css('opacity', 0.5)

    $.ajax({
      url: `/accept-contact-received-${id_user_send_contact}`,
      type: "PUT",
      success: function(){
        _this.parents('li').remove()

        let data_to_emit = {
          receiver_id : id_user_send_contact
        }

        decrease_total_tag('btn-list-contacts-received')
        socket.emit('user-accept-contact',data_to_emit)

        // them bạn vào danh sách bạn bè
        let data_to_append = {
          user_id: _this.parents('li').attr('data-uid'),
          avatar: _this.parents('li').find('img').attr('src'),
          username: _this.parents('li').find('h5').text()
        }
        append_to_list_friends(data_to_append)
      },
      error: function(){
        alertify.error(error_undefine_mess)
      }
      
    })
  })
}

$(document).ready(function(){
  accept_contact_received()

  socket.on('receive-user-accept-contact', function(data){
    decrease_total_tag('btn-list-contacts-sent')

    $('#list-contacts-sent').find(`li[data-uid="${data.sender_id}"]`).remove()
    
    let data_to_append = {
      user_id: data.sender_id,
      avatar: `/assets/images/users/${data.sender_avatar}`,
      username: data.sender_username
    }

    append_to_list_friends(data_to_append)
    // thông báo cho người dùng 
    notification_user_accepted_contact(data)
  })
})