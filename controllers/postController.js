const Post = require('../models/post');
const Comments = require('../models/comments')
const asyncHandler = require('express-async-handler');

exports.all_posts = asyncHandler(async (req, res, next) => {
    const allPosts = await Post.find().exec();
    res.render("all_posts", {
      title: "All posts",
      all_posts: allPosts,
    });
});

exports.post_detail = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).exec();
  const messagesList = await Comments.find({post_id: req.params.id})
  if (post === null) {
    const err = new Error("Post not found");
    err.status = 404;
    return next(err);
  }

  res.render("post_detail", {
    post: post,
    messages_list: messagesList
  });
});