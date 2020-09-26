const {contact_services} = require('../services/index')

let search_friend_to_add_contact = async (req, res) => {
  let key_word = req.params.key_word;
  let user_id = req.session.user_id
  
  try {
    let result_search = await contact_services.search_friend_to_add_contact(key_word,user_id)

    return res.status(200).send(result_search)
  } catch (error) {
    return res.status(500).send(error)
  }
}

let send_request_contact = async (req, res) => {
  let receiver_req_id = req.params.receiver_req_id;
  let sender_req_id = req.session.user_id;
  
  try {
    let receiver_req_profile = await contact_services.send_request_contact(sender_req_id, receiver_req_id)

    // edit data to send back
    let result = {
      user_id: receiver_req_profile._id,
      username: receiver_req_profile.username,
      avatar: receiver_req_profile.avatar,
      class: receiver_req_profile.class
    }
    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send()
  }
}

let cancel_contact_sent = async (req, res) => {
  let receiver_id = req.params.receiver_id;
  let sender_id = req.session.user_id

  try {
    await contact_services.cancel_contact_sent(sender_id,receiver_id)
    return res.status(200).send()
  } catch (error) {
    console.log(error)
    return res.status(500).send()
  }

  
}

let cancel_contact_received = async (req, res) => {
  let sender_id = req.params.sender_id;
  let user_id = req.session.user_id;

  try {
    await contact_services.cancel_contact_received(sender_id, user_id)
    return res.status(200).send()
    
  } catch (error) {
    return res.status(500).send()
  }
}

let accept_contact_received = async (req, res) => {
  let id_user_sent_contact = req.params.id_user_send_contact
  let id_user_receive_contact = req.session.user_id

  try {
      await contact_services.accept_contact_received(id_user_sent_contact,id_user_receive_contact)
      return res.status(200).send()
  } catch (error) {
      return res.status(500).send()
  }
}

let read_more_request_contact = async (req, res) => {
  let user_id = req.session.user_id;
  let skip_contacts = Number(req.params.total_req);
  let type_contact_to_read_more = req.params.type_contact;
  
  try {
    let list_req_contacts = await contact_services.read_more_request_contact(user_id,skip_contacts,type_contact_to_read_more)
    return res.status(200).send(list_req_contacts)
  } catch (error) {
    return res.status(500).send()
  }
}

module.exports = {
  search_friend_to_add_contact,
  send_request_contact,
  cancel_contact_sent,
  cancel_contact_received,
  accept_contact_received,
  read_more_request_contact
}