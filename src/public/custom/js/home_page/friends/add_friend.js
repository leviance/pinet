function prepend_to_list_contact_sent(data){
  $('#content-list-contacts-sent').prepend(`
    <li>
        <a data-uid="${data.user_id}" href="javascript: void(0);" class="user-profile-show active">
            <div class="media">
                <div class="chat-user-img align-self-center mr-3">
                    <img src="/assets/images/users/${data.avatar}" class="rounded-circle avatar-xs" alt="">
                </div>
                <div class="media-body overflow-hidden">
                    <h5 class="text-truncate font-size-15 mb-1">${data.username}</h5>
                    <div class="font-size-11">Vừa xong</div>
                </div>
                <div data-uid="${data.user_id}" class="btn btn-danger font-size-10 btn-lg chat-send waves-effect waves-light">Hủy</div>
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

    $.ajax({
      url: `/send-request-contact-${receiver_req_id}`,
      type: 'PUT',
      success: function(data) {
        prepend_to_list_contact_sent(data)
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

$(document).ready(function() {
  
})