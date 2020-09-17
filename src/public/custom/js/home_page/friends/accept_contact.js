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

        // handle real time accept contact
      },
      error: function(){
        alertify.error(error_undefine_mess)
      }
      
    })
  })
}

$(document).ready(function(){
  accept_contact_received()
})