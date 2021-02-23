const {zoom_controller} = require('../controllers/index')

const Zoom_Router = (router) => {
  // get zoom token and user data 
  router.get('/zoom-auth-callback', zoom_controller.Authenticate_Zoom)

  //router.get('/zoom/access-meeting',)
  router.post('/user-click-btn-call-video', zoom_controller.User_Click_Btn_Call_Video)

  router.get('/zoom-user-uninstall', zoom_controller.Zoom_User_Uninstall)

  // For zoom authenticate Domain
  router.get('/zoomverify/verifyzoom', zoom_controller.Zoom_Auth_Domain)

  router.get('/zoom-notification', zoom_controller.Zoom_Notification)
}

module.exports = Zoom_Router