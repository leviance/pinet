function prepend_to_list_contact_sent(data){
  $('#content-list-contacts-sent').prepend(`
    <li data-uid="${data.user_id}" >
        <a href="javascript: void(0);" >
            <div class="media">
                <div class="align-self-center mr-3 user-profile-show">
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
    cancel_contact_sent()
}

function prepend_to_list_contact_received(data){
  $('#content-list-contacts-received').prepend(`
  <li data-uid="${data.sender_id}" >
    <a href="javascript: void(0);" >
        <div class="media">
            <div class="align-self-center mr-3 user-profile-show">
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
  cancel_contact_received()
  accept_contact_received()
}

// this call in show_result_search_friend in search_friend.js
function send_request_contact(){
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
       
        increase_total_tag('btn-list-contacts-sent')
        socket.emit('request-add-friend', data_to_emit)
      },
      error: function(){
        alertify.error(error_undefine_mess)
      }
    })
  })


}

// sender cancel contact sent
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

        let data_to_emit = {
          receiver_id: receiver_id,
        }
        
        decrease_total_tag('btn-list-contacts-sent')
        socket.emit('cancel-request-add-friend', data_to_emit)
      },
      error: function(){
        alertify.error(error_undefine_mess)
      }
    })
  })
}

//  receiver cancel contact received
function cancel_contact_received(){
  $('.btn-cancel-contact-received').unbind('click').click(function(){
    let _this = $(this)
    let sender_id = _this.attr("data-uid")
    _this.parents('li').css('opacity', 0.5)

    $.ajax({
      url: `/cancel-contact-received-${sender_id}`,
      type: "PUT",
      success: function(){
        _this.parents('li').remove()

        let data_to_emit = {
          receiver_id: sender_id
        }

        decrease_total_tag('btn-list-contacts-received')
        socket.emit('request-cancel-contact-received', data_to_emit)
      },
      error: function(){
        alertify.error(error_undefine_mess)
      }
    })
  })
}


$(document).ready(function() {
  cancel_contact_sent()
  cancel_contact_received()


  socket.on('receive-request-add-friend', function(data){
    prepend_to_list_contact_received(data)
    increase_total_tag('btn-list-contacts-received')
    notification_new_request_contact(data)
  })

  socket.on('receive-cancel-request-add-friend', function(data){
    $('#content-list-contacts-received').find(`li[data-uid="${data.sender_id}"]`).remove()
    decrease_total_tag('btn-list-contacts-received')
  })

  socket.on('receive-request-cancel-contact-received', function(data){
    $('#list-contacts-sent').find(`li[data-uid="${data.sender_id}"]`).remove()
    decrease_total_tag('btn-list-contacts-sent')
  })

})