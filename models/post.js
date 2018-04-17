let mongoose = require('mongoose');

// post Schema
let commentSchema = mongoose.Schema({
    author:{
        type: String
    },
    body:{
        type: String,
        required: true
    },
    username:{
        type: String
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
    username:{
        type: String
    },
    votes:{
        type: Number
    },
    upvotedBy:[],
    comments: [commentSchema]
});

let Post = module.exports = mongoose.model('Post', postSchema);