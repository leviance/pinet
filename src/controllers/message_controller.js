const {message_services} = require('../services/index')
const {send_message_error} = require('../../lang/vi')
const upload_file = require('../helper/upload_file')

const emit_socket = require('../helper/emit_socket')

let user_send_file_image_persional = (req, res) => {

  upload_file.message_image(req, res, async (error) => {

    if(error) {
      if(error.message){
        return res.status(500).send(send_message_error.send_image_error)
      }

      return res.status(500).send(send_message_error.unspecified_error)
    }

    
    try {
      let sender_id = req.session.user_id
      let receiver_id = req.body.receiver_id
      let src_images = []
      
      req.files.forEach(file => {
        src_images.push(file.filename)
      })
      
      let result_send_images_message = await message_services.user_send_file_image_persional(sender_id,receiver_id,src_images)

      return res.status(200).send(result_send_images_message)

    } catch (error) {
      return res.status(500).send(error)
    }
  })

}


let get_persional_messages = async (req, res) => {
  try {
    let yourself_user_id = req.session.user_id;
    let partner_id = req.params.user_id;

    let list_messages = await message_services.get_persional_messages(yourself_user_id,partner_id)

    return res.status(200).send(list_messages)
  } catch (error) {
    return res.status(500).send()
  }
}

let user_send_text_message_persional = async (req, res) => {
  try {
    let sender = {
      id: req.session.user_id,
      username: req.session.username,
      avatar: req.session.avatar
    }
    let receiver_id = req.body.receiver_id;
    let message = req.body.message;

    let result_send = await message_services.user_send_text_message_persional(sender, receiver_id, message)
    
    let data_to_emit = {
      receiver_id: receiver_id,
      sender_id: sender.id,
      message: message
    }
    
    emit_socket("receiver-user-send-text-message",data_to_emit, req.io)

    return res.status(200).send(result_send)
  } catch (error) {
    return res.status(500).send(send_message_error.send_text_message_error)
  }
}

let user_send_file_attachment_persional = (req, res) => {
  upload_file.message_file(req, res, async (error) => {

    if(error) {
      if(error.message){
        return res.status(500).send(send_message_error.send_file_error)
      }

      return res.status(500).send(send_message_error.unspecified_error)
    }
    
    try {
      let sender_id = req.session.user_id
      let receiver_id = req.body.receiver_id
      
      let files_data = []
      let re = /^([A-Za-z0-9]*-)([A-Za-z0-9]*-)/

      req.files.forEach(file => {
        let filename = file.filename
        filename = filename.replace(re, "")

        let file_data = {
          name: filename,
          src: file.filename,
          size: file.size
        }
        files_data.push(file_data)
      })
      
      let list_results_send_files_message = await message_services.user_send_file_attachment_persional(sender_id,receiver_id,files_data)

      let data_to_emit = list_results_send_files_message
      data_to_emit.receiver_id = receiver_id
  
      emit_socket('receiver-user-send-attachment-message',data_to_emit, req.io)

      return res.status(200).send(list_results_send_files_message)

    } catch (error) {
      return res.status(500).send(error)
    }
  })
}


module.exports = {
  get_persional_messages,
  user_send_file_image_persional,
  user_send_text_message_persional,
  user_send_file_attachment_persional
}