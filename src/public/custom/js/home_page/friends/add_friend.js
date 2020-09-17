function prepend_to_list_contact_sent(data){
  $('#content-list-contacts-sent').prepend(`
    <li data-uid="${data.user_id}" >
        <a data-uid="${data.user_id}" href="javascript: void(0);" >
            <div class="media">
                <div class="chat-user-img align-self-center mr-3 user-profile-show">
                    <img src="/assets/images/users/${data.avatar}" class="rounded-circle avatar-xs" alt="">
                </div>
                <div class="media-body overflow-hidden user-profile-show">
                    <h5 class="text-truncate font-size-15 mb-1">${data.username}</h5>
                    <div class="font-size-11">Vừa xong</div>
                </div>
                <div data-uid="${data.user_id}" class="btn-cancel-contact-sent btn btn-danger font-size-10 btn-lg chat-send waves-effect waves-light">Hủy</div>
            </div>
        </a>
    </li>`)

    show_user_profile()
}

function prepend_to_list_contact_received(data){
  $('#content-list-contacts-received').prepend(`
  <li data-uid="${data.sender_id}" >
    <a data-uid="${data.sender_id}" href="javascript: void(0);" >
        <div class="media">
            <div class="chat-user-img align-self-center mr-3 user-profile-show">
              <img src="/assets/images/users/${data.sender_avatar}" class="rounded-circle avatar-xs" alt="">
            </div>
            <div class="media-body overflow-hidden user-profile-show">
                <h5 class="text-truncate font-size-15 mb-1">${data.sender_username}</h5>
                <div class="font-size-11">Vừa xong</div>
            </div>
            <div data-uid="${data.sender_id}" class="btn-accept-contact-received btn btn-primary font-size-10 btn-lg chat-send waves-effect waves-light mr-1">Chấp nhận</div>
            <div data-uid="${data.sender_id}" class="btn-cancel-contact-received btn btn-danger font-size-10 btn-lg chat-send waves-effect waves-light">Hủy</div>
        </div>
    </a>
  </li>`)

  show_user_profile()
}

// this call in show_result_search_friend in search_friend.js
function show_btn_interact_in_search_modal(){
  $('.btn-add-friend-in-model-search').unbind('click').bind('click', function(){
    let receiver_req_id = $(this).parent().parent().attr('data-uid');

    $(this).parents('.friend').remove()

    $.ajax({
      url: `/send-request-contact-${receiver_req_id}`,
      type: 'PUT',
      success: function(data) {
        prepend_to_list_contact_sent(data)
        cancel_contact_sent()

         // send contact real time
        let data_to_emit = {
          receiver_id: receiver_req_id,
        }
       
        socket.emit('request-add-friend', data_to_emit)
      },
      error: function(){
        alertify.error("Có lỗi bất ngờ xảy ra vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi!")
      }
    })
  })


}

function cancel_contact_sent(){
  $('#content-list-contacts-sent .btn-cancel-contact-sent').unbind('click').bind('click', function(){
    let receiver_id = $(this).attr('data-uid')
    let _this = $(this)
    _this.parents('li').css('opacity', 0.5)

    $.ajax({
      url: `/cancel-contact-sent-${receiver_id}`,
      type: "PUT",
      success: function(){
        _this.parents('li').remove();
        // handle real time do latter
      },
      error: function(){
        alertify.error("Đã có lỗi bất ngờ xảy ra. nếu trình trạng này còn tiếp tục vui lòng liên hệ bộ phận hỗ trợ của chúng tôi!")
      }
    })
  })
}

$(document).ready(function() {
  cancel_contact_sent()

  socket.on('receive-request-add-friend', data => {
    prepend_to_list_contact_received(data)
  })

})