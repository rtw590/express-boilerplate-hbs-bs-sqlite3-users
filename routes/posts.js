const express = require('express');
const router = express.Router();

//Bring in Post Model
let Post = require('../models/post');


// Add Post Route
router.get('/add', function(req, res) {
    res.render('add_post');
});

// Add POST route for posts
router.post('/add', function(req, res) {
    req.checkBody('title', 'Title is required').notEmpty();
    req.checkBody('author', 'Author is required').notEmpty();
    req.checkBody('body', 'Body is required').notEmpty();

    // get errors

    let errors = req.validationErrors();

    if(errors) {
        res.render('add_post', {
            errors:errors
        });
    } else {
        let post = new Post();
        post.title = req.body.title;
        post.author = req.body.author;
        post.body = req.body.body;

        post.save(function(err) {
            if (err) {
                console.log(err);
                return;
            } else {
                req.flash('success', 'Post Added');
                res.redirect('/');
            }
        });
    }
});

// Add POST route for commments
router.post('/comment/:id', function(req, res) {
    Post.findById(req.params.id, function (err, post) {
        post.comments.push({title: 'This needs to be User', body: req.body.body});
        post.save(function(err) {
            if (err) {
                console.log(err);
                return;
            } else {
                res.redirect('/posts/'+req.params.id);
            }
        });
    });

});

// Get Single Post
router.get('/:id', function(req, res) {
    Post.findById(req.params.id, function (err, post) {
        res.render('post', {
            post: post
        });
    });
});

// Edit Single Post
router.get('/edit/:id', function(req, res) {
    Post.findById(req.params.id, function (err, post) {
        res.render('edit_post', {
            post: post
        });
    });
});

//  POST to update posts
router.post('/edit/:id', function(req, res) {
    Post.findById(req.params.id, function (err, post) {
        post.title = req.body.title;
        post.author = req.body.author;
        post.body = req.body.body;
        post.save();
    });
    req.flash('success', 'Post Updated');
    res.redirect('/posts/'+req.params.id);
});

// Delete Post
router.delete('/:id', function(req, res) {
    let query = {_id:req.params.id}
    Post.remove(query, function(err) {
        if(err) {
            console.log(err)
        }
        res.send('Success');
    });
});

module.exports = router;