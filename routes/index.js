var express = require('express');
var router = express.Router();
const post_controller = require('../controllers/postController')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', (req, res) => {
    res.redirect("/posts");
})

router.get('/posts', post_controller.all_posts);

router.get('/posts/:id', post_controller.post_detail)

module.exports = router;
