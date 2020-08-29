const {user_services} = require('../services/index')

let home_controller = async (req, res) =>{
  // feature check user agent and notify users do latter
  //console.log(req.session)
  if(!req.session.user_id) return res.redirect("/login")

  let user = await user_services.get_data_user(req.session.user_id)
  
  return res.render('./home_page/index',{
    user: user
  })
}

module.exports = home_controller