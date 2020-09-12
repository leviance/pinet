const express = require('express')
const {home_controller, auth_controller, user_controller, contact_controller} = require('../controllers/index')
const {auth_valid} = require('../validation/index')

const passport = require('passport')
const init_passport_facebook = require('../controllers/passport_controllers/facebook')
const init_passport_google = require('../controllers/passport_controllers/google')

init_passport_facebook()
init_passport_google()

let router = express.Router()

function init_routes(app) {
  router.get('/', home_controller)
  router.get('/login',auth_controller.render_login_page)
  router.get('/register',auth_controller.render_register_page)
  router.get('/recover',auth_controller.render_recover_account_page)
  router.get('/logout', auth_controller.user_logout)

  router.post("/user-create-new-account",auth_valid.register_valid, auth_controller.create_new_account)
  router.get("/active-account/:token",auth_controller.user_active_account)

  router.get("/recover-account/:email",auth_valid.valid_email,auth_controller.send_verify_code)
  router.get("/send-verify-code/:verify_code/:email",auth_valid.valid_verify_code,auth_controller.recover_user_password)
  
  router.post("/user-login",auth_valid.verify_user_login, auth_controller.user_login)

  // router for login with facebook
  router.get('/auth/facebook',passport.authenticate('facebook',{scope : ["email"]}));
  router.get('/auth/facebook/callback',passport.authenticate('facebook', { failureRedirect: '/login'}),auth_controller.login_with_app);

  // router for login with google
  router.get('/auth/google',passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login','https://www.googleapis.com/auth/userinfo.email'] }));
  router.get('/auth/google/callback',passport.authenticate('google', { failureRedirect: '/login' }),auth_controller.login_with_app);

  router.put('/user-upload-avatar',auth_controller.check_login,user_controller.user_upload_avatar)
  router.put('/user-edit-information',auth_controller.check_login,user_controller.user_edit_information)
  router.get("/verify-to-change-email/:verify_code/:new_email/:old_email",auth_valid.valid_verify_code,user_controller.user_change_email)

  router.get('/search-friend-to-add-contact-:key_word', contact_controller.search_friend_to_add_contact)
  router.put('/send-request-contact-:receiver_req_id', contact_controller.send_request_contact)


  // catch 404 and forward to error handler
  router.use(function(req, res, next) {
    // respond with html page
    return res.render('./404_page/index')
  });
  
  return app.use('/', router)
}

module.exports = init_routes;