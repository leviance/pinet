const { validationResult } = require('express-validator');
const { auth_services } = require('../services/index')
const { recover_account_valid_mess } = require('../../lang/vi')

let render_login_page = (req, res) => {
  return res.render('./login_page/auth-login')
}

let render_register_page = (req, res) => {
  return res.render('./register_page/auth-register')
}

let render_recover_account_page = (req, res) => {
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

let user_active_account = async (req, res) => {
  let token = req.params.token;
  
  try {
    let result_active = await auth_services.user_active_account(token);
    res.render("./active_account_page/active_account");
  } catch (error) {
    return res.render('./404_page/index')
  }
}

let send_verify_code = async (req, res) => {
  let user_email = req.params.email;
  let result_valid = validationResult(req).errors;

  if(result_valid.length > 0) return res.status(500).send(result_valid[0].msg)

  try {

    result_send_verify_code = await auth_services.send_verify_code(user_email)
    res.status(200).send(recover_account_valid_mess.recover_account_success)

  } catch (error) {

    res.status(500).send(error)

  }
}

let recover_user_password = async (req, res) => {
  let verify_code = req.params.verify_code;
  let user_email = req.params.email;
  let result_valid = validationResult(req).errors;
  
  if(result_valid.length > 0) return res.status(500).send(result_valid[0].msg)
  
  try {
    let result = await auth_services.recover_user_password(verify_code,user_email)
    return res.status(200).send(result)
  } catch (error) {
    return res.status(500).send(error)
  }
}

module.exports = {
  render_login_page,
  render_register_page,
  render_recover_account_page,
  create_new_account,
  user_active_account,
  send_verify_code,
  recover_user_password
}