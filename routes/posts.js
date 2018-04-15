const express = require('express');
const router = express.Router();

//Bring in Post Model
let Post = require('../models/post');
// Bring in User Model
let User = require('../models/user');

// Add Post Route
router.get('/add', ensureAuthenticated, function(req, res) {
    res.render('add_post');
});

// Add POST route for posts
router.post('/add', function(req, res) {
    req.checkBody('title', 'Title is required').notEmpty();
    // req.checkBody('author', 'Author is required').notEmpty();
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
        post.author = req.user._id;
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
        User.findById(post.author, function(err, user){
            let postedBy = false
            if(req.user != undefined) {
                if(req.user._id.toString() === user._id.toString()){
                    postedBy = true
                } 
            }
            res.render('post', {
                post: post,
                author: user.username,
                postedBy: postedBy
            });
        });
    });
});

// Get Single Post - Also keep safe while mess with above
// router.get('/:id', function(req, res) {
//     Post.findById(req.params.id, function (err, post) {
//         User.findById(post.author, function(err, user){
//             let postedBy = false
//             if(req.user._id.toString() === user._id.toString()){
//                 postedBy = true
//             } 
//             res.render('post', {
//                 post: post,
//                 author: user.username,
//                 postedBy: postedBy
//             });
//         });
//     });
// });

// Get Single Post -- Keep safe while I play with above
// router.get('/:id', function(req, res) {
//     Post.findById(req.params.id, function (err, post) {
//         User.findById(post.author, function(err, user){
//             res.render('post', {
//                 post: post,
//                 author: user.username
//             });
//         });
//     });
// });

// Edit Single Post --- TODO This route may need some work
router.get('/edit/:id', ensureAuthenticated, function(req, res) {
    Post.findById(req.params.id, function (err, post) {
        if(post.author != req.user._id) {
            req.flash('danger', 'Not Authorized');
            return res.redirect('/');
        }
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
    if(!req.user._id){
        res.status(500).send();
    }

    let query = {_id:req.params.id}

    Post.findById(req.params.id, function(err, post){
        if(post.author != req.user._id){
            res.status(500).send();
        } else {
            Post.remove(query, function(err) {
                if(err) {
                    console.log(err)
                }
                res.send('Success');
            });
        }
    })
});

// Access control
function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('danger', 'Please Login');
        res.redirect('/users/login');
    }
}

module.exports = router;