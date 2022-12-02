const express = require('express');
const { check } = require('express-validator');
const postControllers = require('../controllers/post-controllers');
const checkAuth = require('../middleware/check-auth');
const checkUser = require('../middleware/check-user');
const fileUpload = require('../middleware/file-upload');
const router = express.Router();

//Get userId if user is loggedIn
router.use(checkUser);

//Get all active post
router.get('/', postControllers.getAllPosts);
//Get post using post id
router.get('/:pid', postControllers.getPostById);



//Validate user is authorize or not 
router.use(checkAuth);


//Create new post
router.post('/create',
    fileUpload.single('image'), [
    check('title').isLength({ min: 10 }),
    check('description').isLength({ min: 10 }),
], postControllers.createPost);

//Edit post
router.patch('/:pid',
    [
        check('title').isLength({ min: 10 }),
        check('description').isLength({ min: 10 }),
    ], postControllers.updatePost);

//delete post
router.delete('/:pid', postControllers.deletePost);

//get login user post
router.get('/user/my-posts/', postControllers.getPostByUserId);

//Add favorite post
router.get('/user/favorite', postControllers.getFavoritePosts);
//Get login user favorite post
router.patch('/user/favorite', postControllers.favoritePost)


module.exports = router;