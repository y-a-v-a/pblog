exports.list = function(req, res, next) {
    req.db.posts.find().toArray(function(error, posts){
        if (error) return next(error);
        res.render('list', {
          title: 'Post List',
          posts: posts || []
        });
      });
};

exports.new = function(req, res, next) {
    res.render('new', {
        title: 'Add new post'
    });
};

exports.add = function(req, res, next) {
    if (!req.body || !req.body.title) return next(new Error('No data provided.'));
    
    req.db.posts.save({
        title: req.body.title
    }, function(error, post) {
        if (error) return next(error);
        if (!post) return next(new Error('Failed to save.'));
        console.info('Added %s with id=%s', post.title, post._id);
        res.redirect('/list');
    });
};

exports.read = function(req, res, next) {
//     req.db.posts.find({ title: req.body.title }).toArray(function(error, posts) {
//         if (error) return next(error);
//         res.render('read', {
//             title: post.title,
//             post: post || []
//         });
//     });
    res.render('read', {
        title: res.post.title,
        post: res.post || {}
    });
};