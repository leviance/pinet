const {message_services} = require('../services/index')

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

module.exports = {
  get_persional_messages  
}