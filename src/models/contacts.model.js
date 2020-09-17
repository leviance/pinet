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
    },

    find_contact_received(user_id){
        return this.find({
            $and: [
                {"receiver_id": user_id},
                {"status": false}
            ]
        }).sort({"created_at": -1}).exec()
    },

    remove_contact(sender_req_id, receiver_req_id){
        return this.deleteOne({
            "sender_id": sender_req_id,
            "receiver_id": receiver_req_id
        }).exec()
    },

    find_contact(sender_req_id, receiver_req_id){
        return this.findOne({
            "sender_id": sender_req_id,
            "receiver_id": receiver_req_id
        }).exec()
    },

    count_contact_received(user_id){
        return this.countDocuments({
            "receiver_id": user_id,
            "status": false
        }).exec()
    },

    count_contact_sent(user_id){
        return this.countDocuments({
            "sender_id": user_id,
            "status": false
        }).exec()
    },

    accept_contact_received(sender_id,receiver_id){
        return this.updateOne({
            "sender_id": sender_id,
            "receiver_id": receiver_id
        },{"status": true}).exec()
    }
}

module.exports = mongoose.model('contacts',contacts_schema)