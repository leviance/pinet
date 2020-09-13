const {user_services,contact_services} = require('../services/index')

let home_controller = async (req, res) =>{
  // feature check user agent and notify users do latter
  let user_id = req.session.user_id
  if(!user_id) return res.redirect("/login")

  let user = await user_services.get_data_user(user_id)
  let list_contact_sent = await contact_services.get_list_contact_sent(user_id)
  console.log(list_contact_sent)
  
  return res.render('./home_page/index',{
    user: user,
    list_contact_sent: list_contact_sent
  })
}

module.exports = home_controller