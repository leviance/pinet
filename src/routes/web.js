const express = require('express')
const {home_controller, auth_controller, user_controller, contact_controller, notification_controller, message_controller, group_controller,setting_controllers} = require('../controllers/index')
const {auth_valid} = require('../validation/index')

const passport = require('passport')
const init_passport_facebook = require('../controllers/passport_controllers/facebook')
const init_passport_google = require('../controllers/passport_controllers/google')

init_passport_facebook()
init_passport_google()

let router = express.Router();

function init_routes(app, io) {
  app.use(function(req,res,next){
    req.io = io;
    next();
  });

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
  router.put('/cancel-contact-sent-:receiver_id', contact_controller.cancel_contact_sent)
  router.put('/cancel-contact-received-:sender_id', contact_controller.cancel_contact_received)
  router.put('/accept-contact-received-:id_user_send_contact', contact_controller.accept_contact_received)


  router.put('/mark-notifications-as-read',notification_controller.mark_notifications_as_read)
  router.get('/read-more-notifications-:total_notifications',notification_controller.read_more_notifications)
  router.put('/remove-all-notifications',notification_controller.remove_all_notifications)

  router.get('/read-more-request-contact/:total_req/:type_contact',contact_controller.read_more_request_contact)

  router.get('/get-persional-messages/:user_id',message_controller.get_personal_messages)
  router.get('/get-group-messages/:user_id',message_controller.get_group_messages)

  router.post('/user-send-file-image-personal',message_controller.user_send_file_image_personal)
  router.post('/user-send-text-message-personal',message_controller.user_send_text_message_personal)
  router.post('/user-send-file-attachment-personal',message_controller.user_send_file_attachment_personal)

  router.post('/user-send-text-message-group',message_controller.user_send_text_message_group)
  router.post('/user-send-file-image-group',message_controller.user_send_file_image_group)
  router.post('/user-send-file-attachment-group',message_controller.user_send_file_attachment_group)

  router.get('/user-get-list-friend-to-create-group',group_controller.get_list_friends_to_create_group)
  router.post('/create-new-group',group_controller.create_new_group)

  router.post('/count-message-not-read',message_controller.count_message_not_read)

  router.get('/view-user-profile-:friend_id',user_controller.view_user_profile)
  router.get('/view-group-profile-:group_id',group_controller.view_group_profile)

  router.put('/user-change-view-mode',setting_controllers.user_change_view_mode)


  // terms and policies pages
  router.get('/terms-of-service', (req, res) =>{
    return res.render('./services_pages/terms_of_service')
  })
  
  router.get('/privacy', (req, res) =>{
    return res.render('./services_pages/privacy')
  })

  router.get('/support', (req, res) =>{
    return res.redirect("https://www.facebook.com/profile1.account.tab.id100009")
  })

  router.get('/zoom-user-uninstall', (req, res) =>{
    console.log("zoom-user-uninstall");
    console.log("-----------------------------------------------")
    console.log(req)
    console.log("-----------------------------------------------")
    return res.send(req)
  })

  router.get('/zoomverify/verifyzoom', (req, res) =>{
    return res.render('./services_pages/verifyzoom')
  })

  // catch 404 and forward to error handler
  router.use(function(req, res, next) {
    // respond with html page
    return res.render('./404_page/index')
  });
  
  return app.use('/', router)
}

module.exports = init_routes;