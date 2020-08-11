let user_login = (req, res) => {
  return res.render('./login_page/auth-login')
}

let user_register = (req, res) => {
  return res.render('./register_page/auth-register')
}

let recover_account = (req, res) => {
  return res.render('./recover_page/auth-recoverpw')
}

module.exports = {
  user_login,
  user_register,
  recover_account
}