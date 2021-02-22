const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let zoom_schema = new Schema({
  user_id: String,
  created_at: {type: Number, default: Date.now},
  updated_at: {type: Number, default: null},
  deleted_at: {type: Number, default: null}
},{ strict: false });

zoom_schema.statics = {
  create_new(data_model){
    return this.create(data_model)
  },

  find_data_by_id(user_id){
    return this.findOne({"user_id" : user_id, "deleted_at": null}).exec();
  },

  remove_old_token(user_id){
    return this.deleteOne({"user_id" : user_id}).exec();
  },

  store_new_token(user_id, new_token){
    return this.update(
      {"user_id" : user_id},
      {"token" : new_token, "updated_at": Date.now()}
    ).exec();
  }
}

module.exports = mongoose.model('zoom_data',zoom_schema)