const {check} = require('express-validator')

let register_valid = [
  check('user_email',"email").not().isEmpty().isEmail(),
  check('name_account',"account").isAlphanumeric().isLength({max:255}).isLength({min:1}),
  check('user_password',"password").isAlphanumeric().isLength({max:255}).isLength({min:1})
]

module.exports = {
  register_valid
}