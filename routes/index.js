var express = require('express');
var router = express.Router();
const post_controller = require('../controllers/postController')
const jwt = require('jsonwebtoken');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', (req, res) => {
    res.redirect("/posts");
})

router.get('/posts', post_controller.all_posts);

router.get('/posts/:id', post_controller.post_detail)

//this needs to be protected 
router.post('/posts/create', verifyToken, (req, res) => {
    res.json({
        message: 'Post created'
    });
});

router.post('/login', (req, res) => {
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
    const bearerHeader = res.headers['authorization'];

    if (typeof bearerHeader !== undefined) {

    } else {
        res.sendStatus(404);
    };
};

module.exports = router;
