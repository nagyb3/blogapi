const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
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
    is_public: {
        type: Boolean,
        default: true
    }
})

PostSchema.virtual("url").get(function() {
    return `/posts/${this._id}`
})

module.exports = mongoose.model("Post", PostSchema)