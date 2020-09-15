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

// this call in show_result_search_friend in search_friend.js
function show_btn_interact_in_search_modal(){
  $('#btn-add-friend-in-model-search').bind('click', function(){
    let receiver_req_id = $(this).parent().parent().attr('data-uid');

    $(this).hide();
    $('#btn-cancel-add-friend-in-model-search').show();

    $(this).parents('.friend').remove()

    $.ajax({
      url: `/send-request-contact-${receiver_req_id}`,
      type: 'PUT',
      success: function(data) {
        prepend_to_list_contact_sent(data)
        cancel_contact_sent()
      },
      error: function(){
        alertify.error("Có lỗi bất ngờ xảy ra vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi!")
      }
    })
  })

  $('#btn-cancel-add-friend-in-model-search').bind('click', function(){
    $(this).hide();
    $('#btn-add-friend-in-model-search').show();
  })

}

function cancel_contact_sent(){
  $('#content-list-contacts-sent .btn-cancel-contact-sent').bind('click', function(){
    let receiver_id = $(this).attr('data-uid')
    let _this = $(this)
    _this.parents('li').css('opacity', 0.5)

    $.ajax({
      url: `/cancel-contact-sent-${receiver_id}`,
      type: "PUT",
      success: function(){
        _this.parents('li').remove();
      },
      error: function(){
        alertify.error("Đã có lỗi bất ngờ xảy ra. nếu trình trạng này còn tiếp tục vui lòng liên hệ bộ phận hỗ trợ của chúng tôi!")
      }
    })
  })
}

$(document).ready(function() {
  cancel_contact_sent()
})