var createError = require('http-errors');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const passport = require("passport");
require('dotenv').config();
const bcryptjs = require('bcryptjs');

const port = process.env.PORT || 5000;
const User = require('./models/user');

var app = express();

app.use(cors());

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

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

app.post('/posts/create', bodyParser.json(), verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretKey', async(err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      await Post.create({
        title: req.body.title,
        text: req.body.postcontent
      })
      res.json({
        message: 'Post created',
        authData,
        body: req.body
      });
    }
  });
});

app.post('/comments/create', bodyParser.json(), asyncHandler(async function(req, res) {
  await Comments.create({
    user_email: req.body.email,
    text: req.body.comment,
    post_id: req.body.postid
  });
}));

passport.use(
  new LocalStrategy(async(username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      };
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password" });
      };
      return done(null, user);
    } catch(err) {
      return done(err);
    };
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

app.post("/signup", bodyParser.json(), async(req, res) => {
  //TODO: handle if username or password is not string
  const hashPassword = await bcryptjs.hash(req.body.password, 10);
  const newUser = new User({
      username: req.body.username,
      password: hashPassword
  });
  await newUser.save();
  res.send("Sucess!!");
})

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  };
};

app.put('/posts/:postid', bodyParser.json(), asyncHandler(async(req, res) => {
  const doc = await Post.findById(req.body.id)
  doc.title = req.body.title;
  doc.text = req.body.text;
  doc.is_public = req.body.isPublic;
  await doc.save();
}));

app.delete('/posts/:postid', bodyParser.json(), asyncHandler(async(req, res) => {
  await Post.findByIdAndDelete(req.body.postid); 
}));

app.delete('/comments/:commentid', bodyParser.json(), asyncHandler(async(req, res) => {
  await Comments.findByIdAndDelete(req.body.commentid); 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

module.exports = app;
