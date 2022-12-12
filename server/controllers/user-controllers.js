const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token = require('../models/emailToken');
const HttpError = require('../models/http-error');

//Create new account
const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { name, email, password, mobile, description } = req.body;


    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (err) {

        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }

    if (existingUser) {
        const error = new HttpError(
            'User exists already, please login instead.',
            422
        );
        return next(error);
    }

    let hashedPassword;

    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        const error = new HttpError(
            'Could not create user, please try again.',
            500
        );
        return next(error);
    }


    const createdUser = new User({
        name,
        description,
        email,
        image: req.file.path,
        password: hashedPassword,
        mobile,
        isAdmin: false,
        isActive: false,
        posts: [],
        favorites: []
    });
    try {
        const user = await createdUser.save();

        const token = await new Token({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`;
        const emailTemplate = `
            <div>
                   <h4>Email verification required</h4>
                   <p>
                        Click this link within 24 hours to complete your Blog account setup:
                    </p>
                   <a href=${url}>verify my email</a>
                   <p>
                        Thanks,
                        Jayesh Sojitra
                    </p>
        </div>`
        await sendEmail(user.email, "Activate your account", url, emailTemplate);

        res
            .status(201)
            .send({ message: "An Email sent to your account please verify" });

    } catch (err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }
};

const verifyUser = async (req, res, next) => {
    let user;
    try {
        //Find user
        user = await User.findOne({ _id: req.params.id });
        if (!user) {
            const error = new HttpError(
                'Invalid Link',
                400
            );
            return next(error);
        }
        // Find token
        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token
        });
        if (!token) {
            return res.status(400).json({ message: 'invalid Link' })
        }
        //Active user
        await User.updateOne({ _id: user._id, isActive: true });

        //Remove token
        await Token.deleteOne();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, please try again later.',
            500
        );
        return next(error);
    }

    res.status(200).json({ 'message': 'User verify successfully' })
}

//Login using valid credential
const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;

    try {
        existingUser = await User.findOne({ email });
    } catch (err) {

        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        return next(error);
    }


    if (existingUser && !existingUser.isActive) {
        const token = crypto.randomBytes(32).toString('hex')
        await Token.updateOne({ userId: existingUser._id, token: token, createdAt: Date.now() });

        const url = `${process.env.BASE_URL}user/${existingUser._id}/verify/${token}`
        const emailTemplate = `
        <div>
               <h4>Email verification required</h4>
               <p>
                    Click this link within 24 hours to complete your Blog account setup:
                </p>
               <a href=${url}>verify my email</a>
               <p>
                    Thanks,
                    Jayesh Sojitra
                </p>
    </div>`

        await sendEmail(email, 'Verify Email', url, emailTemplate)

        const error = new HttpError(
            'Your account is not active, please check your email and verify account',
            500);
        return next(error);
    }


    if (!existingUser) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            500
        );
        return next(error);
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password);
    } catch (err) {
        const error = new HttpError(
            'Could not log you in, please check your credentials and try again.',
            500
        );
        return next(error);
    }

    if (!isValidPassword) {
        const error = new HttpError(
            'Invalid credentials, could not log you in.',
            500
        );
        return next(error);
    }

    let token;
    const tokenUser = {
        userId: existingUser.id, email: existingUser.email
    }
    try {
        token = jwt.sign(
            tokenUser,
            process.env.TOKEN_KEY,
            { expiresIn: '1h' }
        );
    } catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        return next(error);
    }
    let refreshToken;
    try {
        refreshToken = jwt.sign(tokenUser, 'check_refresh', { expiresIn: process.env.REFRESH_TOKEN_EXPIRED });
    }
    catch (err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        return next(error);
    }


    res.status(201).json({
        userId: existingUser.id,
        name: existingUser.name,
        description: existingUser.description,
        email: existingUser.email,
        image: existingUser.image,
        mobile: existingUser.mobile,
        isAdmin: existingUser.isAdmin,
        refreshToken: refreshToken,
        token: token
    });
}

const verifyToken = async (req, res, next) => {
    const { refreshToken } = req.body
    let newToken;
    let decodedToken;
    if (refreshToken) {
        try {
            decodedToken = jwt.verify(refreshToken, 'check_refresh');
            const tokenUser = {
                userId: decodedToken.userId,
                email: decodedToken.email
            }
            newToken = jwt.sign(
                tokenUser,
                process.env.TOKEN_KEY,
                { expiresIn: '1h' }
            );
        }
        catch (err) {
            const error = new HttpError(
                'Something went wrong, please try again later.',
                500
            );
            return next(error);
        }
    }
    else {
        const error = new HttpError(
            'Something went wrong, please try again later.',
            500
        );
        return next(error);
    }
    let existingUser;
    try {
        existingUser = await User.findOne({ email: decodedToken.email });
    }
    catch (err) {
        const error = new HttpError(
            'Something went wrong, please try again later.',
            500
        );
        return next(error);
    }
    res.status(200).json({
        userId: existingUser.id,
        name: existingUser.name,
        description: existingUser.description,
        email: existingUser.email,
        image: existingUser.image,
        mobile: existingUser.mobile,
        isAdmin: existingUser.isAdmin,
        refreshToken: refreshToken,
        token: newToken
    });

}

const forgotPassword = async (req, res, next) => {
    const email = req.body.email;
    let user;
    try {
        user = await User.findOne({ email });
    }
    catch (err) {
        const error = new HttpError(
            'Something went wrong, please try again later.',
            500
        );
        return next(error);
    }

    if (user) {
        try {
            const token = jwt.sign(
                { email: email, id: user.id }, // object and not string
                process.env.TOKEN_KEY,
                { expiresIn: '1h' } // added days, default for ex 60 would be ms, you can also provide '1h' etc
            )
            const url = `${process.env.BASE_URL}user/${user.id}/verify-password/${token}`;

            const emailTemplate = `
        <div>
               <h4>Email verification required</h4>
               <p>
                    Click this link within 24 hours to complete your Blog account setup:
                </p>
               <a href=${url}>Forgot your password</a>
               <p>
                    Thanks,
                    Jayesh Sojitra
                </p>
    </div>`
            await sendEmail(user.email, "Forgot your password", url, emailTemplate);

            return res
                .status(201)
                .send({ message: "An Email sent to your account please verify" });
        }
        catch (err) {
            console.log(err)
            const error = new HttpError(
                'Something went wrong, please try again later.',
                500
            );
            return next(error);
        }
    }
    res.status(200).json({ message: 'An Email sent to your account please verify' })
}

const updatePassword = async (req, res, next) => {
    const { userId, password } = req.body;
    let user;
    try {
        //Find user
        user = await User.findOne({ _id: userId });

        if (!user) {
            const error = new HttpError(
                'Invalid Link',
                400
            );
            return next(error);
        }
        let hashedPassword;

        try {
            hashedPassword = await bcrypt.hash(password, 12);
        } catch (err) {
            console.log("err::", err)
            const error = new HttpError(
                'Could not update password, please try again.',
                500
            );
            return next(error);
        }

        //Active user
        await User.updateOne({ _id: userId, password: hashedPassword });
    }
    catch (err) {
        const error = new HttpError(
            'Could not update password, please try again.',
            500
        );
        next(error)
    }

    return res.status(200).json({ message: 'Password updated successfully' })
}
exports.signup = signup;
exports.login = login;
exports.verifyUser = verifyUser;
exports.verifyToken = verifyToken;
exports.forgotPassword = forgotPassword;
exports.updatePassword = updatePassword;