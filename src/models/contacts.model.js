const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let contacts_schema = new Schema({
    sender_id: String,
    receiver_id: String,
    status: {type: Boolean, default: false},
    created_at: {type: Number, default: Date.now},
    updated_at: {type: Number, default: null},
    deleted_at: {type: Number, default: null}
});

contacts_schema.statics = {
    create_new(sender_req_id,receiver_req_id){
        return this.create({
            "sender_id": sender_req_id,
            "receiver_id": receiver_req_id
        })
    },

    find_contact_by_id(user_id){
        return this.find({
            $or: [
                {"sender_id": user_id},
                {"receiver_id": user_id}
            ]
        }).exec()
    },

    find_contact_sent(user_id){
        return this.find({
            $and: [
                {"sender_id": user_id},
                {"status": false}
            ]
        }).sort({"created_at": -1}).exec()
    }
}

module.exports = mongoose.model('contacts',contacts_schema)