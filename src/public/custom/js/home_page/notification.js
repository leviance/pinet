let notification_message = {
  notification_receive_new_contact: function(sender_username){
    return `${sender_username} đã gửi cho bạn lời mời kết bạn!`
  },
  notification_user_accepted_contact: function(sender_username){
    return `${sender_username} đã chấp nhận lời mời kết bạn của bạn!`
  },
  seen_all_the_notices: "Bạn đã xem hết thông báo"
}

// nếu người dùng đang mở tab thông báo thì thông báo gửi đến sẽ được chuyển trạng thái đã xem trên server
let origin_stt_list_notif_reveive = $('#list-notice-received').css('display')
function check_user_view_notification(){
    $(window).unbind('click').bind('click', function(){
        let stt_list_notif_reveive = $('#list-notice-received').css('display')
        

        if(stt_list_notif_reveive == 'none' && origin_stt_list_notif_reveive == 'block'){
            $("#list-notifications li").removeClass("notification-not-read")
            $('#btn-list-notice-received span').remove()

            $.ajax({
                type: 'PUT',
                url: '/mark-notifications-as-read'
            })
            origin_stt_list_notif_reveive = 'none'
        }

        if(stt_list_notif_reveive == 'block' && origin_stt_list_notif_reveive == 'none'){
            $("#list-notifications li").removeClass("notification-not-read")
            $('#btn-list-notice-received span').remove()

            $.ajax({
                type: 'PUT',
                url: '/mark-notifications-as-read'
            })
            origin_stt_list_notif_reveive = 'block'
        }
    })
}


function notification_new_request_contact(data){
  $('#list-notifications').prepend(`
    <li class="notification-item notification-not-read" data-uid="${data.sender_id}">
      <div class="media friend-item">
          <div class="chat-user-img mr-3">
              <div class="avatar-xs">
                  <img src="/assets/images/users/${data.sender_avatar}" class="rounded-circle avatar-xs" alt="">
              </div>
          </div>
          <div class="media-body overflow-hidden">
              <h5 class=" font-size-13 mb-1">${notification_message.notification_receive_new_contact(data.sender_username)}</h5>
              <div class="font-size-11">Vừa xong</div>
          </div>
          <div class="dropdown">
              <a href="#" class="text-muted dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i class="ri-more-2-fill"></i>
              </a>
              <div class="dropdown-menu dropdown-menu-right">
                <a data-uid="${data.sender_id}" class="dropdown-item btn-view-user-profile user-profile-show" href="#">Xem hồ sơ<i class="fa fa-user float-right text-muted" aria-hidden="true"></i></a>
                <a data-uid="${data.sender_id}" class="dropdown-item btn-block-user-notification" href="#">Tắt thông báo<i class="fa fa-minus float-right text-muted" aria-hidden="true"></i></a>
                <a data-uid="${data.sender_id}" class="dropdown-item btn-block-friend " href="#">Chặn<i class="ri-forbid-line float-right text-muted"></i></a>
                <a data-uid="${data.sender_id}" class="dropdown-item btn-unfriend" href="#">Xóa thông báo<i class="ri-delete-bin-line float-right text-muted"></i></a>
              </div>
          </div>
      </div>
    </li>`)

    increase_total_tag('btn-list-notice-received')
    check_user_view_notification()
    show_user_profile()
}

function notification_user_accepted_contact(data) {
  $('#list-notifications').prepend(`
    <li class="notification-item notification-not-read" data-uid="${data.sender_id}">
      <div class="media friend-item">
          <div class="chat-user-img mr-3">
              <div class="avatar-xs">
                  <img src="/assets/images/users/${data.sender_avatar}" class="rounded-circle avatar-xs" alt="">
              </div>
          </div>
          <div class="media-body overflow-hidden">
              <h5 class=" font-size-13 mb-1">${notification_message.notification_user_accepted_contact(data.sender_username)}</h5>
              <div class="font-size-11">Vừa xong</div>
          </div>
          <div class="dropdown">
              <a href="#" class="text-muted dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i class="ri-more-2-fill"></i>
              </a>
              <div class="dropdown-menu dropdown-menu-right">
                <a data-uid="${data.sender_id}" class="dropdown-item btn-view-user-profile user-profile-show" href="#">Xem hồ sơ<i class="fa fa-user float-right text-muted" aria-hidden="true"></i></a>
                <a data-uid="${data.sender_id}" class="dropdown-item btn-block-user-notification" href="#">Tắt thông báo<i class="fa fa-minus float-right text-muted" aria-hidden="true"></i></a>
                <a data-uid="${data.sender_id}" class="dropdown-item btn-block-friend " href="#">Chặn<i class="ri-forbid-line float-right text-muted"></i></a>
                <a data-uid="${data.sender_id}" class="dropdown-item btn-unfriend" href="#">Xóa thông báo<i class="ri-delete-bin-line float-right text-muted"></i></a>
              </div>
          </div>
      </div>
    </li>`)

    increase_total_tag('btn-list-notice-received')
    check_user_view_notification()
    show_user_profile()
}

function append_notification_read_more(data){
    data.forEach(function(notification){
        let is_read = notification.is_read ? "" : "notification-not-read" ;
        $('#list-notifications').append(`
            <li class="notification-item ${is_read}" data-uid="${notification.sender_id}">
                <div class="media friend-item">
                    <div class="chat-user-img mr-3">
                        <div class="avatar-xs">
                            <img src="/assets/images/users/${notification.sender_avatar}" class="rounded-circle avatar-xs" alt="">
                        </div>
                    </div>
                    <div class="media-body overflow-hidden">
                        <h5 class=" font-size-13 mb-1">${notification.content}</h5>
                        <div class="font-size-11">${notification.human_time}</div>
                    </div>
                    <div class="dropdown">
                        <a href="#" class="text-muted dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="ri-more-2-fill"></i>
                        </a>
                        <div class="dropdown-menu dropdown-menu-right">
                            <a data-uid="${notification.sender_id}" class="dropdown-item btn-view-user-profile user-profile-show" href="#">Xem hồ sơ<i class="fa fa-user float-right text-muted" aria-hidden="true"></i></a>
                            <a data-uid="${notification.sender_id}" class="dropdown-item btn-block-user-notification" href="#">Tắt thông báo<i class="fa fa-minus float-right text-muted" aria-hidden="true"></i></a>
                            <a data-uid="${notification.sender_id}" class="dropdown-item btn-block-friend " href="#">Chặn<i class="ri-forbid-line float-right text-muted"></i></a>
                            <a data-uid="${notification.sender_id}" class="dropdown-item btn-unfriend" href="#">Xóa thông báo<i class="ri-delete-bin-line float-right text-muted"></i></a>
                        </div>
                    </div>
                </div>
            </li>`)
    })

    show_user_profile()
}

function view_more_notifications(){
    let wrap_list_notifications = $("#list-notifications").parents(".simplebar-content-wrapper")
    let list_notifications = $("#list-notifications li")
    let stt_send_data = 0;
    
    wrap_list_notifications.on('scroll', function(){
        if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 300 && list_notifications.length >= 20) {
            stt_send_data += 1;

            if(stt_send_data == 1) {
                let total_notifications = $("#list-notifications li").length

                $('#list-notifications').append(lazy_loadings)

                $.ajax({
                    type: "GET",
                    url: `/read-more-notifications-${total_notifications}`,
                    success: function(data) {
                        $('#list-notifications').find('.lazy-load').remove()
                        append_notification_read_more(data)
                        stt_send_data = 0
                    },
                    error: function(){
                        $('#list-notifications').find('.lazy-load').remove()
                        alertify.success(notification_message.seen_all_the_notices)
                    }
                })
            }
        }
    })
}

function remove_all_notifications() {
    $('.btn-remove-all-notification').on('click', function(){
        $.ajax({
            type: 'PUT',
            url: '/remove-all-notifications',
            success: function(){
                $('#list-notifications li').remove();
                $('#btn-list-notice-received span').remove();
            },
            error: function(){
                alertify.error(error_undefine_mess)
            }
        })
    })
}

$(document).ready(function(){
    check_user_view_notification()
    view_more_notifications()
    remove_all_notifications()
})