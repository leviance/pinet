const express = require('express')
const {home_controller, auth_controller} = require('../controllers/index')

let router = express.Router()

function init_routes(app) {
  router.get('/', home_controller)

  router.get('/login',auth_controller.user_login)

  router.get('/register',auth_controller.user_register)

  router.get('/recover',auth_controller.recover_account)

  // catch 404 and forward to error handler
  router.use(function(req, res, next) {
    // respond with html page
    return res.render('./404_page/index')
  });
  
  return app.use('/', router)
}

module.exports = init_routes;