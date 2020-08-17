const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let verify_code_schemas = new Schema({
  type: String,
  email: String,
  verify_code: String,
  createdAt: {type: Date, default: Date.now}
})

// set expired time for document
verify_code_schemas.index( { "createdAt": 1 }, { expireAfterSeconds: 60 * 60} ) // set expried time for document 1 hour

// type of verify code
let type_verify_code = {
  "recover_account": "recover account code"
}

verify_code_schemas.statics = {
  create_recover_account_verify_code(email,verify_code){
    return this.create({
      "type": type_verify_code.recover_account,
      "email": email, 
      "verify_code": verify_code
    })
  },

  find_verify_code_recover_account(verify_code,email){
    return this.findOne({
      "email": email,
      "verify_code": verify_code, 
      "type": type_verify_code.recover_account
    }).exec();
  },

  remove_verify_code(email, verify_code){
    return this.remove({
      "email": email,
      "verify_code": verify_code
    })
  }

}

module.exports = mongoose.model("verify_code", verify_code_schemas)