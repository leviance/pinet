const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const uid = require('uid');

const send_mail = require('../config/send_mail')

const { trans_mails, 
        register_valid_message, 
        send_verify_code_mess, 
        recover_account_valid_mess, 
        send_new_password,
        user_login_mess
      } = require('../../lang/vi')

const user_model = require('../models/users.model')
const verify_code_model = require('../models/verify_code_model')


const saltRounds = 1;

let create_new_account = (email, name_account, password, url) => { 
  return new Promise( async (resolve, reject) =>{
    let check_email_is_exist = await user_model.find_user_by_email(email);
    if(check_email_is_exist.length > 0) return reject(register_valid_message.email_used)

    let check_account_is_exist = await user_model.find_user_by_account(name_account);
    if(check_account_is_exist) return reject(register_valid_message.name_account_used)
  
    let token = `${uuidv4()}${new Date().getTime()}`
    let link_active = `${url}/active-account/${token}`
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

let user_active_account = (token) => {
  return new Promise( async (resolve, reject) => {
    
    let result_active = await user_model.active_account(token);
    
    if(result_active) return resolve(result_active)

    return reject(result_active)
  })
}

let send_verify_code = (user_email) => {
  return new Promise( async (resolve, reject) => {

    let verify_code = uid();

    let result_recover = await user_model.find_user_by_email(user_email);
    
    // if not find email end the program 
    if(!result_recover || result_recover.length == 0) return reject(recover_account_valid_mess.email_incorrect)

    // send verify code to email 
    send_mail(user_email,send_verify_code_mess.subject,send_verify_code_mess.html(verify_code));

    verify_code_model.create_recover_account_verify_code(user_email,verify_code)

    return resolve()

  })
}

let recover_user_password = (verify_code,user_email) => {
  return new Promise( async (resolve, reject) => {
    // check verify code is exist
    let check_verify_code = await verify_code_model.find_verify_code_recover_account(verify_code,user_email)
    if(!check_verify_code) return reject(recover_account_valid_mess.verify_code_incorrect)
    
    // create new password
    let new_password = uid()
    let hash_password = bcrypt.hashSync(new_password, saltRounds); // hash password

    let result_recover = await user_model.user_recover_password(user_email,hash_password)

    if(result_recover.nModified == 0) return reject(recover_account_valid_mess.unknown_error)

    // send new password for user
    send_mail(user_email,send_new_password.subject,send_new_password.html(new_password))

    // remove verify code in database
    await verify_code_model.remove_verify_code(user_email,verify_code)
    
    return resolve(recover_account_valid_mess.recover_account_success)
  })
}

let user_login = (name_account,password) => {
  return new Promise( async (resolve, reject) => {
    // find name account in database
    let account = await user_model.find_user_by_account(name_account)
    
    // when not found account
    if(!account) return reject(user_login_mess.account_not_found)

    // when account deleted
    if(account.deleted_at != null) return reject(user_login_mess.account_deleted)

    // when account is not authenticated 
    if(account.is_active == "false") return reject(user_login_mess.account_is_not_authenticated)
  
    
    let check_password = await bcrypt.compare(password, account.local.password);

    if(!check_password) return reject(user_login_mess.password_wrong)
    
    return resolve(account)

  })
}

module.exports = {
  create_new_account,
  user_active_account,
  send_verify_code,
  recover_user_password,
  user_login
}