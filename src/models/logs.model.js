const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let log_schema = new Schema({
  user_id: String,
  log_type: String,
  created_at: {type: Number, default: Date.now},
  updated_at: {type: Number, default: null},
  deleted_at: {type: Number, default: null}
},{ strict: false });

log_schema.statics = {
  create_new(data_model){
    return this.create(data_model)
  },

  remove_log_data(user_id){
    return this.deleteOne({"user_id" : user_id}).exec();
  }
}

module.exports = mongoose.model("logs", log_schema)