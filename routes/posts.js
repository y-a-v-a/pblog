/**
 * Routing for posts
 */
exports.list = function(req, res, next) {
    req.db.posts.find({},{"sort":[['_id', 'desc']]}).toArray(function(error, posts){
        if (error) return next(error);
        res.render('list', {
          title: 'Post List',
          posts: posts || []
        });
      });
};

exports.new = function(req, res, next) {
    res.render('new', {
        title: 'Add new post',
        post: {}
    });
};

exports.add = function(req, res, next) {
    if (!req.body || !req.body.title) return next(new Error('No data provided.'));
    var data = {};
    if (req.body._id) {
        data['_id'] = req.db.posts.id(req.body._id);
    }
    data['title'] = req.body.title;
    data['slug'] = req.body.title.replace(/[^a-z0-9A-Z]+/g, '-');
    data['code'] = req.body.code;
    data['description'] = req.body.description;
    data['context'] = req.body.context;
    data['ref1'] = req.body.ref1;
    data['ref2'] = req.body.ref2;
    data['playground'] = req.body.playground;

    req.db.posts.save(data, function(error, post) {
        if (error) return next(error);
        if (!post) return next(new Error('Failed to save.'));
        if (post === 1) console.info('Updated %s', data._id.toHexString())
        else console.info('Added %s with id=%s', post.title, post._id.toHexString());
        res.redirect('/');
    });
};

exports.edit = function(req, res, next) {
    res.render('new', {
        title: req.post.title,
        post: req.post || {}
    });
};

exports.del = function(req, res, next) {
  req.db.posts.removeById(req.db.posts.id(req.post._id), function(error, count) {
    if (error) return next(error);
    if (count !==1) return next(new Error('Something went wrong.'));
    console.info('Deleted post %s with id=%s completed.', req.post.title, req.post._id.toHexString());
    res.send(200);
  });
};