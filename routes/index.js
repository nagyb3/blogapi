var express = require('express');
var router = express.Router();
const post_controller = require('../controllers/postController')

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', post_controller.all_posts);

module.exports = router;
