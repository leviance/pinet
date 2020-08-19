let home_controller = (req, res) =>{
  if(!req.session.user_id) return res.redirect("/login")
  return res.render('./home_page/index')
}

module.exports = home_controller