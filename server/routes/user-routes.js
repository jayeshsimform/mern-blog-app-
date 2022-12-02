const express = require('express');
const { check } = require('express-validator');
const userControllers = require('../controllers/user-controllers');
const fileUpload = require('../middleware/file-upload');
const router = express.Router();



//Create new account 
router.post('/auth/signup', [
    fileUpload.single('image'),
    [
        check('name')
            .not()
            .isEmpty(),
        check('description')
            .not()
            .isEmpty(),
        check('email')
            .normalizeEmail()
            .isEmail(),
        check('password').isLength({ min: 6 }),
        check('mobile').not()
            .isEmpty()
            .isLength({ min: 10, max: 13 }),
    ],
], userControllers.signup);

//Login
router.post('/auth/login', userControllers.login);

router.get('/user/:id/verify/:token', userControllers.verifyUser);
router.post('/token/refresh', userControllers.verifyToken);

router.post('/auth/forgot-password', userControllers.forgotPassword)
router.post('/user/update-password', userControllers.updatePassword)
module.exports = router;