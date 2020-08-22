let home_controller = (req, res) =>{
  // feature check user agent and notify users do latter
  if(!req.session.user_id) return res.redirect("/login")
  return res.render('./home_page/index',{
    
  })
}

module.exports = home_controller