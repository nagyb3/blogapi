var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

require('dotenv').config();

const port = 5000;

var app = express();

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})

//added
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const Post = require('./models/post')
const Comments = require('./models/comments')

app.get('/', (req, res) => {
  res.redirect("/posts");
})

app.get('/posts', asyncHandler(async (req, res, next) => {
  const allPosts = await Post.find().exec();
  res.json(allPosts)
}));

app.get('/posts/:id', asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).exec();
  const messagesList = await Comments.find({post_id: req.params.id})
  if (post === null) {
    const err = new Error("Post not found");
    err.status = 404;
    return next(err);
  }
  if (typeof post !== undefined)  {
    res.json({post: post, comments: messagesList})
  } else {
    res.sendStatus(404);
  }
}));

app.post('/posts/create', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretKey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post created',
        authData
      });
    }
  });
});

app.post('/login', (req, res) => {
  //mock user
  const user = {
      id: 1,
      username: 'nagyb3',
      email: 'nagybence2003@gmail.com'
  };
  
  jwt.sign({user}, 'secretKey', (err, token) => {
      res.json({
          token
      })
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['Authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  };
};

//END --------

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

mongoose.set('strictQuery', false);
const mongoDB = process.env.MONGODB_URL;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

module.exports = app;
