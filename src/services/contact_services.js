const contact_model = require('../models/contacts.model')
const user_model = require('../models/users.model')
const convert_timestamp = require('../helper/convert_timestamp')
const notification_services = require('./notification_services')

const _ = require('lodash');

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
    let check_id = await user_model.find_user_by_id(receiver_req_id)
    if(!check_id) return reject()

    // check has contact
    let check_has_contact = await contact_model.find_contact(sender_req_id, receiver_req_id)
    
    if(check_has_contact != null) return reject()

    await contact_model.create_new(sender_req_id,receiver_req_id)

    notification_services.notif_recieved_request_contact(sender_req_id, receiver_req_id)

    let receiver_req_profile = check_id
    return resolve(receiver_req_profile)

  })
}

let get_list_contact_sent = (user_id) => {
  return new Promise( async (resolve, reject) => {
    let skip = 0;
    let list_contact_sent = await contact_model.find_contact_sent(user_id, skip)
    let list_contact_sent_infor = []

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

let get_list_contact_received = (user_id) => {
  return new Promise( async (resolve, reject) => {
    let skip = 0;
    let list_contact_received = await contact_model.find_contact_received(user_id, skip);
    let list_contact_received_infor = []

    // convert timestamp to human time
    for(let i = 0; i < list_contact_received.length; i++) {
      let contact = list_contact_received[i]
      let contact_info = await user_model.find_user_by_id(contact.sender_id)

      list_contact_received_infor.push({
        user_id: contact.sender_id,
        avatar: contact_info.avatar,
        username: contact_info.username,
        human_time: convert_timestamp(contact.created_at)
      })
    }
    
    return resolve(list_contact_received_infor)
  })
}

let cancel_contact_sent = (sender_id,receiver_id) => {
  return new Promise( async (resolve, reject) => {
    let result = await contact_model.remove_contact(sender_id, receiver_id)
    
    if(result.deletedCount == 0)  return reject()

    return resolve()
  })
}

let cancel_contact_received = (sender_id, user_id) => {
  return new Promise( async (resolve, reject) => {
    let receiver_id = user_id
    let result = await contact_model.remove_contact(sender_id, receiver_id)
    
    if(result.deletedCount == 0)  return reject()

    return resolve()
  })
}

let count_contact_received = (user_id) => {
  return new Promise( async (resolve, reject) => {
    let count_contact_received = await contact_model.count_contact_received(user_id)
    return resolve(count_contact_received)
  })
}

let count_contact_sent = (user_id) => {
  return new Promise( async (resolve, reject) => {
    let count_contact_sent = await contact_model.count_contact_sent(user_id)
    return resolve(count_contact_sent)
  })
}

let accept_contact_received = (id_user_sent_contact,id_user_receive_contact) => {
  return new Promise( async (resolve, reject) => {
    let check_is_receive_contact = await contact_model.find_contact(id_user_sent_contact,id_user_receive_contact)

    if(!check_is_receive_contact) return reject()

    await contact_model.accept_contact_received(id_user_sent_contact,id_user_receive_contact)

    notification_services.notif_accept_request_contact(id_user_sent_contact, id_user_receive_contact)

    return resolve()
  })
}

let get_list_friends = (user_id) => {
  return new Promise( async (resolve, reject) => {
    let list_contact = await contact_model.get_list_friends(user_id)

    let list_id = []
    list_contact.forEach( contact => {
      list_id.push(contact.sender_id)
      list_id.push(contact.receiver_id)
    })

  
    _.remove(list_id, function(id) {
      return id == user_id;
    });

    let list_friends = []

    for(let i = 0; i < list_id.length; i++) {
      let contact_id = list_id[i]
      let contact_info = await user_model.find_user_by_id(contact_id)

      list_friends.push({
        user_id: contact_id,
        avatar: contact_info.avatar,
        username: contact_info.username,
      })
    }

    return resolve(list_friends)
  })
}

let read_more_request_contact = (user_id,skip_contacts,type_contact_to_read_more) => {
  return new Promise( async (resolve, reject) => {
    if(type_contact_to_read_more == "sent"){
      let list_contact_sent = await contact_model.find_contact_sent(user_id,skip_contacts)

      if(list_contact_sent.length == 0)  return reject()

      let list_contact_sent_infor = []

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
    }
    if(type_contact_to_read_more == "received"){
      let list_contact_received= await contact_model.find_contact_received(user_id,skip_contacts)

      if(list_contact_received.length == 0) return reject()

      let list_contact_received_infor = []

      // convert timestamp to human time
      for(let i = 0; i < list_contact_received.length; i++) {
        let contact = list_contact_received[i]
        let contact_info = await user_model.find_user_by_id(contact.sender_id)

        list_contact_received_infor.push({
          user_id: contact.sender_id,
          avatar: contact_info.avatar,
          username: contact_info.username,
          human_time: convert_timestamp(contact.created_at)
        })
      }
      
      return resolve(list_contact_received_infor)
    }
  })
}

let check_has_contact = (sender_id,receiver_id) => {
  return new Promise( async (resolve, reject) => {
    let check_has_contact = await contact_model.check_has_contact(sender_id,receiver_id)
    
    return resolve(check_has_contact)
  })
}

module.exports = {
  search_friend_to_add_contact,
  send_request_contact,
  get_list_contact_sent,
  cancel_contact_sent,
  get_list_contact_received,
  cancel_contact_received,
  count_contact_received,
  count_contact_sent,
  accept_contact_received,
  get_list_friends,
  read_more_request_contact,
  check_has_contact
}