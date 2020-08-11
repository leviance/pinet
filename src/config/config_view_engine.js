const ejs_extend = require('express-ejs-extend')
const express = require('express')

let config_view_engine = (app) => {
  app.engine('ejs', ejs_extend);
  app.set('view engine', 'ejs');
  app.set('views', './src/views');
  app.use(express.static('./src/public'))
}

module.exports = config_view_engine