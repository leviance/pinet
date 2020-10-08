const messages_model = require('../models/messages.model')
const contact_model = require('../models/contacts.model')
const user_model = require('../models/users.model')
const groups_model = require('../models/groups.model')

const _ = require('lodash');

const {send_message_error} = require('../../lang/vi')
const {app} = require('../config/app')

const convert_timestamp = require('../helper/convert_timestamp')

let get_persional_messages = (yourself_user_id,partner_id) => {
  return new Promise( async (resolve, reject) => {
    let skip = 0;
    let list_messages = await messages_model.get_list_messages(yourself_user_id,partner_id, skip)
    
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
      type: app.chat_personal,
    }
    
    let result_send_images_message = await messages_model.create_new(model)
    
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
      text: message,
      type: app.chat_personal,
    }

    let result_send = await messages_model.create_new(model)

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
        file_src: file_data.src,
        type: app.chat_personal,
      }
      
      let result_send_images_message = await messages_model.create_new(model)

      list_results.push(result_send_images_message)
    }

    return resolve(list_results)
  })
}

let get_list_messages = (user_id) => {
  return new Promise( async (resolve, reject) => {
    let list_friends = await contact_model.get_list_friends(user_id)
    let list_groups = await groups_model.get_list_group(user_id)
    let list_messages = []

    for (let i = 0; i < list_friends.length; i++) {
      let sender_contact_id = list_friends[i].sender_id
      let receiver_contact_id = list_friends[i].receiver_id
      let receiver_message_id = ""

      if(sender_contact_id != user_id) receiver_message_id = sender_contact_id
      if(receiver_contact_id != user_id) receiver_message = receiver_contact_id

      let have_sent_messages = await messages_model.check_sent_message(user_id,receiver_message_id)

      if(have_sent_messages.length > 0) list_messages.push(have_sent_messages[0])
    }

    for(let i = 0; i < list_groups.length; i++){
      let group_id = list_groups[i]._id
      
      let have_sent_messages = await messages_model.check_sent_message_in_group(group_id)

      if(have_sent_messages.length > 0) list_messages.push(have_sent_messages[0])

      if(have_sent_messages.length == 0) {
        let message = {
          receiver: {
              id: group_id,
              username: list_groups[i].group_name,
              avatar: list_groups[i].avatar
          },
          type: app.chat_group,
          is_read: true,
          file: null,
          images: [],
          text: list_groups[i].invite_message,
          created_at: list_groups[i].created_at
        }

        list_messages.push(message)
      }
    }

    // sort old -> new
    list_messages = _.sortBy(list_messages, ["created_at"])

    for(let i = 0; i < list_messages.length; i++) {
      list_messages[i].human_time = convert_timestamp(list_messages[i].created_at)
    }
    
    return resolve(list_messages)
  })
}

module.exports = {
  get_persional_messages,
  user_send_text_message_persional,
  user_send_file_image_persional,
  user_send_file_attachment_persional,
  get_list_messages
}
