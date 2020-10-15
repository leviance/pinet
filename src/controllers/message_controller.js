const {message_services} = require('../services/index')
const {send_message_error} = require('../../lang/vi')
const upload_file = require('../helper/upload_file')

const message_socket = require('../socket_io/message_socket')
const emit_socket = require('../helper/emit_socket')

let user_send_file_image_personal = (req, res) => {
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
      
      let result_send_images_message = await message_services.user_send_file_image_personal(sender_id,receiver_id,src_images)

      message_socket.user_send_file_image_personal(result_send_images_message,req.io)

      return res.status(200).send(result_send_images_message)

    } catch (error) {
      return res.status(500).send(error)
    }
  })
}

let user_send_file_image_group = (req, res) => {
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
      
      let [result_send_images_message, group_profile] = await message_services.user_send_file_image_group(sender_id,receiver_id,src_images)

      message_socket.user_send_file_image_group(result_send_images_message,group_profile,req.io)

      return res.status(200).send(result_send_images_message)

    } catch (error) {
      return res.status(500).send(error)
    }
  })
}

let get_personal_messages = async (req, res) => {
  try {
    let yourself_user_id = req.session.user_id;
    let partner_id = req.params.user_id;

    let list_messages = await message_services.get_personal_messages(yourself_user_id,partner_id)

    return res.status(200).send(list_messages)
  } catch (error) {
    return res.status(500).send()
  }
}

let get_group_messages = async (req, res) => {
  try {
    let user_id = req.session.user_id;
    let group_id = req.params.user_id;

    let list_messages = await message_services.get_group_messages(user_id,group_id)

    return res.status(200).send(list_messages)
  } catch (error) {
    return res.status(500).send()
  }
}

let user_send_text_message_personal = async (req, res) => {
  try {
    let sender = {
      id: req.session.user_id,
      username: req.session.username,
      avatar: req.session.avatar
    }
    let receiver_id = req.body.receiver_id;
    let message = req.body.message;

    let result_send = await message_services.user_send_text_message_personal(sender, receiver_id, message)
    
    message_socket.user_send_text_message_personal(result_send,req.io)

    return res.status(200).send(result_send)
  } catch (error) {
    return res.status(500).send(send_message_error.send_text_message_error)
  }
}

let user_send_text_message_group = async (req, res) => {
  try {
    let sender = {
      id: req.session.user_id,
      username: req.session.username,
      avatar: req.session.avatar
    }
    let group_id = req.body.group_id;
    let message = req.body.message;

    let [result_send, group_data] = await message_services.user_send_text_message_group(sender, group_id, message)
    
    message_socket.user_send_text_message_group(result_send, group_data,req.io)

    return res.status(200).send(result_send)
  } catch (error) {
    return res.status(500).send(send_message_error.send_text_message_error)
  }
}

let user_send_file_attachment_personal = (req, res) => {
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
      
      let files_message = await message_services.user_send_file_attachment_persional(sender_id,receiver_id,files_data)

      let data_to_emit = files_message
      data_to_emit.receiver_id = receiver_id
  
      emit_socket('receiver-user-send-attachment-message',data_to_emit, req.io)

      return res.status(200).send(files_message)

    } catch (error) {
      return res.status(500).send(error)
    }
  })
}

let user_send_file_attachment_group = (req, res) => {
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
      
      let files_data = await upload_file.render_file_data_to_save_in_database(req.files)
      
      let [files_message, group_profile] = await message_services.user_send_file_attachment_group(sender_id,receiver_id,files_data)

      message_socket.user_send_file_attachment_group(files_message, group_profile, req.io)

      return res.status(200).send(files_message)
    } catch (error) {
      return res.status(500).send(error)
    }
  })
}

module.exports = {
  get_personal_messages,
  user_send_file_image_personal,
  user_send_text_message_personal,
  user_send_file_attachment_personal,
  get_group_messages,
  user_send_text_message_group,
  user_send_file_attachment_group,
  user_send_file_image_group
}