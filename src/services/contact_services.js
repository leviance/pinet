const contact_model = require('../models/contacts.model')
const user_model = require('../models/users.model')
const convert_timestamp = require('../helper/convert_timestamp')

let search_friend_to_add_contact = (key_word,user_id) => {
  return new Promise( async (resolve, reject) => {
    let result_search = await user_model.find_by_keyword(key_word)
    
    // remove user send request search if user in result_search
    result_search.forEach( (item, index) => {
      if(item._id == user_id) result_search.splice(index, 1)
    })

    // remove users have contact with user send request
    let check_contact = await contact_model.find_contact_by_id(user_id)

    if(check_contact.length > 0) {
      check_contact.forEach((contact) => {
        result_search.forEach((user_infor, index) => {
          if(contact.sender_id == user_infor._id || contact.receiver_id == user_infor._id){
            result_search.splice(index, 1)
          }
        })
      })
    }

    if(result_search.length === 0) return reject()

    return resolve(result_search)
  })
}

let send_request_contact = (sender_req_id, receiver_req_id) => {
  return new Promise( async (resolve, reject) => {
    let check_id = user_model.find_user_by_id(receiver_req_id)
    if(!check_id) return reject()

    // check has contact
    let check_has_contact = await contact_model.find_contact(sender_req_id, receiver_req_id)
    
    if(check_has_contact != null) return reject()

    await contact_model.create_new(sender_req_id,receiver_req_id)
    
    let receiver_req_profile = check_id
    return resolve(receiver_req_profile)

  })
}

let get_list_contact_sent = (user_id) => {
  return new Promise( async (resolve, reject) => {
    let list_contact_sent = await contact_model.find_contact_sent(user_id)
    list_contact_sent_infor = []

    // convert timestamp to human time
    for(let i = 0; i < list_contact_sent.length; i++) {
      let contact = list_contact_sent[i]
      let contact_info = await user_model.find_user_by_id(contact.receiver_id)

      list_contact_sent_infor.push({
        user_id: contact.receiver_id,
        avatar: contact_info.avatar,
        username: contact_info.username,
        human_time: convert_timestamp(contact.created_at)
      })
    }
  
    return resolve(list_contact_sent_infor)
  })
}

let cancel_contact_sent = (sender_id,receiver_id) => {
  return new Promise( async (resolve, reject) => {
    let result = await contact_model.remove_contact(sender_id, receiver_id)
    
    if(result.deletedCount == 0)  return reject()

    return resolve()
  })
}

module.exports = {
  search_friend_to_add_contact,
  send_request_contact,
  get_list_contact_sent,
  cancel_contact_sent
}