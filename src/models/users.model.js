const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let user_schema = new Schema({
    username: {type: String, default:"Aanonymous"},
    gender: {type: String, default:"male"},
    phone_number: {type: String, default: null},
    address: {type: String, default: null},
    avatar: {type: String, default: "avatar-defult.jpg"},
    role: {type: String, default: "user"},
    local: {
        name_account: String,
        email: {type: String, trim: true},
        password: String,
        is_active: {type: Boolean, default: false},
        verify_token: String
    },
    facebook: {
        uid: String,
        token: String,
        email: {type: String, trim: true}
    },
    google: {
        uid: String,
        token: String,
        email: {type: String, trim: true}
    },
    created_at: {type: Number, default: Date.now},
    updated_at: {type: Number, default: null},
    deleted_at: {type: Number, default: null}
  });

user_schema.statics = {
    create_new(email, name_account, password, token){
        return this.create({
            "local":{
                "name_account": name_account,
                "email": email,
                "password": password,
                "verify_token": token
            }
        })
    },

    find_user_by_email(email){
        return this.find({"local.email": email}).exec();
    },

    find_user_by_account(name_account){
        return this.find({"local.name_account": name_account}).exec();
    },

    active_account(token){
        return this.findOneAndUpdate({"local.verify_token": token},{"local.is_active": true}).exec();
    }

}


module.exports = mongoose.model('users', user_schema);

