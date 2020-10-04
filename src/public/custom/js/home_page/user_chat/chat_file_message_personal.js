let form_data_user_send_file_personal = null

function preview_file_before_send(files){
  console.log(files)
}

$(document).ready(function(){
  $('#btn-user-send-attachment-file').on('click', function(){
    $('#sub-btn-user-send-attachment-file').click()
  })

  $('#sub-btn-user-send-attachment-file').on('change', function(event){
    let files = event.target.files;
    let receiver_id = $('#chat-frame').attr('data-uid')
     
    $('#chat-frame .preview-file-attachment').show()
    preview_file_before_send(files)

    let form_data = new FormData()
    for(let i = 0; i < files.length; i++) {
      form_data.append('message_file', files[i])
    }

    form_data.append('receiver_id', receiver_id)

    form_data_user_send_image_personal = form_data
  })
})