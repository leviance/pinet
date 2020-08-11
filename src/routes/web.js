const express = require('express')

let router = express.Router()

function init_routes(app) {
  router.get('/', (req, res) =>{
    return res.render('./home_page/index')
  })

  router.get('/user', (req, res) =>{
    return res.send("nice")
  })

  // catch 404 and forward to error handler
  router.use(function(req, res, next) {
    // respond with html page
    return res.render('./404_page/index')
  });
  
  return app.use('/', router)
}

module.exports = init_routes;