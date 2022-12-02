const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    image: { type: String, required: true },
    mobile: { type: Number, required: true, minlength: 10 },
    isActive: { type: Boolean, required: false, },
    isAdmin: { type: Boolean, required: false, },
    description: { type: String, required: true, minlength: 20 },
    posts: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Post' }], // Add posts collection reference
    favorites: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Post' }], // Add posts collection reference
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema)