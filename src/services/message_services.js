const messages_model = require('../models/messages.model')
const contact_model = require('../models/contacts.model')
const groups_model = require('../models/groups.model')
const user_model = require('../models/users.model')

const _ = require('lodash');

const {send_message_error} = require('../../lang/vi')
const {app} = require('../config/app')

const convert_timestamp = require('../helper/convert_timestamp')

let get_persional_messages = (yourself_user_id,partner_id) => {
  return new Promise( async (resolve, reject) => {
    let list_messages = await messages_model.get_list_messages_personal(yourself_user_id,partner_id, 0)
    
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
        type: message.type,
        updated_at: convert_timestamp(message.updated_at)
      })
    }
    
    return resolve(list_messages_info)
  })
}

let get_group_messages = (user_id,group_id) => {
  return new Promise( async (resolve, reject) => {
    let check_user_in_group = await groups_model.check_user_in_group(user_id, group_id)
    if(check_user_in_group == null) return reject()

    let list_messages = await messages_model.get_list_messages_group(group_id, 0)
    
    return resolve(list_messages)
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
      if(receiver_contact_id != user_id) receiver_message_id = receiver_contact_id

      let have_sent_messages = await messages_model.check_sent_message(user_id,receiver_message_id)

      if(have_sent_messages.length > 0){
        let message = {}

        if(user_id == have_sent_messages[0].receiver.id){
          message.partner_id = have_sent_messages[0].sender.id;
          message.partner_username = have_sent_messages[0].sender.username;
          message.partner_avatar = have_sent_messages[0].sender.avatar;
          message.created_at = have_sent_messages[0].created_at;
          message.type = "chat_personal"
          if(have_sent_messages[0].text != null) message.message = have_sent_messages[0].text
          if(have_sent_messages[0].file != null) message.message = `${have_sent_messages[0].sender.username} đã gửi cho bạn 1 file đính kèm.`
          if(have_sent_messages[0].images.length > 0) message.message = `${have_sent_messages[0].sender.username} đã gửi cho bạn 1 hình ảnh.`
        }
        else{
          message.partner_id = have_sent_messages[0].receiver.id;
          message.partner_username = have_sent_messages[0].receiver.username;
          message.partner_avatar = have_sent_messages[0].receiver.avatar;
          message.created_at = have_sent_messages[0].created_at;
          message.type = "chat_personal"
          if(have_sent_messages[0].text != null) message.message = `Bạn: ${have_sent_messages[0].text}`
          if(have_sent_messages[0].file != null) message.message = `Bạn đã gửi 1 file đính kèm.`
          if(have_sent_messages[0].images.length > 0) message.message = `Bạn đã gửi 1 hình ảnh.`
        }

        list_messages.push(message)
      }
    }

    for(let i = 0; i < list_groups.length; i++){
      let group_id = list_groups[i]._id
      let message = {}
      
      let have_sent_messages = await messages_model.check_sent_message_in_group(group_id)

      if(have_sent_messages.length > 0){
        message.partner_id = have_sent_messages[0].receiver.id;
        message.partner_username = have_sent_messages[0].receiver.username;
        message.partner_avatar = have_sent_messages[0].receiver.avatar;
        message.created_at = have_sent_messages[0].created_at;
        message.type = "chat_group"
        if(have_sent_messages[0].text != null) message.message = `${have_sent_messages[0].sender.username}: ${have_sent_messages[0].text}`
        if(have_sent_messages[0].file != null) message.message = `${have_sent_messages[0].sender.username} đã gửi 1 file đính kèm.`
        if(have_sent_messages[0].images.length > 0) message.message = `${have_sent_messages[0].sender.username} đã gửi 1 hình ảnh.`
      }

      if(have_sent_messages.length == 0) {
        message.partner_id = group_id;
        message.partner_username = list_groups[i].group_name
        message.partner_avatar = list_groups[i].avatar;
        message.message = list_groups[i].invite_message;
        message.created_at = list_groups[i].created_at;
        message.type = "chat_group"
      }
      
      list_messages.push(message)
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
  get_list_messages,
  get_group_messages
}
