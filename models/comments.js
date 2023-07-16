const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user_email: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    creation_date: {
        type: Date,
        default: new Date()
    },
    post_id: {
        type: String,
        required: true
    }
}) 

module.exports = mongoose.model("Comment", CommentSchema)