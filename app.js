/**
 * Main app script
 */
var express = require('express');
var path = require('path');
var app = express();

var routes = require('./routes');
var posts = require('./routes/posts');
var mongoskin = require('mongoskin');
var db = mongoskin.db('mongodb://localhost:27017/posts?auto_reconnect', { safe: true });

app.use(function(req, res, next) {
  req.db = {};
  req.db.posts = db.collection('posts');
  next();
})
app.locals.appname = 'Express.js Programmers Log Book'

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
  secret: '1346D2F0-8F6E-11E3-BAA8-0800200C9A66'
}));
app.use(express.csrf());

app.use(require('less-middleware')({ src: __dirname + '/public', compress: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.locals._csrf = req.csrfToken();
  return next();
});


if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// define param post_id
app.param('post_id', function(req, res, next, postId) {
  req.db.posts.findById(postId, function(error, post) {
    if (error) return next(error);
    if (!post) return next(new Error('Post is not found.'));
    req.post = post;
    return next();
  });
});

// define param post_title
app.param('post_slug', function(req, res, next, postSlug) {
  req.db.posts.findOne({ slug: postSlug }, function(error, post) {
    if (error) return next(error);
    if (!post) return next(new Error('Post is not found.'));
    req.post = post;
    return next();
  });
});


app.get('/', posts.list);
//app.get('/list', posts.list);
app.get('/new', posts.new);
app.post('/new', posts.add);
app.get('/edit/:post_slug', posts.edit);
app.del('/:post_id', posts.del);


app.all('*', function(req, res){
  res.send(404);
})

app.listen(3000);

console.log('Listening on port 3000');