let notification_message = {
  notification_receive_new_contact: function(sender_username){
    return `${sender_username} đã gửi cho bạn lời mời kết bạn!`
  },
  notification_user_accepted_contact: function(sender_username){
    return `${sender_username} đã chấp nhận lời mời kết bạn của bạn!`
  }
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
                  <a data-uid="${data.sender_id}" class="dropdown-item btn-remove-notification" href="#">Xóa thông báo<i class="fa fa-minus float-right text-muted" aria-hidden="true"></i></a>
                  <a data-uid="${data.sender_id}" class="dropdown-item btn-block-friend " href="#">Chặn <i class="ri-forbid-line float-right text-muted"></i></a>
                  <a data-uid="${data.sender_id}" class="dropdown-item btn-unfriend" href="#">Hủy kết bạn <i class="ri-delete-bin-line float-right text-muted"></i></a>
              </div>
          </div>
      </div>
    </li>`)

    increase_total_tag('btn-list-notice-received')
    check_user_view_notification()
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
                  <a data-uid="${data.sender_id}" class="dropdown-item btn-remove-notification" href="#">Xóa thông báo<i class="fa fa-minus float-right text-muted" aria-hidden="true"></i></a>
                  <a data-uid="${data.sender_id}" class="dropdown-item btn-block-friend " href="#">Chặn <i class="ri-forbid-line float-right text-muted"></i></a>
                  <a data-uid="${data.sender_id}" class="dropdown-item btn-unfriend" href="#">Hủy kết bạn <i class="ri-delete-bin-line float-right text-muted"></i></a>
              </div>
          </div>
      </div>
    </li>`)

    increase_total_tag('btn-list-notice-received')
    check_user_view_notification()
}

$(document).ready(function(){
    check_user_view_notification()
})