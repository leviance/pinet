const socket = io({reconnection: false})

let message_audio = new Audio('/assets/file/message.mp3');

const error_undefine_mess = "Có lỗi bất ngờ xảy ra vui lòng f5 lại trang. Nếu tình trạng này còn tiếp tục vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi!"

const message_validation_file = {
  image_type_incorrect : "File ảnh không hợp lệ. Chỉ chấp nhận jpg, png, gif, jpeg",
  image_size_incorrect : "Kích thước ảnh quá lớn!"
}

const lazy_loadings = `<div class="lazy-load">
                          <div class="wrap">
                            <div class="left"></div>
                            <div class="right"></div>
                          </div>
                        </div>`

const lazy_loadings_message_frame = ` <div class="loading-message-chat-frame">
                                        <div class="dot-carousel"></div>
                                      </div>`


function view_message_image(){
  $(".popup-img").magnificPopup({
    type: "image",
    closeOnContentClick: !0,
    mainClass: "mfp-img-mobile",
    image: {
        verticalFit: !0
    }
  })
}

function scroll_to_bottom_chat_frame(){
  $('.simplebar-content-wrapper').scrollTop($("#list-messages-frame").height());
}

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

function increase_total_tag(id){
  let btn_has_tag_show_total = $(`#${id}`)
  let tag_show_total = btn_has_tag_show_total.find('span.badge-soft-danger')
  
  if(tag_show_total.length === 0){
    btn_has_tag_show_total.append(`<span class="badge badge-soft-danger badge-pill">01</span>`)
  }

  else{
    let total = Number(tag_show_total.text()) + 1

    if(total < 10) tag_show_total.text(`0${total}`)

    else tag_show_total.text(`${total}`)
  }
}

function decrease_total_tag(id){
  let btn_has_tag_show_total = $(`#${id}`)
  let tag_show_total = btn_has_tag_show_total.find('span.badge-soft-danger')

  let total = Number(tag_show_total.text()) - 1

  if(total == 0) tag_show_total.remove()
  
  else {
    if(total < 10) tag_show_total.text(`0${total}`)

    else tag_show_total.text(`${total}`)
  } 
}

function show_user_profile(){
  $(".user-profile-show").click(function(){
    $(".user-profile-sidebar").show()
  })
}



$(document).ready(function(){
  show_and_hide_list_notify_list_req_contact()
  show_user_profile()
  view_message_image()
})