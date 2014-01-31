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
  secret: '59B93087-78BC-4EB9-993A-A61FC844F6C9'
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

app.param('post_id', function(req, res, next, postId) {
  req.db.posts.findById(postId, function(error, post) {
    if (error) return next(error);
    if (!post) return next(new Error('Post is not found.'));
    req.post = post;
    return next();
  });
});

app.param('post_title', function(req, res, next, postTitle) {
  req.db.posts.findOne({ slug: postTitle }, function(error, post) {
    if (error) return next(error);
    if (!post) return next(new Error('Post is not found.'));
    req.post = post;
    return next();
  });
});


app.get('/', routes.index);
app.get('/list', posts.list);
app.get('/new', posts.new);
app.post('/new', posts.add);
//app.get('/read/:post_id', posts.read);
app.get('/read/:post_title', posts.read);
app.del('/list/:post_id', posts.del);


app.all('*', function(req, res){
  res.send(404);
})

app.listen(3000);
console.log('Listening on port 3000');