const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let user_schema = new Schema({
    username: String,
    gender: String,
    phone_number: {type: String, default: null},
    address: {type: String, default: null},
    avatar: {type: String, default: "avatar-defult.jpg"},
    role: {type: String, default: "user"},
    local: {
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
    find_by_name(name){
        return this.find({
            username: name
        })
    }
}


module.exports = mongoose.model('users', user_schema);

