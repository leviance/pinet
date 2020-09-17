const socket = io({reconnection: false})

const error_undefine_mess = "Có lỗi bất ngờ xảy ra vui lòng f5 lại trang. Nếu tình trạng này còn tiếp tục vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi!"

function show_and_hide_list_notify_list_req_contact(){
  $('#btn-list-notice-received').bind('click', function(){
    $('#list-notice-received').show();
    $('#list-contacts-sent').hide();
    $('#list-contacts-received').hide();

    $(this).addClass('active');
    $('#btn-list-contacts-sent').removeClass('active');
    $('#btn-list-contacts-received').removeClass('active');
  })

  $('#btn-list-contacts-sent').bind('click', function(){
    $('#list-notice-received').hide();
    $('#list-contacts-sent').show();
    $('#list-contacts-received').hide();

    $('#btn-list-notice-received').removeClass('active');
    $(this).addClass('active');
    $('#btn-list-contacts-received').removeClass('active');
  })

  $('#btn-list-contacts-received').bind('click', function(){
    $('#list-notice-received').hide();
    $('#list-contacts-sent').hide();
    $('#list-contacts-received').show();

    $('#btn-list-notice-received').removeClass('active');
    $('#btn-list-contacts-sent').removeClass('active');
    $(this).addClass('active');
  })
}

function show_user_profile(){
  $(".user-profile-show").click(function(){
    $(".user-profile-sidebar").show()
  })
}

$(document).ready(function(){
  show_and_hide_list_notify_list_req_contact()
  show_user_profile()


})