const { v4: uuidv4 } = require('uuid');
const send_mail = require('../config/send_mail')
const { trans_mails, register_valid_message } = require('../../lang/vi')
const user_model = require('../models/users.model')
const bcrypt = require('bcrypt');

const saltRounds = 1;

function create_new_account(email, name_account, password, url){ 
  return new Promise( async (resolve, reject) =>{
    let check_email_is_exist = await user_model.find_user_by_email(email);
    if(check_email_is_exist.length > 0) return reject(register_valid_message.email_used)

    let check_account_is_exist = await user_model.find_user_by_account(name_account);
    if(check_account_is_exist.length > 0) return reject(register_valid_message.name_account_used)
  
    let token = `${uuidv4()}${new Date().getTime()}`
    let link_active = `${url}/${token}}`
    let pass_hash = bcrypt.hashSync(password, saltRounds); // hash password
    
    send_mail(email,trans_mails.subject,trans_mails.html(link_active)).then(success => {
      // create new account
      user_model.create_new(email, name_account, pass_hash, token)
      return resolve("success")

    }).catch(error => {
      return reject(register_valid_message.email_incorrect)
    })
    

  })
}

module.exports = {
  create_new_account
}