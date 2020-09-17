const {user_services,contact_services} = require('../services/index')

let home_controller = async (req, res) =>{
  // feature check user agent and notify users do latter
  let user_id = req.session.user_id
  if(!user_id) return res.redirect("/login")

  let user = await user_services.get_data_user(user_id)
  let list_contact_sent = await contact_services.get_list_contact_sent(user_id)
  let list_contact_received = await contact_services.get_list_contact_received(user_id)
  let count_contact_received = await contact_services.count_contact_received(user_id)
  let count_contact_sent = await contact_services.count_contact_sent(user_id)
  
  return res.render('./home_page/index',{
    user,
    list_contact_sent,
    list_contact_received,
    count_contact_received,
    count_contact_sent
  })
}

module.exports = home_controller