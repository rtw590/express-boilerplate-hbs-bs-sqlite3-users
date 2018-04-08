const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

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

app.set('port', (process.env.PORT || 8000));

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

app.listen(app.get('port'), function () {
    console.log('Server started');
});