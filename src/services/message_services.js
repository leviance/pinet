const chat_personal_model = require('../models/chat_personal.model')
const contact_model = require('../models/contacts.model')
const user_model = require('../models/users.model')
const {send_message_error} = require('../../lang/vi')

const convert_timestamp = require('../helper/convert_timestamp')

let get_persional_messages = (yourself_user_id,partner_id) => {
  return new Promise( async (resolve, reject) => {
    let skip = 0;
    let list_messages = await chat_personal_model.get_list_messages(yourself_user_id,partner_id, skip)
    
    let list_messages_info = []

    // convert timestamp to human time
    for (let i = 0; i < list_messages.length; i++){
      let message = list_messages[i];

      list_messages_info.push({
        _id: message._id,
        sender: {
          id: message.sender.id,
          username: message.sender.username,
          avatar: message.sender.avatar
        },
        receiver: {
          id: message.receiver.id,
          username: message.receiver.username,
          avatar: message.receiver.avatar
        },
        human_time: convert_timestamp(message.created_at),
        text: message.text,
        file: message.file,
        file_size: message.file_size,
        images: message.images,
        updated_at: convert_timestamp(message.updated_at)
      })
    }
    
    return resolve(list_messages_info)
  })
}

let user_send_file_image_persional = (sender_id,receiver_id,src_images) => {
  return new Promise( async (resolve, reject) => {
    let check_has_contact = await contact_model.check_has_contact(sender_id,receiver_id)
    if(check_has_contact == null) return reject(send_message_error.not_friend)
    
    let sender_profile = await user_model.find_user_by_id(sender_id);
    let receiver_profile = await user_model.find_user_by_id(receiver_id)

    let model = {
      sender: {
        id: sender_profile._id,
        username: sender_profile.username,
        avatar: sender_profile.avatar
      },
      receiver: {
        id: receiver_profile._id,
        username: receiver_profile.username,
        avatar: receiver_profile.avatar
      },
      images: src_images,
    }
    
    let result_send_images_message = await chat_personal_model.user_send_message_persional(model)
    
    return resolve(result_send_images_message)
  })
}

let user_send_text_message_persional = (sender, receiver_id, message) => {
  return new Promise( async (resolve, reject) => {
    let check_has_contact = await contact_model.check_has_contact(sender.id,receiver_id)
    if(check_has_contact == null) return reject()

    let receiver_profile = await user_model.find_user_by_id(receiver_id)

    let model = {
      sender,
      receiver: {
        id: receiver_profile._id,
        username: receiver_profile.username,
        avatar: receiver_profile.avatar
      },
      text: message
    }

    let result_send = await chat_personal_model.user_send_message_persional(model)

    return resolve(result_send)
  })


}

let user_send_file_attachment_persional = (sender_id,receiver_id,files_data) => {
  return new Promise( async (resolve, reject) => {
    let check_has_contact = await contact_model.check_has_contact(sender_id,receiver_id)
    if(check_has_contact == null) return reject(send_message_error.not_friend)
    
    let sender_profile = await user_model.find_user_by_id(sender_id);
    let receiver_profile = await user_model.find_user_by_id(receiver_id)

    let list_results = []

    for(let i = 0; i < files_data.length; i++){
      let file_data = files_data[i]
      
      let model = {
        sender: {
          id: sender_profile._id,
          username: sender_profile.username,
          avatar: sender_profile.avatar
        },
        receiver: {
          id: receiver_profile._id,
          username: receiver_profile.username,
          avatar: receiver_profile.avatar
        },
        file: file_data.name,
        file_size: file_data.size,
        file_src: file_data.src
      }
      
      let result_send_images_message = await chat_personal_model.user_send_message_persional(model)

      list_results.push(result_send_images_message)
    }

    return resolve(list_results)
  })
}

module.exports = {
  get_persional_messages,
  user_send_text_message_persional,
  user_send_file_image_persional,
  user_send_file_attachment_persional
}
