let message_read_more_contact = {
  seen_all_req_sent: "Bạn đã xem hết lời mời kết bạn đã gửi",
  seen_all_req_received: "Bạn đã xem hết lời mời kết bạn đã nhận"
}

function append_to_list_contact_sent(data){
  $('#content-list-contacts-sent').append(`
    <li data-uid="${data.user_id}" >
        <a data-uid="${data.user_id}" href="javascript: void(0);" >
            <div class="media">
                <div class="chat-user-img align-self-center mr-3 user-profile-show">
                    <img src="/assets/images/users/${data.avatar}" class="rounded-circle avatar-xs" alt="">
                </div>
                <div class="media-body overflow-hidden user-profile-show">
                    <h5 class="text-truncate font-size-15 mb-1">${data.username}</h5>
                    <div class="font-size-11">${data.human_time}</div>
                </div>
                <div data-uid="${data.user_id}" class="btn-cancel-contact-sent btn btn-danger font-size-10 btn-lg chat-send waves-effect waves-light">Hủy</div>
            </div>
        </a>
    </li>`)

    show_user_profile()
    cancel_contact_sent()
}

function append_to_list_contact_received(data){
  $('#content-list-contacts-received').append(`
  <li data-uid="${data.user_id}" >
    <a data-uid="${data.user_id}" href="javascript: void(0);" >
        <div class="media">
            <div class="chat-user-img align-self-center mr-3 user-profile-show">
              <img src="/assets/images/users/${data.avatar}" class="rounded-circle avatar-xs" alt="">
            </div>
            <div class="media-body overflow-hidden user-profile-show">
                <h5 class="text-truncate font-size-15 mb-1">${data.username}</h5>
                <div class="font-size-11">${data.human_time}</div>
            </div>
            <div data-uid="${data.user_id}" class="btn-accept-contact-received btn btn-primary font-size-10 btn-lg chat-send waves-effect waves-light mr-1">Chấp nhận</div>
            <div data-uid="${data.user_id}" class="btn-cancel-contact-received btn btn-danger font-size-10 btn-lg chat-send waves-effect waves-light">Hủy</div>
        </div>
    </a>
  </li>`)

  show_user_profile()
  cancel_contact_received()
  accept_contact_received()
}

function read_more_request_contact(){
  let wrap_list_req_received = $("#content-list-contacts-received").parents(".simplebar-content-wrapper")
  let wrap_list_req_sent = $("#content-list-contacts-sent").parents(".simplebar-content-wrapper")

  let list_req_received = $("#content-list-contacts-received li")
  let list_req_sent = $("#content-list-contacts-sent li")

  let stt_send_data_req_received = 0;
  let stt_send_data_req_sent = 0;

  wrap_list_req_sent.on('scroll', function(){
    if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 300 && list_req_sent.length >= 20) {
      stt_send_data_req_sent += 1;

      if(stt_send_data_req_sent == 1) {
          let total_req = $("#content-list-contacts-sent li").length

          $('#content-list-contacts-sent').append(lazy_loadings)

          $.ajax({
              type: "GET",
              url: `/read-more-request-contact/${total_req}/sent`,
              success: function(data) {
                  $('#content-list-contacts-sent').find('.lazy-load').remove()
                  console.log(data)
                  data.forEach(function(req_sent){
                    append_to_list_contact_sent(req_sent)
                  })

                  stt_send_data_req_sent = 0
              },
              error: function(){
                  $('#content-list-contacts-sent').find('.lazy-load').remove()
                  alertify.success(message_read_more_contact.seen_all_req_sent)
              }
          })
      }
    }
  })

  wrap_list_req_received.on('scroll', function(){
    if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight - 300 && list_req_received.length >= 20) {
      stt_send_data_req_received += 1;

      if(stt_send_data_req_received == 1) {
          let total_req = $("#content-list-contacts-received li").length

          $('#content-list-contacts-received').append(lazy_loadings)

          $.ajax({
              type: "GET",
              url: `/read-more-request-contact/${total_req}/received`,
              success: function(data) {
                  $('#content-list-contacts-received').find('.lazy-load').remove()
                  console.log(data)
                  data.forEach(function(req_received){
                    append_to_list_contact_received(req_received)
                  })

                  stt_send_data_req_received = 0
              },
              error: function(){
                  $('#content-list-contacts-received').find('.lazy-load').remove()
                  alertify.success(message_read_more_contact.seen_all_req_received)
              }
          })
      }
    }
  })
}

$(document).ready(function(){
  read_more_request_contact()
})