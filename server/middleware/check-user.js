const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN';      
        const decodedToken = jwt.verify(token, 'dev_blog_token_key');
        req.userData = { userId: decodedToken.userId };
        next()
    } catch (err) {
        next()
    }
};