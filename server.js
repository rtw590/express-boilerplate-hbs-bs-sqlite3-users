const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');

mongoose.connect('mongodb://localhost/blackhole');
let db = mongoose.connection;

// Check Connection
db.once('open', function() {
    console.log('Connected to Mongodb');
})

//Check for db errors
db.on('error', function(err) {
    console.log(err);
});

// Init the app
const app = express();

// Bring in Models
let Post = require('./models/post')

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Set Static Folder
app.use(express.static('public'));

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)();
  next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Home Route
app.get('/', function(req, res) {
    Post.find({}, function(err, posts) {
        if(err){
            console.log(err);
        } else {
            res.render('home', {
                posts: posts
            });
        }
    });
});

// Add Post Route
app.get('/posts/add', function(req, res) {
    res.render('add_post');
});

// Add POST route for posts
app.post('/posts/add', function(req, res) {
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
});

// Add POST route for commments
app.post('/posts/comment/:id', function(req, res) {
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
app.get('/posts/:id', function(req, res) {
    Post.findById(req.params.id, function (err, post) {
        res.render('post', {
            post: post
        });
    });
});

// Edit Single Post
app.get('/posts/edit/:id', function(req, res) {
    Post.findById(req.params.id, function (err, post) {
        res.render('edit_post', {
            post: post
        });
    });
});

//  POST to update posts
app.post('/posts/edit/:id', function(req, res) {
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
app.delete('/posts/:id', function(req, res) {
    let query = {_id:req.params.id}
    Post.remove(query, function(err) {
        if(err) {
            console.log(err)
        }
        res.send('Success');
    });
});

app.set('port', (process.env.PORT || 8000));

app.listen(app.get('port'), function () {
    console.log('Server started');
});