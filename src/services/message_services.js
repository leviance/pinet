const chat_personal_model = require('../models/chat_personal.model')
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

module.exports = {
  get_persional_messages
}
