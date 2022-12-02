const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    created_time: { type: Date, required: false },
    updated_time: { type: Date, required: false },
    isApproved: { type: String, required: true },
    isFavorite: { type: Boolean, required: true },
    tags: { type: Array, default: [], required: false },
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' } // Add user collection reference
});

module.exports = mongoose.model('Post', postSchema);
