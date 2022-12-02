const { validationResult } = require('express-validator');
const fs = require('fs');
const Post = require('../models/post');
const User = require('../models/user');
const HttpError = require('../models/http-error');
const mongoose = require('mongoose');

//Get all approved post
const getAllPosts = async (req, res, next) => {
    const userId = req?.userData?.userId
    let posts;

    try {
        posts = await Post.find().populate('userId', 'name image description favorites',);
    } catch (err) {
        const error = new HttpError(
            'Fetching posts failed, please try again later.',
            500
        );
        return next(error);
    }

    let user;
    if (userId) {
        try {
            user = await User.findById(userId);

        } catch (err) {
            const error = new HttpError(
                'Could not find post for the provided id.',
                500
            );
            return next(error);
        }
    }
    posts = posts.map(post => post.toObject({ getters: true })).map(post => {
        delete post.userId.favorites
        return {
            ...post,
            isFavorite: user?.favorites?.includes(post.id),
        }
    })

    res.json({ posts: posts });
}


//Get a post by post id
const getPostById = async (req, res, next) => {
    const postId = req.params.pid;
 const userId = req?.userData?.userId
    let post;
    try {
        post = await Post.findById(postId).populate('userId', 'name image description');
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, Could not find post for the provided id.',
            500
        );
        return next(error);
    }
    if (!post) {
        const error = new HttpError(
            'Could not find post for the provided id.',
            404
        );
        return next(error);
    }

    let user;
    if (userId) {
        try {
            user = await User.findById(userId);
            post.isFavorite = user.favorites.includes(postId)
        } catch (err) {
            const error = new HttpError(
                'Something went wrong, Could not find post for the provided id.',
                500
            );
            return next(error);
        }
    }

    res.json({ post: post.toObject({ getters: true }) });
}

//Create a new post
const createPost = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const { title, description, tags } = req.body;

    const createdPost = new Post({
        title,
        description,
        image: req.file.path,
        created_time: new Date(),
        updated_time: new Date(),
        userId: req.userData.userId,
        tags: JSON.parse(tags),
        isFavorite: false,
        isApproved: false
    });

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError(
            'Creating post failed, please try again.',
            500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Could not find user for provided id.', 404);
        return next(error);
    }

    try {
        await createdPost.save();
        user.posts.push(createdPost);
        await user.save();

    } catch (err) {
        const error = new HttpError(
            'Creating post failed, please try again.',
            500
        );
        return next(error);
    }
    res.status(201).json({ post: createdPost });
}

//Update a new post
const updatePost = async (req, res, next) => {
    const { title, description, tags } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }

    const postId = req.params.pid;

    let post;
    try {
        post = await Post.findById(postId).populate('userId', 'name image description',);;
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update post.',
            500
        );
        return next(error);
    }

    if (post.userId.id.toString() !== req.userData.userId) {
        const error = new HttpError('You are not allowed to edit this post.', 401);
        return next(error);
    }

    post.title = title;
    post.description = description;
    post.tags = tags;
    post.updated_time = new Date();

    try {
        await post.save();
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not update post.',
            500
        );
        return next(error);
    }

    res.status(200).json({ post: post.toObject({ getters: true }) });
}

//delete post
const deletePost = async (req, res, next) => {
    const postId = req.params.pid;
    let post;
    try {
        post = await Post.findById(postId).populate('userId');
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete post.',
            500
        );
        return next(error);
    }

    if (!post) {
        const error = new HttpError('Could not find post for this id.', 404);
        return next(error);
    }
    if (post.userId.id !== req.userData.userId) {
        const error = new HttpError(
            'You are not allowed to delete this post.',
            401
        );
        return next(error);
    }

    let user;
    try {
        user = await User.findById(req.userData.userId);
    } catch (err) {
        const error = new HttpError(
            'Could not find user for provided id.',
            500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Could not find user for provided id.', 404);
        return next(error);
    }

    try {
        await post.remove();
        user.posts.pull(postId);
        await user.save();
        const imagePath = post.image;

        fs.unlink(imagePath, err => {
            console.log(err);
        });
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete post.',
            500
        );
        return next(error);
    }
    res.status(200).json({ message: 'Deleted post!.' });

}
//Get list of post by user id
const getPostByUserId = async (req, res, next) => {
    const userId = req.userData.userId;
    let userWithPosts;
    try {
        userWithPosts = await User.findById(userId).populate({
            path: 'posts',
            populate: ({ path: 'userId', select: ['name', 'image', 'description'] })
        })
    } catch (err) {
        console.log({ err })
        const error = new HttpError(
            'Fetching posts failed, please try again later.',
            500
        );
        return next(error);
    }

    if (!userWithPosts || userWithPosts.length === 0) {
        return next(
            new HttpError('Could not find posts for the provided user id.', 404)
        );
    }
    let user;
    if (userId) {
        try {
            user = await User.findById(userId);
        } catch (err) {
            const error = new HttpError(
                'Could not find post for the provided id.',
                500
            );
            return next(error);
        }
    }

    let posts = userWithPosts.posts.map(post => post.toObject({ getters: true })).map((post, i) => {
        delete post.userId.favorites
        return {
            ...post,
            isFavorite: user.favorites.includes(post.id),
        }
    })

    res.json({ posts: posts });

}

//add post in favorite 
const favoritePost = async (req, res, next) => {
    const { postId, isFavorite } = req.body;
    const userId = req.userData.userId;

    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        const error = new HttpError(
            'Could not find post for provided id., please try again.',
            500
        );
        return next(error);
    }

    if (!user) {
        const error = new HttpError('Could not find user for provided id.', 404);
        return next(error);
    }
    try {
        if (isFavorite) {
            const session = await mongoose.startSession();
            session.startTransaction();
            user.favorites.push(postId);
            await user.save({ session: session });
            await session.commitTransaction();
        }
        else {
            const session = await mongoose.startSession();
            session.startTransaction();
            user.favorites.pull(postId);
            await user.save({ session: session });
            await session.commitTransaction();
        }
    } catch (err) {
        const error = new HttpError(
            'Adding favorite failed, please try again.',
            500
        );
        return next(error);
    }

    let post;
    try {
        post = await Post.findById(postId).populate('userId', 'name image description');
        post.isFavorite = isFavorite;
    } catch (err) {
        const error = new HttpError(
            'Could not find post for provided id., please try again.',
            500
        );
        return next(error);
    }
    res.status(201).json({
        post: post.toObject({ getters: true }),
    });

}
//Get favorite post
const getFavoritePosts = async (req, res, next) => {
    const userId = req.userData.userId;

    let userWithFavorite;
    try {
        userWithFavorite = await User.findById(userId).populate({
            path: 'favorites',
            populate: ({ path: 'userId', select: ['name', 'image', 'description'] })
        })
    } catch (err) {
        const error = new HttpError(
            'Fetching posts failed, please try again later.',
            500
        );
        return next(error);
    }

    let user;
    if (userId) {
        try {
            user = await User.findById(userId);
        } catch (err) {
            const error = new HttpError(
                'Could not find post for the provided id.',
                500
            );
            return next(error);
        }
    }
    let posts;

    posts = userWithFavorite.favorites.map(post =>
        post.toObject({ getters: true })
    )

    posts = posts.map((post) => {
        return {
            ...post,
            isFavorite: true
        }
    })
    res.status(200).json({ posts: posts });
}

exports.getAllPosts = getAllPosts;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.getPostById = getPostById;
exports.deletePost = deletePost;
exports.getPostByUserId = getPostByUserId;
exports.favoritePost = favoritePost;
exports.getFavoritePosts = getFavoritePosts;