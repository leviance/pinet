const { validationResult } = require('express-validator');
const { auth_services } = require('../services/index')

let user_login = (req, res) => {
  return res.render('./login_page/auth-login')
}

let user_register = (req, res) => {
  return res.render('./register_page/auth-register')
}

let recover_account = (req, res) => {
  return res.render('./recover_page/auth-recoverpw')
}

let create_new_account = async (req, res) => {
  let result_valid = validationResult(req).errors;
  if(result_valid.length > 0) return res.status(500).send(result_valid[0].msg)

  let email = req.body.user_email,
      name_account = req.body.name_account,
      password = req.body.user_password;

  let url = `${req.protocol}://${req.get("host")}`

  try {
    let result = await auth_services.create_new_account(email,name_account,password,url)
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send(error)
  }
}

module.exports = {
  user_login,
  user_register,
  recover_account,
  create_new_account
}