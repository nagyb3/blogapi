const Comments = require('../models/comments');
const Post = require('../models/post');
const asyncHandler = require('express-async-handler');

exports.all_posts = asyncHandler(async (req, res, next) => {
    const allPosts = await Post.find().exec();
    res.render("all_posts", {
      title: "All posts",
      all_posts: allPosts,
    });
});