let mongoose = require('mongoose');

// post Schema
let commentSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    }
});

let postSchema = mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    comments: [commentSchema]
});

let Post = module.exports = mongoose.model('Post', postSchema);